#!/bin/bash
# encode_testcorpus.sh
# Encode korpusset xxxxxxx vha. cwb-encode.

CORPUSNAME=lanchart
CORPUSFILE=vrt_out.txt

CORPUSUPPER=${CORPUSNAME^^}
CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`

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
           -P nul1 -P nul2 -P nul3 -P nul4 -P nul5 -P nul6 -P nul7 -P phoneme -P pos -P pos2 -P ipa -P nul8 -P nul9 -P Mmmm -P nul10 -P Ssss  -P Aaaa  -P nul11 -P nul12 -P nul13 -P nul14 -P xmin -P xmax \
           -S turn:0+speaker -S text:0+xmin+xmax+size+tiers

# Gennemfør indekseringen
cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER

