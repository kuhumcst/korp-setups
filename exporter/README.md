# Exporter

An extension to Korp in the form of a Flask app for downloading all KWIC results.
Philip Diderichsen, 2023




## Note
The exporter is now a part of the overall infrastructure.
More specifically, the overall `frontend/app/scripts/result_controllers.js` assumes it exists:
It specifies an option for downloading all KWIC results in the "Download hit page as ..." menu.
This means a few things are required for this not to be a dead end:

- The docker-compose.yml file of each specific setup needs to specify the exporter as a service.
- The web server on the relevant server (Apache or Nginx) needs to reverse proxy the exporter properly.
- The relevant domain (e.g. "https://alf.hum.ku.dk") must be in `cors_allowed_origins` in app.py.





## TODO
- There is a bug messing things up when case insensitive search is used (the switch "%c" in the cqp search).




## Important files
- `app.py`: The app itself.
- `download_utils/`: Python package with modules for getting and postprocessing data.
- `korpexport_overrides/`: My overrides to Jyrki's code.
- `static/exporter_static/`: Static files - Javascript, stylesheets, font, Korp logo.
- `templates/index.html`: Interface with download button.




## Development cycle

Save changes, and run

```
cd lancharttest
DB_PATH=./corpora/sqlitedb AUDIO_DIR=<audio-dir> docker-compose up --build exporter
```




## Detailed description

The exporter is intended to run as part of a Docker Korp setup (and is therefore in the korp-setups repo).
When running in Docker, the exporter communicates with the backend on http://backend:1234.
The 'backend' domain refers to the 'backend' Docker container, and '1234' is the Docker-internal port where it runs.

Via Korp's AJAX code in Angular (in `app/scripts/result_controllers.js`), a download page is opened in a new window.
This happens when the user selects 'download all' from a selector in Korp, which calls the `download/csv` endpoint.
On clicking the download button, `downloadButtonClick()` in `filedownload.js` calls the `getfile/csv` endpoint.
This returns the message 'Download started', which causes `downloadButtonClick()` to call `trackProgress()`.
`trackProgress()` listens for status information from the server via a WebSocket connection and reacts accordingly.

The query string for the 'normal' backend download call is included in the request to `getfile/csv`.
BTW, the query string comes from Korp's JSON link, where the query string is duplicated! Second occurrence is used ..
The exporter Python code then loops through a number of backend requests with successive start and end parameters.

For each request, the results are converted to CSV rows (the only option for now), then appended to a tempfile.
(The results of each request are themselves saved to a tempfile each, fetched using httpx's chunked streaming).
The CSV conversion is handled by a fork of Jyrki's code: Kielipankki-korp-backend-fork.
(In order to import this code, make sure to install it with pip in the Dockerfile).
Once the rows from a request have been fetched, converted, and appended to tempfile, `progress_store` is updated.

From the client (JS) side, the `/get_progress` endpoint is called every second through the WebSocket.
Hence, download status information is sent from the server every second for updating the progress bar etc.
The status information includes certain errors which the client can handle by retrying or pausing requests.

Once all rows have been fetched, processed, and appended to the tempfile, this file must be postprocessed.
In this step, all rows are expanded to the maximal match width (in tokens) seen during preliminary processing.
(The match width may vary, e.g. in searches such as `[word = "sådan"] [word = ".+"]{1,3} [word = "der"]`).
With postprocessing done, `progress_store` is updated to 100%.
Completion is signalled through the WebSocket and triggers `filedownload.js` to initiate the download.
This happens by JS calling the endpoint `/download2` by clicking a temporary, generated link.
The postprocessed file is then streamed back with a 'Content-Disposition: attachment' header, filename, etc.

The preliminary tempfile is deleted by Python using `remove_old_tempfiles_uid_based()` once postprocessing is done.
The tempfiles from the requests are deleted immediately after they are written to the preliminary tempfile.
Empty tempfiles from resuming downloads are also removed by `remove_old_tempfiles_uid_based()` after postprocessing.
The final tempfile which is being served for download, is cleaned up in a different way.
It is removed using `remove_old_tempfiles()` when it is the nth + 1 file in the temp dir. Currently, n is 50.
There is a tradeoff at play here. Worst case would be n+ downloads started simultaneously.
Then the first download might possibly cause the last download's final tempfile to be deleted.
On the other hand, a lot of large downloads could cause the disk to run out of space.
As a large number of simultaneous downloads isn't likely in our current scenario, a low-ish n has been chosen.

Dilemma/tradeoff: There should be a limit on downloadable rows. This should not be too restrictive, though.
E.g. 6% of the tokens in the corpus (= plausible frequency of the single most frequent token in a corpus).
Or less (3% (second most frequent word), 2% (third most frequent) ...).
But this requires access to the total amount of tokens in the set of selected corpora.
So let's just impose a limit of 500.000 rows for now (about 4% of a 12m corpus).

Test URL:
`http://localhost:14000/download/csv?default_context=1%20sentence&show=sentence%2Ctext%2Cipa%2Cttt%2Credpos%2Cpos%2Cspeaker%2Ccolorcombo_bg%2Ccolorcombo_border%2Ccolorcombo_fg%2Cinformanter_koen%2Cinformanter_foedselsaar%2Ctaleralder%2Cinformanter_generation%2Cinformanter_socialklasse%2Crolle%2Cinformanter_prioriteret%2Cinformanter_prioriteretekstra%2Ctext_enum%2Cturn_enum%2Cxmin%2Cxmax%2Cxlength%2Cturnummer%2Ctalekilde%2Cturnmin%2Cturnmax%2Cturnduration%2Cphonetic%2Ccomments%2Cevents%2Cturn%2Cuncertainxtranscription%2Csync&show_struct=corpus_label%2Ctext_size%2Ctext_textmin%2Ctext_textmax%2Ctext_textduration%2Ctext_filename%2Ctext_datefrom%2Ctext_timefrom%2Ctext_dateto%2Ctext_timeto%2Ctext_oldnew%2Ctext_samtaler_dato%2Ctext_samtaler_projekt%2Ctext_samtaler_samtaletype%2Ctext_samtaler_eksplorativ%2Ctext_samtaler_korrektur%2Ctext_samtaler_prioriteret%2Ctext_samtaler_prioriteretekstra%2Ctext_projekter_name&start=0&end=24&corpus=LANCHART_HIRTSHALS&cqp=%5Bword%20%3D%20%22h%C3%B8ne%22%5D&query_data=&context=LANCHART_HIRTSHALS%3A3%20sentence&incremental=true&default_within=text&within=&hits_display=5`




## Description of Jyrki's code


### Files

The relevant files are in Kielipankki-korp-backend-fork/korpexport

- exporter.py
- formatter.py
- format/delimited.py


### Walktrough

- In the exporter.py file, the entry point is the function `make_download_file(form, korp_server_url, **kwargs)`.
- This function creates a KorpExporter and returns the output of method `make_download_file(korp_server_url, **kwargs)`.
- The `korp_server_url` features prominently in both of these, but is actually not needed:
The `form` (a dict) in `make_download_file(3)` can hold data already fetched from Korp under the `query_result` key.
- The form becomes an attribute of a KorpExporter instance (`exporter`) under the name `exporter._form`.
- When `exporter.process_query()` is called, via `make_download_file(2)`, it uses `exporter.form[query_result]` if present.
- Then, `process_query()` adds the query result + any URL options to `exporter`: `_query_result`, `_query_params`, `_opts`.
- With information thus gathered, the download content is then created with `exporter._formatter.make_download_content()`.
- The `_formatter` class is found via "csv" from `_form` (`_get_formatter()`: `self._form.get("format", "json").lower()`).
- The class is KorpExportFormatterCSV, which inherits from KorpExportFormatterDelimited and KorpExportFormatter.
- The formatter modules are in `korpexport/format`, specified in `_FORMATTER_SUBPACKAGE` in the KorpExporter class.
- The base class KorpExportFormatter is in the `formatter.py` module next to `exporter.py`.
- The actual transformation to CSV done by KorpExportFormatterCSV happens in methods inherited from formatter.py:
- `_format_content()` > `_format_sentences()` > `_format_list()` > `_format_sentence()`.
- `_format_sentence` is how far I have tracked things so far.

From this point, my own code takes over.

- The internals of `_format_sentence()` are obscure, so I'm overriding it in KorpExportFormatterCSV before instantiating.
- This and other necessary overrides happens in `_prepare_exporter()` in `get_data.py`, which then instantiates `exporter`.
- `_transform_backend_data()` then uses `exporter`'s `make_download_file()` method to make the CSV rows for the download.
