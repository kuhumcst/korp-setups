#!/bin/bash
# encode_testcorpus.sh
# Encode korpusset xxxxxxx vha. cwb-encode.

corpusname=dkconstitutiontest

corpusupper=${corpusname^^}
corporadir=`dirname "$0"`/..

echo $corpusname
echo $corpusupper
#echo `ls -al $corporadir/data/$corpusname`

#if [ "$EUID" -ne 0 ]
#then echo "Use sudo to run this script. Exiting..."
#  exit 1
#fi

# Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
rm -rf $corporadir/data/$corpusname
mkdir -p $corporadir/data/$corpusname

# Fjern registryindgangen.
rm -f $corporadir/registry/$corpusname

# Kør cwb-encode med diverse parametre:
# -d: Det direktorie hvor de encodede filer skal ligge.
# -R: Registryindgangen.
# -c: Encoding.
# -f: Inputfil (vrt-format).
# -P: Positional attribute.
# -S: Structural attribute.
cwb-encode -d $corporadir/data/$corpusname \
           -R $corporadir/registry/$corpusname \
           -c utf8 \
           -f $corporadir/annotated/DK.constitution.tabulator.vrt \
           -P pos -P lemma \
           -S stk:0+id -S paragraph:0+id -S text:0+title

# Gennemfør indekseringen
cwb-makeall -V -r $corporadir/registry $corpusupper

