#!/bin/bash
# encode_testcorpus.sh
# Encode korpus vha. cwb-encode.

CORPUSNAME=lanchart_bornholm
CORPUSFILE=lanchart_bornholm.vrt


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
	# -c: Encoding.
	# -f: Inputfil (vrt-format).
	# -P: Positional attribute.
	# -S: Structural attribute.
	cwb-encode -d $CORPORADIR/data/$CORPUSNAME \
	           -R $CORPORADIR/registry/$CORPUSNAME \
	           -c utf8 \
	           -f $CORPORADIR/annotated/$CORPUSFILE \
	           -P xmin -P xmax -P Comments -P events -P phonetic -P uncertain_transcription -P IPA -P PoS -P RedPoS -P TtT -P turns -P turn -P sync -P speaker -P xlength -P filename \
			   -S corpus:0+label \
			   -S text:0+xmin+xmax+xlength+size+filename \
			   -S turn:0+speaker+xmin+xmax+xlength
	# Gennemfør indekseringen
	cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER
fi