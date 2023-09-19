# Exporter

A Flask app for downloading all KWIC results from Korp.
Philip Diderichsen, 2023

Files: 
- app.py: The app itself.
- static/filedownload.js: Javascript functionality.
- templates/index.html: Interface with download button.

Development cycle:

Save changes, and run

```
cd lancharttest
DB_PATH=./corpora/sqlitedb AUDIO_DIR=<audio-dir> docker-compose up --build exporter
```

The exporter is intended to run as part of a Docker Korp setup (and is therefore in the korp-setups repo).
When running in Docker, the exporter communicates with the backend on http://backend:1234.
The 'backend' domain refers to the 'backend' Docker container, and '1234' is the Docker-internal port where it runs.

Via Korp's AJAX code in Angular (in `app/scripts/result_controllers.js`), the exporter is called from Korp.
The query string for the 'normal' backend download call is included in the request.
This happens when the user selects the 'download all' option from a selector.
The exporter then loops through a number of backend requests with successive start and end parameters.
For each request, the results are converted to CSV (the only option for now), resulting rows appended to a temp file.
(The results of each request are themselves saved to a temp file each, fetched using httpx's chunked streaming).
The CSV conversion is handled by a fork of Jyrki's code: Kielipankki-korp-backend-fork.
In order to import this code, put this in requirements.txt: -e /Users/phb514/mygit/Kielipankki-korp-backend-fork/

Finally, the resulting temp file is streamed back with a 'Content-Disposition: attachment' header, filename, etc.
The Korp AJAX code picks this up and serves the CSV file as a download.

The exporter code includes timeout and error handling.
A number of timeout values and the like are set as global variables and might be optimized for performance.

Dilemma/tradeoff: There should be a limit on downloadable rows. This should not be too restrictive, though.
E.g. 6% of the tokens in the corpus (= plausible frequency of the single most frequent token in a corpus).
Or less (3% (second most frequent word), 2% (third most frequent) ...).
But this requires access to the total amount of tokens in the set of selected corpora.
So let's just impose a limit of 500.000 rows for now (about 4% of a 12m corpus).

Test URL:
http://localhost:14000/download/csv?default_context=1%20sentence&show=sentence%2Ctext%2Cipa%2Cttt%2Credpos%2Cpos%2Cspeaker%2Ccolorcombo_bg%2Ccolorcombo_border%2Ccolorcombo_fg%2Cinformanter_koen%2Cinformanter_foedselsaar%2Ctaleralder%2Cinformanter_generation%2Cinformanter_socialklasse%2Crolle%2Cinformanter_prioriteret%2Cinformanter_prioriteretekstra%2Ctext_enum%2Cturn_enum%2Cxmin%2Cxmax%2Cxlength%2Cturnummer%2Ctalekilde%2Cturnmin%2Cturnmax%2Cturnduration%2Cphonetic%2Ccomments%2Cevents%2Cturn%2Cuncertainxtranscription%2Csync&show_struct=corpus_label%2Ctext_size%2Ctext_textmin%2Ctext_textmax%2Ctext_textduration%2Ctext_filename%2Ctext_datefrom%2Ctext_timefrom%2Ctext_dateto%2Ctext_timeto%2Ctext_oldnew%2Ctext_samtaler_dato%2Ctext_samtaler_projekt%2Ctext_samtaler_samtaletype%2Ctext_samtaler_eksplorativ%2Ctext_samtaler_korrektur%2Ctext_samtaler_prioriteret%2Ctext_samtaler_prioriteretekstra%2Ctext_projekter_name&start=0&end=24&corpus=LANCHART_HIRTSHALS&cqp=%5Bword%20%3D%20%22h%C3%B8ne%22%5D&query_data=&context=LANCHART_HIRTSHALS%3A3%20sentence&incremental=true&default_within=text&within=&hits_display=5
