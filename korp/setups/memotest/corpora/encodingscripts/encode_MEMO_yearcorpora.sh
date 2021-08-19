#!/bin/bash
# encode_MEMO_yearcorpora.sh
# Encode filer med en årgang i hver i Measuring Modernity-testkorpusset som hver sit korpus vha. cwb-encode.

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
YEARCORPDIR=$CORPORADIR/annotated/Brill-year-corpus

# Tjek om Brill-all-mappen findes.
if [ -d "$YEARCORPDIR" ]
then

	# Opret outfiler.
	> memo_yearcorpora_encoding_output.txt
	> memo_yearcorpora_configs.txt

	for f in $YEARCORPDIR/*.xml; do

		#echo "MY_VAR.xml" | sed -e 's/_//g' -e 's/\.xml//g'
		CORPUSFILE="$f"
		CORPUSBASENAME=`basename $CORPUSFILE`
		CORPUSNAME=`echo $CORPUSBASENAME | sed -e 's/\.xml//g'`
		CORPUSUPPER=${CORPUSNAME^^}
		CORPUSLOWER=${CORPUSNAME,,}

	   	# Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
		rm -rf $CORPORADIR/data/$CORPUSLOWER
		mkdir -p $CORPORADIR/data/$CORPUSLOWER

		# Fjern registryindgangen.
		rm -f $CORPORADIR/registry/$CORPUSLOWER

		# Kør cwb-encode med diverse parametre:
		# -d: Det direktorie hvor de encodede filer skal ligge.
		# -R: Registryindgangen.
		# -x: XML-kompatibilitet.
		# -s: Skip blanke linjer.
		# -c: Encoding.
		# -f: Inputfil (vrt-format).
		# -P: Positional attribute.
		# -S: Structural attribute.
		cwb-encode -d $CORPORADIR/data/$CORPUSLOWER \
		           -R $CORPORADIR/registry/$CORPUSLOWER \
		           -xs -c utf8 \
		           -f $CORPUSFILE \
		           -P pos -P pos2 -P lemma \
		           -S sentence:0+id \
		           -S text:0+title+author+pseudonym+date+datefrom+dateto+timefrom+timeto+gender+source+nationality+subtitle+pages+illustrations+typeface+publisher+price \
		           -S corpus:0+title+datefrom+dateto \
		           &>> memo_yearcorpora_encoding_output.txt

		# Gennemfør indekseringen
		cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $CORPORADIR/encodingscripts/output/memo_yearcorpora_encoding_output.txt

	    echo ""

	    PYTHONIOENCODING=utf-8 python3 $CORPORADIR/encodingscripts/create_MEMOconfigs.py $CORPUSNAME >> $CORPORADIR/encodingscripts/output/memo_yearcorpora_configs.txt

	    echo ""
	done
fi
