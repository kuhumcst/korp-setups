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
PAUSE_AFTER_REQUEST = .2  # How many seconds to wait after each request.
PAUSE_AFTER_RETRY = 5  # How many seconds to wait after each retry of a given request.
CONNECTION_TIMEOUT = 10
READ_TIMEOUT = 15  # ROWS_PER_REQUEST / 3  # Timeout on response.iter_bytes() reads.
RESPONSE_ITER_BYTES_CHUNK_SIZE = 3000000  # How many bytes of data to get at a time in response.iter_bytes().
HARD_TIMEOUT = 15  # ROWS_PER_REQUEST / 3  # Timeout for custom overall timeout implemented using multiprocessing.
PROGRESS_STORE = dict()  # Store download progress in percent (for the progress bar)
STATUS_STORE = dict()  # Store status info (Aborted, Paused, Resumed ..)
START_ARG_STORE = dict()  # Store arguments for resuming download


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
            PROGRESS_STORE[query_id] = i
            app.logger.info(f'Generator i, query_id: {i}, {query_id}')
    PROGRESS_STORE[query_id] = 100


@app.route('/download2/<query_id>', methods=['GET'])
def download_file(query_id):
    """Endpoint for serving the finished download file."""
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.csv')
    rsp = Response(generate_output_stream(file_path), mimetype='text/csv')
    rsp.headers.set('Content-Disposition', 'attachment', filename=create_filename('blahaa'))
    return rsp


@socketio.on('get_progress', namespace='/status')
def get_progress(uid):
    """Endpoint for emitting data generation status information."""
    progress = PROGRESS_STORE.get(uid, 0) if uid else 0
    status = STATUS_STORE.get(uid, '') if uid else ''
    socketio.emit('status', {'progress': progress, 'status': status, 'uid': uid}, to=request.sid, namespace='/status')


@socketio.on('pause_download', namespace='/status')
def pause_download(uid):
    STATUS_STORE[uid] = 'Paused'


@socketio.on('resume_download', namespace='/status')
def resume_download(uid):
    """Endpoint for resuming download after a server error."""
    logging.info('START_ARG_STORE: ' + str(START_ARG_STORE))
    start_arg_data = START_ARG_STORE.get(uid, {}) if uid else {}
    start_arg = start_arg_data.get('start_arg', 0)
    korp_hits_display = start_arg_data.get('hits', 0)
    query_params = start_arg_data.get('params', '')
    content_type = start_arg_data.get('ctype', '')
    logging.warning(f'Resuming download from start_arg {start_arg}.')
    STATUS_STORE[uid] = 'Resumed'
    Greenlet.spawn(generate_real_file, start_arg, korp_hits_display, query_params, content_type, uid, resume=True)


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
    START_ARG_STORE[query_id] = dict()
    korp_hits_display = int(query_params.get('hits_display', ['0'])[0])  # Total hits according to Korp search.
    Greenlet.spawn(generate_real_file, start_arg, korp_hits_display, query_params, content_type, query_id)
    app.logger.info(f'Request tries: {str(REQUEST_TRIES)}')
    app.logger.info(make_download_duration_message(start_time, korp_hits_display))
    return jsonify({'status': 'Download started', 'query_id': query_id})


def generate_real_file(start_arg, korp_hits_display, query_params, content_type, query_id, resume=False):
    """Wrapper for file writing function that makes sure the status is set to 100 when done."""
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.csv')
    if resume:
        write_mode = 'a'
    else:
        write_mode = 'w'
        PROGRESS_STORE[query_id] = 0
    try:
        with open(file_path, write_mode) as outfile:
            write_download_file(start_arg, korp_hits_display, query_params, content_type, outfile, query_id)
    except Exception as e:
        STATUS_STORE[query_id] = f'Aborted. Error: {type(e).__name__}: {e}'
        raise
    PROGRESS_STORE[query_id] = 100
    app.logger.info(f'Completed percent 100!')


def write_download_file(start_arg, korp_hits_display, query_params, content_type, outfile, query_id):
    """Loop through successive requests, transform results, write resulting rows to download file.
    Note how 'fetch_with_retry' returns the rows per request value needed to update the start_arg."""
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
            tf_name = fetch_to_tempfile(start_arg, query_params, query_id)
            transformed_data = transform_backend_data(tf_name, content_type)
            download_content = 'JSONDecodeError. Data could not be formatted correctly.'
            if transformed_data is not None:
                download_content = format_data_with_bom(transformed_data, start_arg)
            outfile.write(download_content)
            completed_rows = start_arg + ROWS_PER_REQUEST
            START_ARG_STORE[query_id] = {'start_arg': completed_rows,
                                         'hits': korp_hits_display,
                                         'params': query_params,
                                         'ctype': content_type,
                                         'outfile': outfile}
            app.logger.info('Waiting a few seconds before next request to give the server time to recover ...')
            time.sleep(PAUSE_AFTER_REQUEST)
            if completed_rows > korp_hits_display:
                completed_rows = korp_hits_display
            completed_percent = math.floor(completed_rows / korp_hits_display * 100)
            app.logger.info(f'Actual completed percent: {completed_percent}')
            PROGRESS_STORE[query_id] = completed_percent  # Set actual percentage when actual chunk is done
            start_arg += ROWS_PER_REQUEST


def fetch_to_tempfile(start_arg, query_params, query_id):
    """Get data from Korp backend, and write them to a temp file."""
    client = httpx.Client()
    app.logger.info(f'UID {query_id}: Start arg: {start_arg}\n'
                    f'temp_rows_per_request: {ROWS_PER_REQUEST}\n'
                    f'Timeout: {HARD_TIMEOUT}\n\n')
    url = build_url(start_arg, query_params, ROWS_PER_REQUEST)

    # Get the data from the backend and write to tempfile. Retrieve the name of the tempfile.
    tf = tempfile.NamedTemporaryFile(delete=False, dir=TEMP_DATADIR)
    with tf as temp_file:
        with client.stream("GET", url) as response:
            app.logger.info('Opened httpx stream context handler ...')
            chunk_no = 1
            for chunk in response.iter_bytes(chunk_size=RESPONSE_ITER_BYTES_CHUNK_SIZE):
                app.logger.info(f'UID {query_id}: Writing chunk {chunk_no} to "{temp_file.name}"..')
                temp_file.write(chunk)
                chunk_no += 1
        temp_file.flush()  # Empty Python's internal buffers to the operating system.
        os.fsync(temp_file.fileno())  # Ensure the operating system's buffers are written to disk.

    app.logger.info(f'UID {query_id}: Got filename: {tf.name}')
    return tf.name


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
    logging.info('query_params: ' + str(query_params))
    logging.info("start_arg: " + str(start_arg))
    logging.info("start_arg type: " + str(type(start_arg)))

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


def handle_hard_timeout(n, m, e, query_id):
    """Handle hard timeout when server request hangs."""
    msg = f"Download failed: Server timed out on request for rows {n}-{n + m - 1}. Try again later."
    app.logger.error(msg)
    app.logger.error(f"Error: {type(e).__name__}: {e}. Aborting.")
    socketio.emit('abort', {'uid': query_id, 'reason': msg}, namespace='/status')
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
