# Run test corpus encoding
chmod +x /opt/host_corpora/encodingscripts/encode_testcorpus.sh
/opt/host_corpora/encodingscripts/encode_testcorpus.sh

service mysql start && python3 /opt/korp-backend/korp.py

# TODO: recommended server (for later)
#pip3 install gunicorn
#gunicorn --worker-class gevent --bind 0.0.0.0:1234 --workers 4 --max-requests 250 --limit-request-line 0 korp:app
