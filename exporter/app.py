"""
Exporter: a Flask app for downloading all KWIC results from Korp.
Philip Diderichsen, 2023
"""
from gevent import monkey
monkey.patch_all()  # TODO Is this necessary?
import os
import re
import glob
import logging
from gevent import Greenlet
from datetime import datetime, timedelta
from flask import Flask, request, Response, render_template, jsonify
from flask_socketio import SocketIO
from download_utils.get_data import process_queries
from download_utils.postprocess import expand_rows_and_rewrite_w_bom

app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')
socketio = SocketIO(app,
                    async_mode='gevent',
                    cors_allowed_origins=["http://localhost:4000",
                                          "http://localhost:14000",
                                          "https://lanchartkorp.ku.dk",
                                          "https://lanchartpartitur.ku.dk",
                                          "https://alf.hum.ku.dk"],
                    logger=False,  # False is the default
                    engineio_logger=logging)  # False is default. Set to logging (not True) to avoid duplicate logs.


class Opts:
    """Container class for various global options."""
    # In Docker, use 'http://backend:1234...'. E.g. 'http://localhost:11234/query?' will give a httpx.ConnectError.
    query_endpoint = 'http://backend:1234/query?'
    temp_datadir = '/var/tmp/data'  # Dir for temp files from successive requests. (Note: Map to Docker host volume!).
    temp_outdir = '/var/tmp/output'  # Dir for the temp output file for download. (Note: Map to Docker host volume!).
    n_tempfiles_to_keep = 50  # Number of data and output temp files to keep when cleaning up old temp files.
    max_rows = 500000  # Our imposed row download limit.
    rows_per_request = 100  # How many rows to get from backend at a time. (1000 yields some retries, but not too many).
    skip_n_rows = 0  # How many rows to skip in subsequent chunks after the first one.
    response_iter_bytes_chunk_size = 3000000  # How many bytes of data to get at a time in response.iter_bytes().
    csv_sep = ';'  # Separator to use in csv downloads.
    group_sep = '____GROUP_SEP____'  # Field-internal separator for multi-token matches.
    s_attr_sep = '____STRUCT_ATTR_SEP____'  # Field-internal separator for structural attributes ..
    sentence_fields = 'corpus,left_context,match,right_context'  # Base fields before annotations.
    progress_store = dict()  # Store download progress in percent (for the progress bar)
    status_store = dict()  # Store status info (Aborted, Paused, Resumed ..)
    start_arg_store = dict()  # Store arguments for resuming download
    

@app.route('/download/<content_type>')
def download(content_type):
    """Download endpoint. Currently an HTML page with a download button and a progress bar."""
    # Make sure to add templates dir in Docker!
    return render_template('index.html')


@app.route('/download2/<query_id>', methods=['GET'])
def download_file(query_id):
    """Endpoint for serving the finished download file."""
    file_path = os.path.join(Opts.temp_outdir, f'{query_id}.done.txt')
    rsp = Response(generate_output_stream(file_path), mimetype='text/csv')
    cqp = ''
    if 'params' in Opts.start_arg_store[query_id]:
        if 'cqp' in Opts.start_arg_store[query_id]['params']:
            cqp = Opts.start_arg_store[query_id]['params']['cqp']
    logging.info(f'START_ARG_STORE[query_id] cqp: {cqp}')
    rsp.headers.set('Content-Disposition', 'attachment', filename=create_filename(cqp))
    return rsp


@socketio.on('get_progress', namespace='/status')
def get_progress(uid):
    """Endpoint for emitting data generation status information."""
    progress = Opts.progress_store.get(uid, 0) if uid else 0
    status = Opts.status_store.get(uid, '') if uid else ''
    socketio.emit('status', {'progress': progress, 'status': status, 'uid': uid}, to=request.sid, namespace='/status')


@socketio.on('pause_download', namespace='/status')
def pause_download(uid):
    Opts.status_store[uid] = 'Paused'


@socketio.on('resume_download', namespace='/status')
def resume_download(uid):
    """Endpoint for resuming download after a server error."""
    logging.info('START_ARG_STORE: ' + str(Opts.start_arg_store))
    start_arg_data = Opts.start_arg_store.get(uid, {}) if uid else {}
    start_arg = start_arg_data.get('start_arg', 0)
    query_params = start_arg_data.get('params', '')
    content_type = start_arg_data.get('ctype', '')
    logging.warning(f'Resuming download from start_arg {start_arg}.')
    Opts.status_store[uid] = 'Resumed'
    Greenlet.spawn(download_and_write_file, start_arg, query_params, content_type)


@app.route('/getfile/<content_type>')
def get_file(content_type):
    """Generate file downloads in various formats via Jyrki's korpexport package. (Only CSV for now though)."""
    start_time = datetime.now()
    remove_old_tempfiles(Opts.temp_outdir, max_files=Opts.n_tempfiles_to_keep)
    query_params = dict(request.args)
    start_arg = 0
    Opts.start_arg_store[query_params.get('uid')] = dict()
    Greenlet.spawn(download_and_write_file, start_arg, query_params, content_type)
    app.logger.info(make_download_duration_message(start_time))
    return jsonify({'status': 'Download started', 'query_id': query_params.get('uid')})


def download_and_write_file(start_arg, q_params, content_type):
    """Loop through successive requests, transform results, write resulting rows to download file."""
    uid = q_params.get("uid")
    preliminary_downloadfile = os.path.join(Opts.temp_outdir, f'{uid}.txt')
    # Create file if nonexisting to have a file to write to in case of an immediately failing/resuming download.
    if not os.path.isfile(preliminary_downloadfile):
        with open(preliminary_downloadfile, 'x') as _:  # 'x': create mode.
            pass
    final_downloadfile = os.path.join(Opts.temp_outdir, f'{uid}.done.txt')
    max_match = process_queries(app, preliminary_downloadfile, content_type, start_arg, q_params, Opts)
    expand_rows_and_rewrite_w_bom(preliminary_downloadfile, final_downloadfile, max_match, q_params, Opts)
    Opts.progress_store[uid] = 100
    # Next line may seem unnecessary but is used to remove empty files created when resuming downloads.
    remove_old_tempfiles_uid_based(Opts.temp_datadir, globpattern=f'*_{uid}.txt')
    remove_old_tempfiles_uid_based(Opts.temp_outdir, globpattern=f'{uid}.txt')
    app.logger.info(f'Completed percent 100!')


"""--------------------------------  Utils  --------------------------------"""


def create_filename(cqp_string):
    """Generer filnavnet til den fil der skal downloades."""
    safe_cqp_string = '_'.join(re.findall(r'"(\w+)"', cqp_string))
    now = datetime.now()
    seconds = timedelta(hours=now.time().hour, minutes=now.time().minute, seconds=now.time().second).seconds
    timestring = '{}.{}'.format(now.strftime('%Y-%m-%d'), seconds)
    return f'korp_kwic_{safe_cqp_string}_{timestring}.csv'


def make_download_duration_message(start_time):
    """Make a log message about the download duration."""
    time_delta = datetime.now() - start_time
    total_seconds = time_delta.total_seconds()
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    return f'Total download duration: {int(minutes)} minutes {int(seconds)} seconds.'


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


def remove_old_tempfiles_uid_based(directory, globpattern):
	"""Clean up tempfiles based on uid."""
	files = glob.glob(os.path.join(directory, globpattern))
	app.logger.info(f'Removing old tempfiles from {directory}: ' +
                    ', '.join([os.path.basename(f) for f in files]))
	[os.remove(file) for file in files]


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    # app.run(debug=False)
    socketio.run(app, host='0.0.0.0', port=4000, debug=False)
