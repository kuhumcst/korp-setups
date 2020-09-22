#!/bin/bash
# encode_MEMO_individual_files.sh
# Encode de enkelte filer i Measuring Modernity-testkorpusset som hver sit korpus vha. cwb-encode.

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`

# Tjek om Brill-all-mappen findes.
if [ -d "$CORPORADIR/annotated/Brill-all" ]
then

	# Opret outfiler.
	> memo_individual_encoding_output.txt
	> memo_individual_configs.txt

	for f in $CORPORADIR/annotated/Brill-all/188*.xml; do

		#echo "MY_VAR.xml" | sed -e 's/_//g' -e 's/\.xml//g'
		CORPUSFILE="$f"
		CORPUSBASENAME=`basename $CORPUSFILE`
		CORPUSNAME=MEMO_`echo $CORPUSBASENAME | sed -e 's/\.xml//g' | \
		           sed  -E 's/([0-9]+)_(.+)/\2_\1/g' | \
		           sed -E 's/[^A-Za-z0-9_-]/x/g'`
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
		           &>> memo_individual_encoding_output.txt

		# Gennemfør indekseringen
		cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> memo_individual_encoding_output.txt

	    echo ""

	    PYTHONIOENCODING=utf-8 python3 $CORPORADIR/encodingscripts/create_MEMOconfigs.py $CORPUSNAME >> memo_individual_configs.txt

	    echo ""
	done
fi
