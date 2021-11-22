#!/bin/bash
# encode_MEMO_individual_files.sh
# Encode de enkelte filer i Measuring Modernity-testkorpusset som hver sit korpus vha. cwb-encode.
# Bruges p.t. til at sætte korpusser op af udvalgte forfattere.

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
NOVELSDIR=$CORPORADIR/annotated/Brill-all

# Tjek om Brill-all-mappen findes.
if [ -d "$NOVELSDIR" ]
then

	# Opret outfiler.
	> memo_individual_encoding_output.txt
	> memo_individual_configs.txt

	# Her kan man vha. en passende globstreng begrænse til fx Pontoppidan og Bang.
	#for f in $NOVELSDIR/188*.xml; do
	for f in $NOVELSDIR/18*_BangH_*.xml $NOVELSDIR/18*_Pontoppidan_*.xml; do

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
		cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $CORPORADIR/encodingscripts/output/memo_individual_encoding_output.txt

	    echo ""

	    PYTHONIOENCODING=utf-8 python3 $CORPORADIR/encodingscripts/create_MEMOconfigs.py $CORPUSNAME >> $CORPORADIR/encodingscripts/output/memo_individual_configs.txt

	    echo ""
	done
fi
