"""
Module for downloading, transforming, and writing Korp data to a temp file.
Data transformation is done using Jyrki Niemi's code from Kielipankki-korp-backend.
The data written to the temp file is still (!) in a preliminary format:
Groups of match tokens (and annotations) must be expanded into fields if applicable.
"""

import httpx
import json
import logging
import os
import tempfile
import korpexport.exporter as ke  # From Kielipankki-korp-backend-fork
import urllib.parse as urlp
from korpexport.format.delimited import KorpExportFormatterCSV
from korpexport_overrides.overrides import format_sentence_override


def process_queries(app, preliminary_downloadfile, content_type, start_arg, query_params, opts):
    """Send successive requests to the backend until all rows have been fetched or the limit is reached.
    Transform the data from each reques, and append the result to a tempfile.
    Keep track of the number of match tokens in the data fetched, and return the value for the widest
    match in order to be able to later expand all rows to this width."""
    uid = query_params.get('uid')
    korp_hits_display = int(query_params.get('hits_display', 0))  # Total hits according to Korp search.
    overall_max_match = 0  # Maximal number of match tokens seen in the data
    with open(preliminary_downloadfile, 'a') as downloadfile:
        while start_arg <= korp_hits_display or start_arg < opts.max_rows:
            if start_arg > opts.max_rows:
                # TODO Add additional logic to return at most <max_rows> rows, but also not less!
                app.logger.info('Greater than max_rows! Breaking before further reading or writing.')
                break
            elif start_arg > korp_hits_display:
                app.logger.info('Greater than korp_hits_display! Breaking before further reading or writing.')
                break
            else:
                try:
                    url = _build_url(start_arg, query_params, opts)
                    tf_name = _fetch_to_tempfile(app, url, uid, opts)
                    app.logger.info(f'UID {uid}: Got filename: {tf_name}')
                    transformed_data, max_match = _transform_backend_data(app, tf_name, content_type,
                                                                          start_arg, query_params, opts)
                    downloadfile.write(transformed_data)
                    os.remove(tf_name)
                    overall_max_match = max_match if max_match > overall_max_match else overall_max_match
                    update_progress(app, start_arg, query_params, content_type, preliminary_downloadfile, opts)
                    start_arg += opts.rows_per_request
                except Exception as e:
                    opts.status_store[uid] = f'Aborted. Error: {type(e).__name__}: {e}'
                    raise
    return overall_max_match


def _build_url(start_arg, query_params, opts):
    """Build URL to get data with the current start_arg and end_arg."""
    query_params['start'] = str(start_arg)
    query_params['end'] = str(start_arg + opts.rows_per_request - 1)
    url = opts.query_endpoint + urlp.urlencode(query_params, doseq=True)
    return url


def _fetch_to_tempfile(app, url, uid, opts):
    """Get data from Korp backend, and write them to a temp file. Return the name of the tempfile."""
    client = httpx.Client()
    app.logger.info(f'Fetching data from URL: {url}.')
    tf = tempfile.NamedTemporaryFile(delete=False, dir=opts.temp_datadir, suffix=f'_{uid}.txt')
    with tf as temp_file:
        with client.stream("GET", url) as response:
            chunk_no = 1
            for chunk in response.iter_bytes(chunk_size=opts.response_iter_bytes_chunk_size):
                app.logger.info(f'Writing chunk {chunk_no} to "{temp_file.name}"..')
                temp_file.write(chunk)
                chunk_no += 1
        temp_file.flush()  # Empty Python's internal buffers to the operating system.
        os.fsync(temp_file.fileno())  # Ensure the operating system's buffers are written to disk.
    return tf.name


def _transform_backend_data(app, tf_name, content_type, start_arg, query_params, opts):
    """Send tempfile content to Jyrki's data tranformation function 'make_download_file'.
    Return transformed data, or None if the JSON input data were corrupt."""
    pos_attrs = query_params.get('show', '')
    struct_attrs = query_params.get('show_struct', '')
    with open(tf_name, 'rb') as saved_tempfile:
        saved_tempfile_content = saved_tempfile.read()
    content_json = json.loads(saved_tempfile_content)
    max_match = max([row["match"]["end"] - row["match"]["start"] for row in content_json['kwic']])
    form = {"query_result": saved_tempfile_content, "format": content_type}
    try:
        exporter = _prepare_exporter(form, opts)
        result = exporter.make_download_file(form.get("korp_server", "KORP_SERVER"),
                                             p_attrs=pos_attrs,
                                             s_attrs=struct_attrs,
                                             group_sep=opts.group_sep,
                                             s_attr_sep=opts.s_attr_sep)
        return _get_download_rows(result, start_arg, opts.skip_n_rows), max_match
    except json.JSONDecodeError as e:
        app.logger.warning(f"JSONDecodeError: {e}")
        window = 40  # Print 40 characters before and after the error position
        start, end = max(0, e.pos - window), e.pos + window  # e.pos: error position
        app.logger.info(f"JSON around error position: {saved_tempfile_content[start:end]}\n")
        return 'JSONDecodeError. Data could not be formatted correctly.', 0


def _prepare_exporter(form, opts):
    """Make an exporter instance with the necessary tweaks"""
    exporter = ke.KorpExporter(form)
    KorpExportFormatterCSV._format_sentence = format_sentence_override  # PD: My override
    KorpExportFormatterCSV._option_defaults['delimiter'] = opts.csv_sep  # PD: My override (can't add it in formatter_options)
    KorpExportFormatterCSV._option_defaults['show_field_headings'] = 'False'  # PD: My override (can't add it in formatter_options)
    formatter_options = {'content_format': '{sentence_field_headings}{sentences}',
                         'sentence_sep': '\n',
                         'sentence_fields': opts.sentence_fields,
                         'sentence_field_sep': '\t'}
    exporter._formatter = KorpExportFormatterCSV(options=formatter_options)
    return exporter


def _get_download_rows(transformed_backend_data, start_arg, skip_n_rows):
    """Extract relevant, decoded rows from data returned by Jyrki's transformation function."""
    if transformed_backend_data is None:
        return 'No result from data transformation.', 0
    else:
        logging.info(f'Result content type: {transformed_backend_data["download_content_type"]}')
        result_charset = transformed_backend_data.get("download_charset", "utf-8")
        data_bytes = transformed_backend_data.get("download_content", "### No content :( ###")
        download_rows = data_bytes.decode(result_charset, errors='replace')
        if start_arg:  # If start_arg is not 0, skip n header rows.
            download_rows = '\n' + '\n'.join(download_rows.splitlines()[skip_n_rows:])
        return download_rows


def update_progress(app, start_arg, query_params, content_type, outfile, opts):
    query_id = query_params.get('uid')
    korp_hits_display = int(query_params.get('hits_display', 0))  # Total hits according to Korp search.
    completed_rows = start_arg + opts.rows_per_request
    opts.start_arg_store[query_id] = {'start_arg': completed_rows, 'params': query_params,
                                      'ctype': content_type, 'outfile': outfile}
    if completed_rows > korp_hits_display:
        completed_rows = korp_hits_display
    completed_percent = completed_rows / korp_hits_display * 100
    if completed_percent == 100:
        completed_percent = 99.9  # Defer signalling completion to after expand_rows_and_rewrite_w_bom()
    app.logger.info(f'Actual completed percent: {completed_percent}')
    opts.progress_store[query_id] = completed_percent  # Set actual percentage when actual chunk is done
