#!/bin/bash
# encode_threats.sh
# Encode de enkelte trusselskorpusser vha. cwb-encode.

THISDIR=`dirname "$0"`

echo "Encoding threats ..."

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
# $VRTDIR er den mappe hvor .vrt-filer der er klar til at blive encodet, skal lægges.
VRTDIR=$CORPORADIR/vrt
if [ ! -d $VRTDIR ] ; then echo "$VRTDIR does not exist. $VRTDIR should exist and contain .vrt files. Exiting." ; exit 1 ; fi

VRTFILES=$VRTDIR/*.vrt

#<corpus title="Trusler fra Facebook" datefrom="01012007" dateto="31122007">
#<text title="FAC-001.xml" date="" datefrom="" dateto="" timefrom="000000" timeto="235959" Instrument="digital" Platform="social_media" Mediatype="messenger" Original="original" Domain="individual" Exactdate="" Notbeforedate="" Notafterdate="" Origplace="private" Juridoutcome="juridical" Sendertype="sender_unknown"SenderID="s0341" Senderage="unknown" Sendergender="unknown" Victimtype="victim_individual_politician" VictimID="v0306" Victimage="1973" Victimgender="female" SenderTargetrelation="none">
#<p idp="1">
P_attrs="-P pos -P msd -P lemma"
S_attrs="-S p:0+idp -S sentence:0+id -S corpus:0+title+id+datefrom+dateto -S text:0+title+date+datefrom+dateto+timefrom+timeto+Instrument+Platform+Mediatype+Original+Domain+Exactdate+Notbeforedate+Notafterdate+Origplace+Juridoutcome+Sendertype+SenderID+Senderage+Sendergender+Victimtype+VictimID+Victimage+Victimgender+SenderTargetrelation"


for VRTFILE in $VRTFILES; do

    # Spring over hvis $VRTFILE ikke er en fil
    if [ ! -f $VRTFILE ] ; then continue ; fi
    CORPUSBASENAME=`basename $VRTFILE`
    CORPUSNAME=`echo $CORPUSBASENAME | sed -e 's/\.vrt$//g'`
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
               -f $VRTFILE \
               $P_attrs \
               $S_attrs \
               &>> $STDOUT_FILE

    # Gennemfør indekseringen
    cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $STDOUT_FILE

    echo "Done encoding $CORPUSUPPER."
    echo ""
done
