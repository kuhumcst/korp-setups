"""
Exporter: a Flask app for downloading all KWIC results from Korp.
Philip Diderichsen, 2023
"""

from gevent import monkey
monkey.patch_all()  # TODO Is this necessary?
import os
import re
import glob
import httpx
import json
import datetime
import math
import time
import logging
import multiprocessing as mp
import urllib.parse as urlp
from gevent import Greenlet
from flask import Flask, request, Response, render_template, jsonify, abort
from flask_socketio import SocketIO
import korpexport.exporter as ke  # From Kielipankki-korp-backend-fork
import tempfile

app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')
socketio = SocketIO(app,
                    async_mode='gevent',
                    cors_allowed_origins=["http://localhost:14000",
                                          "https://lanchartkorp.ku.dk",
                                          "https://lanchartpartitur.ku.dk"],
                    logger=False,  # False is the default
                    engineio_logger=logging)  # False is default. Set to logging (not True) to avoid duplicate logs.

# TODO Set this as an argument to the run flask app command
# If in Docker, use 'http://backend:1234...'. Using e.g. 'http://localhost:11234/query?' will give a httpx.ConnectError.
QUERY_ENDPOINT = 'http://backend:1234/query?'
TEMP_DATADIR = '/var/tmp/data'  # Dir for temp files from successive requests. (Make sure to map to Docker host volume).
TEMP_OUTDIR = '/var/tmp/output'  # Dir for the temp output file for download. (Make sure to map to Docker host volume).
N_TEMPFILES_TO_KEEP = 10  # Number of data and output temp files to keep when cleaning up old temp files.
REQUEST_TRIES = dict()
MAX_ROWS = 500000  # Our imposed row download limit.
ROWS_PER_REQUEST = 100  # How many rows to get from backend at a time. (1000 yields some retries, but not too many).
ROWS_PER_SEMISECOND = 42  # Data throughput of the exporter (based on experience). Determines interim progress speed.
N_REQUEST_TRIES = 6  # How many times to try fetching data from backend (with increasingly loose parameters).
PAUSE_AFTER_REQUEST = 2  # How many seconds to wait after each request.
PAUSE_AFTER_RETRY = 5  # How many seconds to wait after each retry of a given request.
CONNECTION_TIMEOUT = 10
READ_TIMEOUT = ROWS_PER_REQUEST / 3  # Timeout on response.iter_bytes() reads.
RESPONSE_ITER_BYTES_CHUNK_SIZE = 3000000  # How many bytes of data to get at a time in response.iter_bytes().
HARD_TIMEOUT = ROWS_PER_REQUEST / 3  # Timeout for custom overall timeout implemented using multiprocessing.
STATUS_STORE = dict()


@app.route('/download/<content_type>')
def download(content_type):
    """Download endpoint. Currently an HTML page with a download button and a progress bar."""
    # Make sure to add templates dir in Docker!
    return render_template('index.html')


@app.route('/getfile2/<content_type>')
def get_file2(content_type):
    """Endpoint that starts the generation of data to be downloaded and immediately returns a start message."""
    query_id = request.args.get('uid')
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.csv')
    Greenlet.spawn(generate_file, query_id, file_path)  # Start data generation in separate Greenlet.
    return jsonify({'status': 'Download started', 'query_id': query_id})


def generate_file(query_id, file_path):
    """Generate download file. In separate function in order to be able to run it in its own Greenlet."""
    with open(file_path, 'w') as f:
        for i in range(101):
            time.sleep(0.1)
            f.write(':-) ')
            # Update the progress in the status store
            STATUS_STORE[query_id] = i
            app.logger.info(f'Generator i, query_id: {i}, {query_id}')
    STATUS_STORE[query_id] = 100


@app.route('/download2/<query_id>', methods=['GET'])
def download_file(query_id):
    """Endpoint for serving the finished download file."""
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.csv')
    rsp = Response(generate_output_stream(file_path), mimetype='text/csv')
    rsp.headers.set('Content-Disposition', 'attachment', filename=create_filename('blahaa'))
    return rsp


@socketio.on('get_status', namespace='/status')
def get_status(uid):
    """Endpoint for emitting data generation status information."""
    progress = STATUS_STORE.get(uid, 0) if uid else 0
    socketio.emit('status', {'progress': progress, 'uid': uid}, to=request.sid, namespace='/status')


@app.route('/getfile/<content_type>')
def get_file(content_type):
    """Generate file downloads in various formats via Jyrki's korpexport package.
    Get query string/parameters. Remove start and end - successive values will be added in a loop.
    Write results of successive queries to temp file.
    Stream the response data in chunks using a generator.
    """
    start_time = datetime.datetime.now()
    query_id = request.args.get('uid')
    remove_old_tempfiles(TEMP_DATADIR, max_files=N_TEMPFILES_TO_KEEP)
    remove_old_tempfiles(TEMP_OUTDIR, max_files=N_TEMPFILES_TO_KEEP)
    query_params = urlp.parse_qs(request.query_string.decode('ascii'))
    query_params.pop('start', None)
    query_params.pop('end', None)
    start_arg = 0
    korp_hits_display = int(query_params.get('hits_display', ['0'])[0])  # Total hits according to Korp search.
    Greenlet.spawn(generate_real_file, start_arg, korp_hits_display, query_params, content_type, query_id)
    app.logger.info(f'Request tries: {str(REQUEST_TRIES)}')
    app.logger.info(make_download_duration_message(start_time, korp_hits_display))
    return jsonify({'status': 'Download started', 'query_id': query_id})


def generate_real_file(start_arg, korp_hits_display, query_params, content_type, query_id):
    """Wrapper for file writing function that makes sure the status is set to 100 when done."""
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.csv')
    with open(file_path, 'w') as outfile:
        write_download_file(start_arg, korp_hits_display, query_params, content_type, outfile, query_id)
    STATUS_STORE[query_id] = 100
    app.logger.info(f'Completed percent 100!')


def write_download_file(start_arg, korp_hits_display, query_params, content_type, outfile, query_id):
    """Loop through successive requests, transform results, write resulting rows to download file.
    Note how 'fetch_with_retry' returns the rows per request value needed to update the start_arg."""
    STATUS_STORE[query_id] = 0
    while start_arg <= korp_hits_display or start_arg < MAX_ROWS:
        app.logger.info('query_id: ' + str(query_id))
        app.logger.info('start_arg: ' + str(start_arg))
        if start_arg > MAX_ROWS:
            # TODO Add additional logic to return at most <max_rows> rows, but also not less!
            app.logger.info('Greater than max_rows! Breaking before further reading or writing.')
            break
        elif start_arg > korp_hits_display:
            app.logger.info('Greater than korp_hits_display! Breaking before further reading or writing.')
            break
        else:
            tf_name, temp_rows_per_request = robust_fetch_to_tempfile(start_arg, query_params, query_id)
            transformed_data = transform_backend_data(tf_name, content_type)
            download_content = 'JSONDecodeError. Data could not be formatted correctly.'
            if transformed_data is not None:
                download_content = format_data_with_bom(transformed_data, start_arg)
            outfile.write(download_content)
            app.logger.info('Waiting a few seconds before next request to give the server time to recover ...')
            time.sleep(PAUSE_AFTER_REQUEST)
            completed_rows = start_arg + temp_rows_per_request
            if completed_rows > korp_hits_display:
                completed_rows = korp_hits_display
            completed_percent = math.floor(completed_rows / korp_hits_display * 100)
            app.logger.info(f'Actual completed percent: {completed_percent}')
            STATUS_STORE[query_id] = completed_percent  # Set actual percentage when actual chunk is done
            start_arg += temp_rows_per_request


def robust_fetch_to_tempfile(start_arg, query_params, query_id):
    """Run backend request via 'run_with_timeout', which runs a separate Process using multiprocessing.
    It is designed like this in order to be able to abort long-running requests that don't fail as such.
    If the request fails, it is retried N_REQUEST_TRIES times with relaxed parameters."""
    client = httpx.Client()
    for i in range(1, N_REQUEST_TRIES + 1):
        update_request_tries(i)
        # Relax parameters: Decrease chunk_size exponentially, increase read timeout and hard timeout linearly.
        temp_rows_per_request = int(ROWS_PER_REQUEST / 2**i) * 2
        temp_read_timeout = int(READ_TIMEOUT + READ_TIMEOUT * i * .5 - READ_TIMEOUT/2)
        temp_hard_timeout = int(HARD_TIMEOUT + HARD_TIMEOUT * i * .5 - HARD_TIMEOUT/2)
        app.logger.info(f'Try number: {i}\nStart arg: {start_arg}\ntemp_rows_per_request: {temp_rows_per_request}\n'
                        f'Timeout: {temp_hard_timeout}\n\n')
        url = build_url(start_arg, query_params, temp_rows_per_request)
        try:
            # Get the data from the backend and write to tempfile. Retrieve the name of the tempfile.
            tf_name = run_with_timeout(func=stream_url_to_tempfile_with_retry,
                                       func_args=(client, url, temp_read_timeout),
                                       timeout=temp_hard_timeout)
            app.logger.info(f'Got filename: {tf_name}')
            return tf_name, temp_rows_per_request
        except httpx.HTTPError as e:
            # httpx.HTTPError could be httpx.RemoteProtocolError, httpx.ConnectError, httpx.ReadTimeout
            handle_backend_fail(i, e, query_id)
        except ChildProcessException as e:
            handle_backend_fail(i, e)
        except HardTimeoutException as e:
            handle_hard_timeout(start_arg, temp_rows_per_request, e, query_id)


def run_with_timeout(func, func_args, timeout):
    """Use multiprocessing to run a function with a hard timeout and httpx.HTTPError handling.
    Note: function 'func' must have a queue to write result to."""
    q = mp.Queue()
    p = mp.Process(target=func, args=(q,) + func_args)
    p.start()
    p.join(timeout=timeout)
    if p.is_alive():
        p.terminate()
        p.join()
        raise HardTimeoutException(f"Function '{func.__name__}' exceeded the timeout ({timeout}) and was terminated")
    else:
        result = q.get()
        if 'Error:' in result:
            raise ChildProcessException(f"Function '{func.__name__}' encountered an error: {result}")
    return result


def stream_url_to_tempfile_with_retry(queue, client, url, temp_read_timeout):
    """Use httpx client to stream data from the Korp backend. Write to tempfile.
    Designed for multiprocessing: Doesn't return but adds to the queue the name of the tempfile written to.
    Or an httpx exception, if encountered."""
    tf = tempfile.NamedTemporaryFile(delete=False, dir=TEMP_DATADIR)
    try:
        with tf as temp_file:
            # Total timeout for entire request. Timeouts set to None are governed by the total timeout.
            timeout = httpx.Timeout(1, pool=0, connect=CONNECTION_TIMEOUT, read=temp_read_timeout, write=None)
            with client.stream("GET", url, timeout=timeout) as response:
                app.logger.info('Opened httpx stream context handler ...')
                chunk_no = 1
                for chunk in response.iter_bytes(chunk_size=RESPONSE_ITER_BYTES_CHUNK_SIZE):
                    app.logger.info(f'Writing chunk {chunk_no} to "{temp_file.name}"..')
                    temp_file.write(chunk)
                    chunk_no += 1
            tf.flush()  # Empty Python's internal buffers to the operating system.
            os.fsync(tf.fileno())  # Ensure the operating system's buffers are written to disk.
        queue.put(tf.name)
    except httpx.HTTPError as e:
        queue.put(f'{get_root_exception(type(e))}: {type(e).__name__}: {str(e)}')


def transform_backend_data(tf_name, content_type):
    """Send tempfile content to Jyrki's data tranformation function 'make_download_file'.
    Return transformed data, or None if the JSON input data were corrupt."""
    with open(tf_name, 'rb') as saved_tempfile:
        saved_tempfile_content = saved_tempfile.read()
    form = {"query_result": saved_tempfile_content, "format": content_type}
    try:
        result = ke.make_download_file(form, form.get("korp_server", "KORP_SERVER"))
        return result
    except json.JSONDecodeError as e:
        app.logger.warning(f"JSONDecodeError: {e}")
        window = 40  # Print 40 characters before and after the error position
        start, end = max(0, e.pos - window), e.pos + window  # e.pos: error position
        app.logger.info(f"JSON around error position: {saved_tempfile_content[start:end]}\n")
        return None


def format_data_with_bom(transformed_backend_data, start_arg):
    """Format data returned by Jyrki's transformation function for download. Add a BOM to ensure interoperability."""
    result_charset = transformed_backend_data.get("download_charset", "utf-8")
    formatted_data_bytes = transformed_backend_data.get("download_content", "### No content :( ###")
    formatted_data = formatted_data_bytes.decode(result_charset, errors='replace')
    skip_header = bool(start_arg)  # If start_arg is not 0, skip_header is True.
    if skip_header:
        formatted_data = '\n'.join(formatted_data.splitlines()[13:]) + '\n'
    # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
    # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
    formatted_data_with_bom = '\uFEFF' + formatted_data
    return formatted_data_with_bom


"""--------------------------------  Utils  --------------------------------"""


class HardTimeoutException(Exception):
    """Custom exception for multiprocess timeouts."""
    pass


class ChildProcessException(Exception):
    """Custom exception for httpx.HTTPError in multiprocessing child process."""
    pass


def create_filename(cqp_string):
    """Generer filnavnet til den fil der skal downloades."""
    safe_cqp_string = '_'.join(re.findall(r'"(\w+)"', cqp_string))
    return f'korp_kwic_{safe_cqp_string}_{datetime.datetime.now().isoformat()}.csv'


def update_request_tries(i):
    """Update the retry counters in REQUEST_TRIES."""
    if str(i) in REQUEST_TRIES:
        REQUEST_TRIES[str(i)] += 1
    else:
        REQUEST_TRIES[str(i)] = 1


def build_url(start_arg, query_params, rows_per_request):
    """Build URL to get data with the current start_arg and end_arg."""
    query_params['start'] = [str(start_arg)]
    query_params['end'] = [str(start_arg + rows_per_request - 1)]
    url = QUERY_ENDPOINT + urlp.urlencode(query_params, doseq=True)
    # app.logger.info('url: ' + url)
    return url


def make_download_duration_message(start_time, korp_hits_display):
    """Make a log message about the download duration."""
    time_delta = datetime.datetime.now() - start_time
    total_seconds = time_delta.total_seconds()
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    return f'Total download duration: {int(minutes)} minutes {int(seconds)} seconds.'


def handle_backend_fail(i, e, query_id):
    """Handle failed request by logging a warning. Ultimately abort the whole download."""
    app.logger.warning(f'Trying again with smaller chunk because backend query failed or timed out. '
                       f'Error: {type(e).__name__}: {e}')
    if i == N_REQUEST_TRIES:
        app.logger.warning(f'Reached last try ({i}). Aborting.\n')
        msg = f"Download failed. Server didn't respond after several tries. Try increasing read timeout?"
        socketio.emit('abort', {'uid': query_id, 'reason': msg}, to=request.sid, namespace='/status')
        abort(500, msg)
    app.logger.info('Waiting a few seconds before next try to give the server time to recover ..')
    time.sleep(PAUSE_AFTER_RETRY)


def handle_hard_timeout(n, m, e, query_id):
    """Handle hard timeout when server request hangs."""
    msg = f"Download failed: Server timed out on request for rows {n}-{n + m - 1}. Try again later."
    app.logger.error(msg)
    app.logger.error(f"Error: {type(e).__name__}: {e}. Aborting.")
    socketio.emit('abort', {'uid': query_id, 'reason': msg}, to=request.sid, namespace='/status')
    abort(500, msg)


def get_root_exception(cls):
    """Get the class immediately below the 'Exception' class (most basic exception from a given module)."""
    while cls.__base__ is not Exception:
        cls = cls.__base__
    return f'{cls.__module__}.{cls.__name__}'


def generate_output_stream(filename):
    """Stream filename contents as byte chunks."""
    with open(filename, 'rb') as f:
        while True:
            chunk = f.read(4096)  # Read in chunks of 4096 bytes
            if not chunk:
                break
            yield chunk


def remove_old_tempfiles(directory, max_files):
    """Clean up tempfiles - keep the max_files newest ones."""
    files = glob.glob(os.path.join(directory, '*'))
    if len(files) > max_files:
        sorted_files = sorted(files, key=os.path.getmtime, reverse=True)[max_files:]
        app.logger.info(f'Removing old tempfiles from {directory}: ' +
                        ', '.join([os.path.basename(f) for f in sorted_files]))
        [os.remove(file) for file in sorted_files]


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    # app.run(debug=False)
    socketio.run(app, host='0.0.0.0', port=4000, debug=False)
