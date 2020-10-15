#!/bin/bash
# encode_testcorpus.sh
# Encode korpusset lanchart_amager vha. cwb-encode.

CORPUSNAME=lanchart_koege
CORPUSFILE=lanchart_koege.vrt

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
	            -P xmin -P xmax -P phonetic -P events -P Comments -P grammatik \
				-P IPA -P PoS -P RedPoS -P TtT -P IIV_Kommentarer -P Genre \
			 	-P Aktivitetstype -P Interaktionsstruktur -P Udsigelse \
			 	-P Samtaletype -P Makro-sproghandling -P speaker -P emphasis \
			 	-P variant_fonetik -P variant_fonetik_kontekst_realiseret \
			 	-P variant_fonetik_kontekst_forventet -P variant_fonetik_R \
			 	-P ledsaet -P at-tab-ekspl -P at-tab-ekspl-komm -P KL -P xlength \
			 	-P tur -P segment -P filename -P Leksis_og_fraser -P uncertain_transcription -P TR-DK \
			   -S corpus \
			   -S text:0+xmin+xmax+xlength+size+filename \
			   -S turn:0+taler+xmin+xmax+xlength \
			   -S segment:0+xmin+xmax+xlength

	# Gennemfør indekseringen
	cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER
fi



