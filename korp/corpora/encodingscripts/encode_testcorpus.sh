#!/bin/bash
# encode_testcorpus.sh
# Encode korpusset xxxxxxx vha. cwb-encode.

CORPUSNAME=dkconstitutiontest

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
           -f $CORPORADIR/annotated/DK.constitution.tabulator.vrt \
           -P pos -P lemma \
           -S stk:0+id -S paragraph:0+id -S text:0+title

# Gennemfør indekseringen
cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER

