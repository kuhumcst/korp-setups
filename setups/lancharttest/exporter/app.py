import json
import datetime
import logging
import requests
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


class CustomEncoder(json.JSONEncoder):
    """Custom json encoder that will encode bytes to utf8 strings when necessary."""
    def default(self, obj):
        if isinstance(obj, bytes):
            return obj.decode('utf-8')  # Convert bytes to string
        return super().default(obj)


def add_headers(resp, result):
    """Add HTTP headers to the downloadable file resp. Adapted from Jyrki.

    Arguments:
        resp (resp): The resp to which to add headers.
        result (dict): The downloadable file contents and information
            about it (or an error message); may contain the following
            keys that affect the output headers:

            - download_content_type => Content-Type (default:
              ``text/plain``)
            - download_charset => Charset (default: utf-8)
            - download_filename => Content-Disposition filename
            - download_content => Length of the content to
              Content-Length

            If `result` contains the key ``ERROR``, just add
            the status code 502 and no other headers.
    """
    if "ERROR" in result:
        resp.status_code = 502
    else:
        charset = result.get("download_charset", "utf-8")
        content_type = result.get("download_content_type", "text/plain")
        download_filename = result.get("download_filename", "korp_kwic")
        content_type_header = f'Content-Type: {content_type}'
        if charset:
            content_type_header = f'{content_type_header}; charset={charset}'
        resp.headers['Content-Type'] = content_type_header  # 'text/csv; charset=utf-8'
        resp.headers['Content-Disposition'] = make_content_disposition_attachment(download_filename)
        resp.headers['Content-Length'] = str(len(result["download_content"]))
    return resp


def make_content_disposition_attachment(filename):
    """Make a HTTP Content-Disposition header with attachment filename. Adapted from Jyrki.

    Arguments:
        filename (str): The file name to use for the attachment

    Returns:
        str: A HTTP ``Content-Disposition`` header for an attachment
            with a parameter `filename` with a value `filename`

    If `filename` contains non-ASCII characters, encode it in UTF-8 as
    specified in RFC 5987 to the `Content-Disposition` header
    parameter `filename*`, as showin in a `Stackoverflow discussion`_.
    For a wider browser support, also provide a `filename` parameter
    with the encoded filename. According to the discussion, this does
    not work with IE prior to version 9 and Android browsers.
    Moreover, at least Firefox 28 on Linux seems save an empty file
    with the corresponding Latin-1 character in its name, in addition
    to the real file.

    .. _Stackoverflow discussion: http://stackoverflow.com/questions/93551/how-to-encode-the-filename-parameter-of-content-disposition-header-in-http
    """
    filename = urlp.quote(filename)
    return (("Content-Disposition: attachment; "
             + ("filename*=UTF-8''{filename}; " if "%" in filename else "")
             + "filename={filename}")
            .format(filename=filename))


def add_download_headers_and_content(resp, form):
    """Get the downloadable content using Jyrki's exporter."""
    result = ke.make_download_file(form, form.get("korp_server", "KORP_SERVER"))
    result_content_with_bom = get_csv_content_with_bom(form)
    resp = add_headers(resp, result)
    resp.data = result_content_with_bom
    return resp


def get_csv_content_with_bom(form, skip_header=False):
    result = ke.make_download_file(form, form.get("korp_server", "KORP_SERVER"))
    result_charset = result.get("download_charset", "utf-8")
    print('result headers: ', list(result))
    result_content_bytes = result.get("download_content", "### No content :( ###")
    # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
    # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
    result_content = result_content_bytes.decode(result_charset, errors='replace')
    if skip_header:
        result_content = '\n'.join(result_content.splitlines()[13:]) + '\n'
    result_content_with_bom = '\uFEFF' + result_content
    return result_content_with_bom


def generate_output_stream(filename):
    with open(filename, 'rb') as f:
        while True:
            chunk = f.read(4096)  # Read in chunks of 4096 bytes
            if not chunk:
                break
            yield chunk


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
    chunk_size = 500
    start_arg = 0

    # Trying to handle big file sizes ... It is kind of assumed here that /tmp in Docker will be
    # mapped to a location on the host with plenty of space.
    tf = tempfile.NamedTemporaryFile(delete=False, dir='/tmp')
    with open(tf.name, 'w') as temp_file:  # tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:

        while start_arg <= korp_hits_display or start_arg < max_rows:
            app.logger.info('start_arg: ' + str(start_arg))
            if start_arg > max_rows:
                # TODO Add additional logic to return at most <max_rows> rows, but also not less!
                app.logger.info('Greater than max_rows! Breaking before further reading or writing.')
                break
            elif start_arg > korp_hits_display:
                app.logger.info('Greater than korp_hits_display! Breaking before further reading or writing.')
                break
            query_params['start'] = [str(start_arg)]
            query_params['end'] = [str(start_arg + chunk_size - 1)]
            url = QUERY_ENDPOINT + urlp.urlencode(query_params, doseq=True)
            api_response = requests.get(url, timeout=1200)
            api_response_content = api_response.content.decode('utf8')
            app.logger.info('api_response_content: ' + api_response_content[:200])

            try:
                form = {"query_result": api_response_content, "format": content_type}
                if start_arg == 0:
                    result_content_with_bom = get_csv_content_with_bom(form)
                else:
                    result_content_with_bom = get_csv_content_with_bom(form, skip_header=True)
                # print('result_content_with_bom:\n', result_content_with_bom)
                temp_file.write(result_content_with_bom)
                start_arg += chunk_size
            except ke.KorpExportError as e:
                print(f'<H1>422 Unprocessable Content</H1>{str(e)}')
                break

    #if '"ERROR":' in api_response_content:
    #    response.status_code = 502
    #response.data = f'<H1>422 Unprocessable Content</H1>{str(e)}'
    #response.status_code = 422
    response = Response(generate_output_stream(temp_file.name), mimetype='text/csv')
    response.headers.set('Content-Disposition', 'attachment',
                         filename='korp_kwic_' + datetime.datetime.now().isoformat() + '.csv')
    return response


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    app.run(debug=True)
