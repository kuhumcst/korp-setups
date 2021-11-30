#!/bin/bash
echo "Hellooo"
cd /opt/lanchart_partitur
pip3 install -r requirements.txt
cp config/config_docker.py config/config.py
# Note: The path below must NO LONGER.. be the one set to point at $CODE_PATH in docker-compose.yml.
python3 /opt/lanchart_partitur/partitur_app.py
#sleep infinity
