import os
import httpx
import json
import datetime
import logging
import urllib.parse as urlp
from flask import Flask, request, Response
import korpexport.exporter as ke
import tempfile
app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

#QUERY_ENDPOINT = 'https://alf.hum.ku.dk/korp/backend/query?'
# TODO Set this as an argument to the run flask app command
QUERY_ENDPOINT = 'http://backend:1234/query?'
#QUERY_ENDPOINT = 'http://localhost:11234/query?'

"""
Test URL:
http://localhost:5000/download/csv?default_context=1%20sentence&show=sentence%2Cpos%2Cmsd%2Clemma%2Cref%2Cprefix%2Csuffix&show_struct=text_title&start=0&end=24&corpus=LSPCLIMATEAKTUELNATURVIDENSKAB%2CLSPCLIMATEDMU%2CLSPCLIMATEHOVEDLAND%2CLSPCLIMATEOEKRAAD&cqp=%5Bword%20%3D%20%22mange%22%5D&query_data=&context=&incremental=true&default_within=sentence&within=
"""


@app.route('/download/<content_type>')
def download(content_type):
    """Generate file downloads in various formats via Jyrki's korpexport package.
    Chunkwise!
    Get query string/parameters.
    Remove start and end in order to have a 'base' query string to which to add relevant starts and ends in the loop.
    We should have a maximum allowed downloaded rows -
      e.g. 6% of the tokens in the corpus (= plausible frequency of the single most frequent token in a corpus),
      or less (3% (second most frequent word), 2% (third most frequent) ...).
      But this requires access to the total amount of tokens in the set of selected corpora,
      so let's just impose a limit of 500.000 rows for now (about 4% of a 12m corpus ...).
    What might be a good chunk size? 1000 rows? 5000? 10000?
    Loop: While total is less than the number of hits or 500.000, get another chunk.
    Write to temp file.
    Also generate the response data in chunks by reading the result temp file in
      chunks and yielding these using a generator.
    """
    query_params = urlp.parse_qs(request.query_string.decode('ascii'))
    query_params.pop('start', None)
    query_params.pop('end', None)
    korp_hits_display = int(query_params.get('hits_display', ['0'])[0])  # Total hits according to Korp search.
    app.logger.info('korp_hits_display: ' + str(korp_hits_display))
    max_rows = 500000  # Our imposed row download limit.
    chunk_size = 50
    start_arg = 0
    client = httpx.Client(timeout=600.0)

    ftf = tempfile.NamedTemporaryFile(delete=False, dir='/tmp')
    with open(ftf.name, 'w') as formatted_temp_file:

        # TODO Why does the while loop start over with start_arg = 0 if there is an error in line 237?
        while start_arg <= korp_hits_display or start_arg < max_rows:
            app.logger.info('start_arg: ' + str(start_arg))
            if start_arg > max_rows:
                # TODO Add additional logic to return at most <max_rows> rows, but also not less!
                app.logger.info('Greater than max_rows! Breaking before further reading or writing.')
                break
            elif start_arg > korp_hits_display:
                app.logger.info('Greater than korp_hits_display! Breaking before further reading or writing.')
                break

            # Build URL to get data with the current start_arg and end_arg.
            query_params['start'] = [str(start_arg)]
            query_params['end'] = [str(start_arg + chunk_size - 1)]
            url = QUERY_ENDPOINT + urlp.urlencode(query_params, doseq=True)
            app.logger.info('url: ' + url)

            # Get the data from the backend. Retrieve the name of the temp file written to.
            tf_name = stream_backend_query_to_tempfile(client, url)

            # Transform the data using Jyrki's code. Write it to formatted_temp_file.
            result_content_with_bom = make_formatted_data(tf_name, content_type, start_arg)
            formatted_temp_file.write(result_content_with_bom)
            start_arg += chunk_size

    rsp = Response(generate_output_stream(ftf.name), mimetype='text/csv')
    rsp.headers.set('Content-Disposition', 'attachment',
                    filename='korp_kwic_' + datetime.datetime.now().isoformat() + '.csv')
    return rsp


def stream_backend_query_to_tempfile(client, url):
    """Use httpx client to get data from the Korp backend in a chunked way. Write to tempfile.
    Returns the name of the tempfile written to."""
    # Trying to handle big file sizes ... It is kind of assumed here that /tmp in Docker will be
    # mapped to a location on the host with plenty of space.
    tf = tempfile.NamedTemporaryFile(delete=False, dir='/tmp')
    with tf as temp_file:  # tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
        # TODO Med for stor en chunk_size ser det ud til at risikoen for følgende fejl er større:
        #  httpx.RemoteProtocolError: peer closed connection without sending complete message body (incomplete chunked read).
        #  Problemet er at man ikke kan vide på forhånd hvor tung den enkelte konkordanslinje er
        #  da der kan være forskelligt antal opmærkninger afhængigt af korpus.
        #  Så chunk_size vil formentlig være lidt lille i mange tilfælde hvis den skal være lille nok
        #  til at at korpusser med meget tunge konkordanslinjer skal kunne downloades ...
        # Total timeout for entire request. Timeouts set to None are governed by the total timeout.
        timeout = httpx.Timeout(300.0, pool=None, connect=None, read=None, write=None)
        with client.stream("GET", url, timeout=timeout) as response:
            chunk_no = 1
            for chunk in response.iter_bytes(chunk_size=1000000):  # Get 1MB of data at a time
                app.logger.info(f'Writing chunk {chunk_no} to "{temp_file.name}"..')
                temp_file.write(chunk)
                chunk_no += 1
        tf.flush()  # Empty Python's internal buffers to the operating system.
        os.fsync(tf.fileno())  # Ensure the operating system's buffers are written to disk.
        return tf.name


def make_formatted_data(tf_name, content_type, start_arg):
    with open(tf_name, 'rb') as saved_tempfile:
        saved_tempfile_content = saved_tempfile.read()
    form = {"query_result": saved_tempfile_content, "format": content_type}

    try:
        if start_arg == 0:
            result_content_with_bom = get_csv_content_with_bom(form)
        else:
            result_content_with_bom = get_csv_content_with_bom(form, skip_header=True)
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")
        error_position = e.pos  # Position where the error occurred
        window = 40  # We will print 40 characters before and after the error position
        # TODO Handle JSON error properly ...?
        print(f"JSON around error position: "
              f"{saved_tempfile_content[max(0, error_position - window):error_position + window]}\n\n\n\n\n\n\n\n\n\n")
        return 'Blaha JSONDecodeError :('

    return result_content_with_bom


def get_csv_content_with_bom(form, skip_header=False):
    result = ke.make_download_file(form, form.get("korp_server", "KORP_SERVER"))
    result_charset = result.get("download_charset", "utf-8")
    app.logger.info('get_csv_content_with_bom: result headers: ' + str(list(result)))
    result_content_bytes = result.get("download_content", "### No content :( ###")
    app.logger.info('get_csv_content_with_bom: result_content_bytes len: ' + str(len(result_content_bytes)))
    # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
    # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
    result_content = result_content_bytes.decode(result_charset, errors='replace')
    if skip_header:
        result_content = '\n'.join(result_content.splitlines()[13:]) + '\n'
    result_content_with_bom = '\uFEFF' + result_content
    app.logger.info('get_csv_content_with_bom: result_content_with_bom len: ' + str(len(result_content_with_bom)))
    return result_content_with_bom


def generate_output_stream(filename):
    with open(filename, 'rb') as f:
        while True:
            chunk = f.read(4096)  # Read in chunks of 4096 bytes
            app.logger.info('generate_output_stream: chunk head: ' + str(chunk)[:50])
            app.logger.info('generate_output_stream: chunk len: ' + str(len(str(chunk))))
            if not chunk:
                break
            yield chunk


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    app.run(debug=True)
