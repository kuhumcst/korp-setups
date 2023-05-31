import json
import requests
import urllib
from flask import Flask, make_response, request
import korpexport.exporter as ke
app = Flask(__name__)

#QUERY_ENDPOINT = 'https://alf.hum.ku.dk/korp/backend/query?'
# TODO Set this as an argument to the run flask app command
QUERY_ENDPOINT = 'http://backend:1234/query?'

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
    filename = urllib.parse.quote(filename)
    return (("Content-Disposition: attachment; "
             + ("filename*=UTF-8''{filename}; " if "%" in filename else "")
             + "filename={filename}")
            .format(filename=filename))


def add_download_headers_and_content(resp, form):
    """Get the downloadable content using Jyrki's exporter."""
    result = ke.make_download_file(form, form.get("korp_server", "KORP_SERVER"))
    result_charset = result.get("download_charset", "utf-8")
    result_content = result.get("download_content", "### No content :( ###")
    # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
    # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
    result_content_with_bom = '\uFEFF' + result_content.decode(result_charset, errors='replace')
    resp = add_headers(resp, result)
    resp.data = result_content_with_bom
    return resp


@app.route('/download/<content_type>')
def download(content_type):
    """Generate file downloads in various formats via Jyrki's korpexport package."""
    response = make_response()
    url = QUERY_ENDPOINT + request.query_string.decode('ascii')
    api_response = requests.get(url)
    api_response_content = api_response.content.decode('utf8')
    if '"ERROR":' in api_response_content:
        response.status_code = 502
    else:
        try:
            form = {"query_result": api_response_content, "format": content_type}
            response = add_download_headers_and_content(response, form)
            response.status_code = 200
        except ke.KorpExportError as e:
            response.data = f'<H1>422 Unprocessable Content</H1>{str(e)}'
            response.status_code = 422
    return response


if __name__ == '__main__':
    # TODO Instead of debug True, set up logging properly.
    app.run(debug=True)
