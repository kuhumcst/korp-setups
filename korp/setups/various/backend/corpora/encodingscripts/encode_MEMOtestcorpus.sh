#!/bin/bash
# encode_testcorpus.sh
# Encode Measuring Modernity-testkorpusset vha. cwb-encode.

CORPUSNAME=memotestcorpusfull
CORPUSFILE=Memo-testkorpus-1-brill-korp-alle-filer-i-et-korpus.xml

CORPUSUPPER=${CORPUSNAME^^}
CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`

# Tjek om korpusfilen findes.
if [ -f "$CORPORADIR/annotated/$CORPUSFILE" ]
then

	# Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
	rm -rf $CORPORADIR/data/$CORPUSNAME
	mkdir -p $CORPORADIR/data/$CORPUSNAME

	# Fjern registryindgangen.
	rm -f $CORPORADIR/registry/$CORPUSNAME

	# Kør cwb-encode med diverse parametre:
	# -d: Det direktorie hvor de encodede filer skal ligge.
	# -R: Registryindgangen.
	# -x: XML-kompatibilitet.
	# -s: Skip blanke linjer.
	# -c: Encoding.
	# -f: Inputfil (vrt-format).
	# -P: Positional attribute.
	# -S: Structural attribute.
	cwb-encode -d $CORPORADIR/data/$CORPUSNAME \
	           -R $CORPORADIR/registry/$CORPUSNAME \
	           -xs -c utf8 \
	           -f $CORPORADIR/annotated/$CORPUSFILE \
	           -P pos -P pos2 -P lemma \
	           -S sentence:0+id \
	           -S text:0+title+author+pseudonym+date+datefrom+dateto+timefrom+timeto+gender+source+nationality+subtitle+pages+illustrations+typeface+publisher+price \
	           -S corpus:0+title+datefrom+dateto

	# Gennemfør indekseringen
	cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER
fi

