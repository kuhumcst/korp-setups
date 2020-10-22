encode_mode=$1

THISDIR=`dirname "$0"`

if [ "$encode_mode" = lanchart ]
then
	echo "Encoding testcorpus and LANCHART corpora ..."
	$THISDIR/encode_testcorpus.sh
	$THISDIR/encode_LANCHARTcorpusAmager.sh
	$THISDIR/encode_LANCHARTcorpusBornholm.sh
	$THISDIR/encode_LANCHARTcorpusKoege.sh


elif [ "$encode_mode" = memotest ]
then
	# Run MEMOtest corpus encoding
	echo "Encoding testcorpus and MEMOtestcorpus ..."
	$THISDIR/encode_testcorpus.sh
	$THISDIR/encode_MEMOtestcorpus.sh


elif [ "$encode_mode" = all ]
then
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh

	echo "Encoding LANCHART corpora ..."
	$THISDIR/encode_LANCHARTcorpusAmager.sh
	$THISDIR/encode_LANCHARTcorpusBornholm.sh
	$THISDIR/encode_LANCHARTcorpusKoege.sh

	echo "Encoding MEMOtest ..."
	$THISDIR/encode_MEMOtestcorpus.sh

	echo "Encoding MEMO yearly corpora ..."
	$THISDIR/encode_MEMO_yearcorpora.sh


else
	echo "Encoding testcorpus ..."
	$THISDIR/encode_testcorpus.sh
fi