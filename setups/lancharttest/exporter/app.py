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
from datetime import datetime, timedelta
import math
import logging
import urllib.parse as urlp
from gevent import Greenlet
from flask import Flask, request, Response, render_template, jsonify
from flask_socketio import SocketIO
import korpexport.exporter as ke  # From Kielipankki-korp-backend-fork
from korpexport.format.delimited import KorpExportFormatterCSV
from korpexport_overrides.overrides import _format_sentence_override
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
MAX_ROWS = 500000  # Our imposed row download limit.
ROWS_PER_REQUEST = 100  # How many rows to get from backend at a time. (1000 yields some retries, but not too many).
SKIP_N_ROWS = 0  # How many rows to skip in subsequent chunks after the first one.
RESPONSE_ITER_BYTES_CHUNK_SIZE = 3000000  # How many bytes of data to get at a time in response.iter_bytes().
CSV_SEP = ';'  # Separator to use in csv downloads.
GROUP_SEP = '____GROUP_SEP____'  # Field-internal separator for multi-token matches.
SENTENCE_FIELDS = 'corpus,left_context,match,right_context'  # Base fields before annotations.
PROGRESS_STORE = dict()  # Store download progress in percent (for the progress bar)
STATUS_STORE = dict()  # Store status info (Aborted, Paused, Resumed ..)
START_ARG_STORE = dict()  # Store arguments for resuming download


@app.route('/download/<content_type>')
def download(content_type):
    """Download endpoint. Currently an HTML page with a download button and a progress bar."""
    # Make sure to add templates dir in Docker!
    return render_template('index.html')


@app.route('/download2/<query_id>', methods=['GET'])
def download_file(query_id):
    """Endpoint for serving the finished download file."""
    file_path = os.path.join(TEMP_OUTDIR, f'{query_id}.done.txt')
    rsp = Response(generate_output_stream(file_path), mimetype='text/csv')
    cqp = ''
    if 'params' in START_ARG_STORE[query_id]:
        if 'cqp' in START_ARG_STORE[query_id]['params']:
            cqp = START_ARG_STORE[query_id]['params']['cqp']
    logging.info(f'START_ARG_STORE[query_id] cqp: {cqp}')
    rsp.headers.set('Content-Disposition', 'attachment', filename=create_filename(cqp))
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
    query_params = start_arg_data.get('params', '')
    content_type = start_arg_data.get('ctype', '')
    logging.warning(f'Resuming download from start_arg {start_arg}.')
    STATUS_STORE[uid] = 'Resumed'
    PROGRESS_STORE[uid] = 0
    Greenlet.spawn(DownloadUtils.write_file, start_arg, query_params, content_type, write_mode='a')


@app.route('/getfile/<content_type>')
def get_file(content_type):
    """Generate file downloads in various formats via Jyrki's korpexport package. (Only CSV for now though)."""
    start_time = datetime.now()
    remove_old_tempfiles(TEMP_DATADIR, max_files=N_TEMPFILES_TO_KEEP)
    remove_old_tempfiles(TEMP_OUTDIR, max_files=N_TEMPFILES_TO_KEEP)
    query_params = dict(request.args)
    start_arg = 0
    START_ARG_STORE[query_params.get('uid')] = dict()
    Greenlet.spawn(DownloadUtils.write_file, start_arg, query_params, content_type)
    app.logger.info(make_download_duration_message(start_time))
    return jsonify({'status': 'Download started', 'query_id': query_params.get('uid')})


class DownloadUtils(object):
    """Container class for the functions handling data download, transformation, preparation, and writing."""

    @classmethod
    def write_file(cls, start_arg, q_params, content_type, write_mode='w'):
        """Loop through successive requests, transform results, write resulting rows to download file.
        Note how 'fetch_with_retry' returns the rows per request value needed to update the start_arg."""
        tmpfile1 = os.path.join(TEMP_OUTDIR, f'{q_params.get("uid")}.txt')
        tmpfile2 = os.path.join(TEMP_OUTDIR, f'{q_params.get("uid")}.done.txt')
        max_match = cls._process_queries(tmpfile1, tmpfile2, content_type, write_mode, start_arg, q_params)
        cls._expand_rows_and_rewrite_w_bom(tmpfile1, tmpfile2, max_match, q_params)
        PROGRESS_STORE[q_params.get("uid")] = 100
        app.logger.info(f'Completed percent 100!')

    @classmethod
    def _process_queries(cls, _tmpfile1, _tmpfile2, _content_type, _mode, _start_arg, _q_params):
        uid = _q_params.get('uid')
        korp_hits_display = int(_q_params.get('hits_display', 0))  # Total hits according to Korp search.
        overall_max_match = 0  # Maximal number of match tokens seen in the data
        with open(_tmpfile1, _mode) as downloadfile:
            while _start_arg <= korp_hits_display or _start_arg < MAX_ROWS:
                if _start_arg > MAX_ROWS:
                    # TODO Add additional logic to return at most <max_rows> rows, but also not less!
                    app.logger.info('Greater than max_rows! Breaking before further reading or writing.')
                    break
                elif _start_arg > korp_hits_display:
                    app.logger.info('Greater than korp_hits_display! Breaking before further reading or writing.')
                    break
                else:
                    try:
                        url = build_url(_start_arg, _q_params, ROWS_PER_REQUEST)
                        tf_name = cls._fetch_to_tempfile(url)
                        app.logger.info(f'UID {uid}: Got filename: {tf_name}')
                        transformed_data, max_match = cls._transform_backend_data(tf_name, _content_type, _start_arg,
                                                                                  _q_params)
                        downloadfile.write(transformed_data)
                        overall_max_match = max_match if max_match > overall_max_match else overall_max_match
                        update_progress(_start_arg, _q_params, _content_type, _tmpfile2)
                        _start_arg += ROWS_PER_REQUEST
                    except Exception as e:
                        STATUS_STORE[uid] = f'Aborted. Error: {type(e).__name__}: {e}'
                        raise
        return overall_max_match

    @staticmethod
    def _fetch_to_tempfile(_url):
        """Get data from Korp backend, and write them to a temp file. Return the name of the tempfile."""
        client = httpx.Client()
        app.logger.info(f'Fetching data from URL: {_url}.')
        tf = tempfile.NamedTemporaryFile(delete=False, dir=TEMP_DATADIR)
        with tf as temp_file:
            with client.stream("GET", _url) as response:
                chunk_no = 1
                for chunk in response.iter_bytes(chunk_size=RESPONSE_ITER_BYTES_CHUNK_SIZE):
                    app.logger.info(f'Writing chunk {chunk_no} to "{temp_file.name}"..')
                    temp_file.write(chunk)
                    chunk_no += 1
            temp_file.flush()  # Empty Python's internal buffers to the operating system.
            os.fsync(temp_file.fileno())  # Ensure the operating system's buffers are written to disk.
        return tf.name

    @classmethod
    def _transform_backend_data(cls, _tf_name, _content_type, _start_arg, _query_params):
        """Send tempfile content to Jyrki's data tranformation function 'make_download_file'.
        Return transformed data, or None if the JSON input data were corrupt."""
        pos_attrs = cls._get_pos_attrs(_query_params)
        struct_attrs = cls._get_struct_attrs(_query_params)
        with open(_tf_name, 'rb') as saved_tempfile:
            saved_tempfile_content = saved_tempfile.read()
        content_json = json.loads(saved_tempfile_content)
        max_match = max([row["match"]["end"] - row["match"]["start"] for row in content_json['kwic']])
        form = {"query_result": saved_tempfile_content, "format": _content_type}
        try:
            exporter = cls._prepare_exporter(form)
            result = exporter.make_download_file(form.get("korp_server", "KORP_SERVER"),
                                                 p_attrs=pos_attrs,
                                                 s_attrs=struct_attrs,
                                                 group_sep=GROUP_SEP)
            return cls._get_download_rows(result, _start_arg), max_match
        except json.JSONDecodeError as e:
            app.logger.warning(f"JSONDecodeError: {e}")
            window = 40  # Print 40 characters before and after the error position
            start, end = max(0, e.pos - window), e.pos + window  # e.pos: error position
            app.logger.info(f"JSON around error position: {saved_tempfile_content[start:end]}\n")
            return 'JSONDecodeError. Data could not be formatted correctly.', 0

    @staticmethod
    def _prepare_exporter(form):
        """Make an exporter instance with the necessary tweaks"""
        exporter = ke.KorpExporter(form)
        KorpExportFormatterCSV._format_sentence = _format_sentence_override  # PD: My override
        KorpExportFormatterCSV._option_defaults['delimiter'] = CSV_SEP  # PD: My override (can't add it in formatter_options)
        KorpExportFormatterCSV._option_defaults['show_field_headings'] = 'False'  # PD: My override (can't add it in formatter_options)
        formatter_options = {'content_format': '{sentence_field_headings}{sentences}',
                             'sentence_sep': '\n',
                             'sentence_fields': SENTENCE_FIELDS,
                             'sentence_field_sep': '\t'}
        exporter._formatter = KorpExportFormatterCSV(options=formatter_options)
        return exporter

    @staticmethod
    def _get_download_rows(_transformed_backend_data, _start_arg):
        """Extract relevant, decoded rows from data returned by Jyrki's transformation function."""
        if _transformed_backend_data is None:
            return 'No result from data transformation.', 0
        else:
            logging.info(f'Result content type: {_transformed_backend_data["download_content_type"]}')
            result_charset = _transformed_backend_data.get("download_charset", "utf-8")
            data_bytes = _transformed_backend_data.get("download_content", "### No content :( ###")
            download_rows = data_bytes.decode(result_charset, errors='replace')
            if _start_arg:  # If start_arg is not 0, skip n header rows.
                download_rows = '\n' + '\n'.join(download_rows.splitlines()[SKIP_N_ROWS:]) + '\n'
            return download_rows

    @classmethod
    def _expand_rows_and_rewrite_w_bom(cls, _tmpfile1, _tmpfile2, _max_match, _query_params):
        """Expand groups of tokens and annotations, formatted as
        strings concatenated with a special separator, to the number
        of fields corresponding to the maximal number of match tokens."""
        headings = cls._get_headings(_query_params, _max_match)
        with open(_tmpfile2, 'w') as f:
            # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
            # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
            f.write('\uFEFF' + CSV_SEP.join(headings.split(',')))
            with open(_tmpfile1) as tf:
                for line in tf:
                    new_line_fields = cls._expand_row(line, _max_match)
                    f.write(CSV_SEP.join(new_line_fields) + '\n')

    @classmethod
    def _get_headings(cls, _query_params, _max_match):
        """Build a string with headings - with tokens and tag headings expanded and enumerated"""
        token_tag_headings_str = cls._get_pos_attrs(_query_params)
        base_headings_str = SENTENCE_FIELDS

        if _max_match > 1:
            zipped_enumerated = [enumerate(tup) for tup in zip(*[token_tag_headings_str.split(',')] * _max_match)]
            string_lists = [[f'{tag}_{i+1}' for i, tag in tup] for tup in zipped_enumerated]
            token_tag_headings_str = ','.join([heading for sublist in string_lists for heading in sublist])

            base_header_parts = []
            for s in SENTENCE_FIELDS.split(','):
                header_part = s if s != 'match' else ','.join([f'match_{str(i+1)}' for i in range(_max_match)])
                base_header_parts.append(header_part)
            base_headings_str = ','.join(base_header_parts)

        return f'{base_headings_str},{token_tag_headings_str}\n'

    @staticmethod
    def _expand_row(_row, _overall_max_match):
        """Expand groups of tokens (and annotations), formatted as
        strings concatenated with a special separator, to the number
        of fields corresponding to the maximal number of match tokens."""
        new_row_fields = []
        sentence_fields = SENTENCE_FIELDS.split(',')
        _row = re.sub(r'^"(.*)"$', r'\1', _row.strip())  # Remove overall quotes
        row_fields = _row.split(f'"{CSV_SEP}"')
        for i, field in enumerate(row_fields):
            # We are in the initial base fields - but not in the match
            if i < len(sentence_fields) and sentence_fields[i] != 'match':
                new_row_fields.append(f'"{field}"')
            else:
                parts = field.split(GROUP_SEP)
                parts = parts + [''] * (_overall_max_match - len(parts))  # Expand to max match length
                parts = [f'"{part}"' for part in parts]  # Quote parts
                for part in parts:
                    new_row_fields.append(part)
        return new_row_fields

    @staticmethod
    def _get_pos_attrs(query_params):
        return query_params.get('show', '')

    @staticmethod
    def _get_struct_attrs(query_params):
        return query_params.get('show_struct', '')


def update_progress(start_arg, query_params, content_type, outfile):
    query_id = query_params.get('uid')
    korp_hits_display = int(query_params.get('hits_display', 0))  # Total hits according to Korp search.
    completed_rows = start_arg + ROWS_PER_REQUEST
    START_ARG_STORE[query_id] = {'start_arg': completed_rows, 'params': query_params,
                                 'ctype': content_type, 'outfile': outfile}
    if completed_rows > korp_hits_display:
        completed_rows = korp_hits_display
    completed_percent = math.floor(completed_rows / korp_hits_display * 100)
    app.logger.info(f'Actual completed percent: {completed_percent}')
    PROGRESS_STORE[query_id] = completed_percent  # Set actual percentage when actual chunk is done


"""--------------------------------  Utils  --------------------------------"""


def create_filename(cqp_string):
    """Generer filnavnet til den fil der skal downloades."""
    safe_cqp_string = '_'.join(re.findall(r'"(\w+)"', cqp_string))
    now = datetime.now()
    seconds = timedelta(hours=now.time().hour, minutes=now.time().minute, seconds=now.time().second).seconds
    timestring = '{}.{}'.format(now.strftime('%Y-%m-%d'), seconds)
    return f'korp_kwic_{safe_cqp_string}_{timestring}.csv'


def build_url(start_arg, query_params, rows_per_request):
    """Build URL to get data with the current start_arg and end_arg."""
    query_params['start'] = str(start_arg)
    query_params['end'] = str(start_arg + rows_per_request - 1)
    url = QUERY_ENDPOINT + urlp.urlencode(query_params, doseq=True)
    return url


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


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    # app.run(debug=False)
    socketio.run(app, host='0.0.0.0', port=4000, debug=False)
