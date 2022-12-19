#!/bin/bash
cd /opt/partitur/lanchart_partitur
pip3 install -r requirements.txt
FLASK_APP=partitur_app.py FLASK_CONFIG=prod flask run --host 0.0.0.0

