# Create registry and data folders
mkdir /opt/host_corpora/data
mkdir /opt/host_corpora/registry

# Run test corpus encoding
chmod +x /opt/host_corpora/encodingscripts/encode_testcorpus.sh
/opt/host_corpora/encodingscripts/encode_testcorpus.sh

# Run LANCHART corpus encoding
chmod +x /opt/host_corpora/encodingscripts/encode_LANCHARTcorpus.sh
/opt/host_corpora/encodingscripts/encode_LANCHARTcorpus.sh

# Run MEMOtest corpus encoding
chmod +x /opt/host_corpora/encodingscripts/encode_MEMOtestcorpus.sh
/opt/host_corpora/encodingscripts/encode_MEMOtestcorpus.sh

# Run MEMOtest individual corpus encoding
chmod +x /opt/host_corpora/encodingscripts/encode_MEMO_individual_files.sh
/opt/host_corpora/encodingscripts/encode_MEMO_individual_files.sh

service mysql start && python3 /opt/korp-backend/korp.py

# TODO: recommended server (for later)
#pip3 install gunicorn
#gunicorn --worker-class gevent --bind 0.0.0.0:1234 --workers 4 --max-requests 250 --limit-request-line 0 korp:app
