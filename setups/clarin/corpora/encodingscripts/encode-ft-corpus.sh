#!/bin/bash
# encode-ft-corpus.sh
# Encode folketingskorpusset vha. cwb-encode.
# OBS! For at fungere, skal EOL være LF ...

SCRIPTNAME=`basename $0`
STDOUT_FILE="/var/log/"$SCRIPTNAME"_stdout.txt"
THISDIR=`dirname "$0"`
NOW=`date`

#echo "$NOW: Loading trenddata into MySQL tables timedata and timedata_date ..." &>> $STDOUT_FILE
#
#mysql -B -uroot -p1234 korp -e "LOAD DATA LOCAL INFILE '/opt/corpora/trenddiagramdata/datetime.tsv' REPLACE INTO TABLE timedata FIELDS TERMINATED BY '\t' IGNORE 1 LINES (corpus, datefrom, dateto, tokens)"
#mysql -B -uroot -p1234 korp -e "LOAD DATA LOCAL INFILE '/opt/corpora/trenddiagramdata/date.tsv' REPLACE INTO TABLE timedata_date FIELDS TERMINATED BY '\t' IGNORE 1 LINES (corpus, datefrom, dateto, tokens)"

echo "Encoding FT corpus ..." &>> $STDOUT_FILE

# OBS: Det her bevirker at encodingscript-dir er nødt til at ligge i corpora-dir.
CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
VRT_DIR=$CORPORADIR/vrt

# -d tests if a directory is present or not.
if [ -d "$VRT_DIR" ]
  then
    echo "Directory 'vrt' present. Continuing ..." &>> $STDOUT_FILE
  else
    echo "Directory 'vrt' not present. Exiting." &>> $STDOUT_FILE
    exit 0
fi

CORPUSFILES="FT_KORPUS"
echo "CORPUSFILES: $CORPUSFILES" &>> $STDOUT_FILE
echo "" &>> $STDOUT_FILE

for f in $CORPUSFILES; do

    CORPUSUPPER="$f"
    echo "CORPUSUPPER: $CORPUSUPPER" &>> $STDOUT_FILE
    CORPUSLOWER=${CORPUSUPPER,,}
    echo "CORPUSLOWER: $CORPUSLOWER" &>> $STDOUT_FILE
    CORPUSBASENAME="$CORPUSLOWER.vrt"
    echo "CORPUSBASENAME: $CORPUSBASENAME" &>> $STDOUT_FILE
    CORPUSFILE="$VRT_DIR/$CORPUSBASENAME"
    echo "CORPUSFILE: $CORPUSFILE" &>> $STDOUT_FILE

    # Definer S- og P-attributter til de forskellige korpusser.
    if [ 0 = 1 ] ; then ATTRS=""  # Hack for at kunne generere de næste linjer ens.
    elif [ "$CORPUSUPPER" = FT_KORPUS ] ; then ATTRS="-S text:0+title+date+timeFrom+timeTo+duration+agendaItemNo+caseNo+caseType+agendaTitle+subject1+subject2+name+gender+party+role+MPtitle+birth+age -S p:0+idp -S sentence:0+id"
    fi

    # Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
    rm -rf $CORPORADIR/data/$CORPUSLOWER
    mkdir -p $CORPORADIR/data/$CORPUSLOWER

	if [ -d "$CORPORADIR/registry" ]
  	  then
        echo "Directory 'registry' already present. Continuing ..." &>> $STDOUT_FILE
      else
        echo "Directory 'registry' not present. Will create it ..." &>> $STDOUT_FILE
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
               -c utf8 \
               -f $CORPUSFILE \
               $ATTRS \
               &>> $STDOUT_FILE

    # Gennemfør indekseringen
    cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $STDOUT_FILE

    echo "Done encoding $CORPUSUPPER." &>> $STDOUT_FILE
    echo "" &>> $STDOUT_FILE

    echo "Creating .info file for $CORPUSUPPER necessary for displaying trend diagram ..." &>> $STDOUT_FILE
    
    #INFOPATH="$CORPORADIR/data/$CORPUSLOWER/.info"

    #datestr=`date +"%Y-%m-%d"`
    #firstdate=`mysql -B -uroot -p1234 korp --disable-column-names -e "select min(datefrom) from timedata where corpus = '"$CORPUSUPPER"'"`
    #lastdate=`mysql -B -uroot -p1234 korp --disable-column-names -e "select max(dateto) from timedata where corpus = '"$CORPUSUPPER"'"`

    #if [[ $firstdate != "NULL" && $lastdate != "NULL" ]]
    #    then
    #        > $INFOPATH
    #        echo "Updated: $datestr" >> $INFOPATH
    #        echo "FirstDate: $firstdate" >> $INFOPATH
    #        echo "LastDate: $lastdate" >> $INFOPATH
    #fi
done

echo "Done running $0."
echo "Stdout written to $STDOUT_FILE."
