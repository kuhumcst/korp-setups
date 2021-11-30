#!/bin/bash
# encodeBille.sh
# Encode vrt-filen med Jens Billes håndskrift (middelalderviser) vha. cwb-encode.

THISDIR=`dirname "$0"`

echo "Encoding Bille ..."

CORPORADIR="$THISDIR"/..
CORPORADIR=`realpath $CORPORADIR`

echo "Corporadir:"
echo "$CORPORADIR"

# <text title="Bille nr. 1: Flores og Margrete [DgF: 86 B II 427-428]" date="15590101" datefrom="15590101" dateto="15590101" timefrom="000000" timeto="235959" url="https://cst.dk/dighumlab/duds/DFK/Dorthe/html/BILL1.htm">
# <p id="1">
# <sentence type="vers">
# follcked	folket	folk	sb	na
P_attrs="-P neutral -P lemma -P pos -P glosse"
S_attrs="-S sentence:0+type -S p:0+id -S text:0+title+date+datefrom+dateto+timefrom+timeto+url"

#echo "MY_VAR.xml" | sed -e 's/_//g' -e 's/\.xml//g'
CORPUSFILE="$CORPORADIR"/vrt/DUDSDFK_BILLall.cqp
CORPUSBASENAME=`basename $CORPUSFILE`
CORPUSNAME=`echo $CORPUSBASENAME | sed -e 's/\.[a-z]\+$//g'`
CORPUSUPPER=${CORPUSNAME^^}
CORPUSLOWER=${CORPUSNAME,,}
STDOUT_FILE="/var/log/"$CORPUSLOWER"_stdout.txt"

# Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
rm -rf $CORPORADIR/data/$CORPUSLOWER
mkdir -p $CORPORADIR/data/$CORPUSLOWER

if [ -d "$CORPORADIR/registry" ]
  then
	echo "Directory 'registry' already present. Continuing ..."
  else
	echo "Directory 'registry' not present. Will create it."
	mkdir -p $CORPORADIR/registry
fi

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
		   $P_attrs \
		   $S_attrs \
		   &>> $STDOUT_FILE

# Gennemfør indekseringen
cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $STDOUT_FILE

echo "Done encoding $CORPUSUPPER."
echo ""
