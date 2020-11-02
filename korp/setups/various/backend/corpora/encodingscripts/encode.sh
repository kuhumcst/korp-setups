encode_mode=$1
echo "encode_mode is: $encode_mode"

THISDIR=`dirname "$0"`

if [ "$encode_mode" = lanchart ]
then
	echo "Encoding testcorpus and LANCHART corpora ..."
	$THISDIR/encode_testcorpus.sh
	$THISDIR/encode_LANCHARTcorpusAmager.sh
	$THISDIR/encode_LANCHARTcorpusBornholm.sh
	$THISDIR/encode_LANCHARTcorpusKoege.sh


elif [ "$encode_mode" = memotest_all ]
then
	# Run MEMOtest corpus encoding
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh
	echo "Encoding MEMO test corpora ..."
	$THISDIR/encode_MEMOtestcorpus.sh
	$THISDIR/encode_MEMO_yearcorpora.sh
	$THISDIR/encode_MEMO_authcorpora.sh

elif [ "$encode_mode" = memotest ]
then
	# Run MEMOtest corpus encoding
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh
	echo "Encoding MEMO test corpus grouped by author ..."
	$THISDIR/encode_MEMO_authcorpora.sh


elif [ "$encode_mode" = all ]
then
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh

	echo "Encoding LANCHART corpora ..."
	$THISDIR/encode_LANCHARTcorpusAmager.sh
	$THISDIR/encode_LANCHARTcorpusBornholm.sh
	$THISDIR/encode_LANCHARTcorpusKoege.sh

	echo "Encoding MEMO test corpora ..."
	$THISDIR/encode_MEMOtestcorpus.sh
	$THISDIR/encode_MEMO_yearcorpora.sh
	$THISDIR/encode_MEMO_authcorpora.sh

elif [ "$encode_mode" = test ]
then
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh

else
	echo "No BUILD_MODE arg provided, not encoding any corpora."
fi