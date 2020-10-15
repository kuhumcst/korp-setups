#!/bin/bash
# encode_testcorpus.sh
# Encode korpusset lanchart_amager vha. cwb-encode.

CORPUSNAME=lanchart_amager
CORPUSFILE=lanchart_amager.vrt

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
	           -P xmin -P xmax -P phonetic -P uncertain_transcription -P IPA -P PoS -P RedPoS \
               -P TtT -P speaker -P Comments -P events -P xlength -P tur -P segment -P filename -P grammatik \
			   -P gramma_II -P generisk -P GEX -P GIDDY -P Interaktionsstruktur -P Aktivitetstype -P Udsigelse \
			   -P Genre -P Samtaletype -P Makro-sproghandling -P IIV_SMU_kommentarer -P IIV_AIG_kommentarer \
			   -P global_events -P turn -P sync -P semvar -P epistsætn -P AUX \
			   -S corpus \
			   -S text:0+xmin+xmax+xlength+size+filename \
			   -S turn:0+taler+xmin+xmax+xlength \
			   -S segment:0+xmin+xmax+xlength

	# Gennemfør indekseringen
	cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER
fi



