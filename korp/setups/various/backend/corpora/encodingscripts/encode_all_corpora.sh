#!/bin/bash
# encode_all_corpora.sh
# Encode alle korpusser forfra, dvs. med helt nyt registry og datamappe.

# Create registry and data folders, overwrite if they exist.
mkdir -p /opt/host_corpora/data
mkdir -p /opt/host_corpora/registry

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
