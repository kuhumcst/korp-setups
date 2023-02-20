#!/bin/bash
# Encoding script for cwb-encode generated automatically from "encode_vrt.jinja2".
# Philip Diderichsen, December 2022
# Encode en samling VRT-filer vha. cwb-encode.
# OBS! For at fungere, skal EOL være LF ...

SCRIPTNAME_EXT=$(basename "$0")
SCRIPTNAME="${SCRIPTNAME_EXT%.*}"
THISDIR=$(dirname "$0")
STDOUT_DIR="$THISDIR"/"$SCRIPTNAME"_stdout
if [ ! -d "$STDOUT_DIR" ]
  then
    echo "Directory '$STDOUT_DIR' not present. Will create it ..."
    mkdir -p "$STDOUT_DIR"
fi
STDOUT_FILE="$STDOUT_DIR"/stdout.txt

NOW=$(date)

> "$STDOUT_FILE"

 echo "$NOW: Loading trenddata into MySQL tables timedata and timedata_date ..." &>> "$STDOUT_FILE"
 mysql -B -uroot -p1234 korp -e "SET GLOBAL local_infile = true"
 mysql --local-infile=1 -B -uroot -p1234 korp -e "LOAD DATA LOCAL INFILE '/opt/corpora/trenddiagramdata/date.tsv' REPLACE INTO TABLE timedata_date FIELDS TERMINATED BY '\t' IGNORE 1 LINES (corpus, datefrom, dateto, tokens)"
 mysql --local-infile=1 -B -uroot -p1234 korp -e "LOAD DATA LOCAL INFILE '/opt/corpora/trenddiagramdata/datetime.tsv' REPLACE INTO TABLE timedata FIELDS TERMINATED BY '\t' IGNORE 1 LINES (corpus, datefrom, dateto, tokens)"

echo "Encoding VRT files ..." &>> "$STDOUT_FILE"

# OBS: encodingscript-dir er nødt til at ligge i corpora-dir.
CORPORADIR=$(dirname "$0")/..
CORPORADIR=$(realpath "$CORPORADIR")
VRT_DIR=$CORPORADIR/vrt

# -d tests if a directory is present or not.
if [ -d "$VRT_DIR" ]
  then
    echo "Directory 'vrt' present. Continuing ..." &>> "$STDOUT_FILE"
  else
    echo "Directory 'vrt' not present. Exiting." &>> "$STDOUT_FILE"
    exit 0
fi

# CORPUSFILES="LANCHART_BORNHOLM"
CORPUSFILES="MEMO_ALL"
echo "CORPUSFILES: $CORPUSFILES" &>> "$STDOUT_FILE"
echo "" &>> "$STDOUT_FILE"

for f in $CORPUSFILES; do

    CORPUSUPPER="$f"
    echo "CORPUSUPPER: $CORPUSUPPER" &>> "$STDOUT_FILE"
    CORPUSLOWER=${CORPUSUPPER,,}
    echo "CORPUSLOWER: $CORPUSLOWER" &>> "$STDOUT_FILE"
    CORPUSBASENAME="$CORPUSLOWER.vrt"
    echo "CORPUSBASENAME: $CORPUSBASENAME" &>> "$STDOUT_FILE"
    CORPUSFILE="$VRT_DIR/$CORPUSBASENAME"
    echo "CORPUSFILE: $CORPUSFILE" &>> "$STDOUT_FILE"

    # Definer S- og P-attributter til de forskellige korpusser.
    if [ 0 = 1 ] ; then ATTRS=""  # Hack for at kunne generere de næste linjer ens.
    # elif [ "$CORPUSUPPER" = LANCHART_BORNHOLM ] ; then ATTRS="-S corpus:0+label -S text:0+size+textmin+textmax+textduration+filename+datefrom+timefrom+dateto+timeto+oldnew+samtaler_dato+samtaler_projekt+samtaler_samtaletype+samtaler_eksplorativ+samtaler_korrektur+samtaler_prioriteret+samtaler_prioriteretekstra+projekter_name -S sentence -P ipa -P ttt -P redpos -P pos -P speaker -P colorcombo_bg -P colorcombo_border -P colorcombo_fg -P informanter_koen -P informanter_foedselsaar -P taleralder -P informanter_generation -P informanter_socialklasse -P rolle -P informanter_prioriteret -P informanter_prioriteretekstra -P text_enum -P turn_enum -P xmin -P xmax -P xlength -P turnummer -P talekilde -P turnmin -P turnmax -P turnduration -P phonetic -P comments -P events -P turn -P uncertainxtranscription -P sync"
    elif [ "$CORPUSUPPER" = MEMO_ALL ] ; then ATTRS="-S corpus:0+id -S text:0+file_id+file_received+filename+firstname+surname+pseudonym+gender+nationality+title+subtitle+volume+year+pages+illustrations+typeface+publisher+price+file_status+source+notes+filepath+fileformat+txt_received+readable+historical+period+period_notes+novel_start+novel_end+novelstart_rescan+novelend_rescan+start_end_page_notes+serialno+quarantine+discard+datefrom+dateto+timefrom+timeto -S paragraph:0+id -S sentence:0+id -P normalized -P lemma -P pos -P wordnum_in_sentence -P wordnum_in_line -P wordnum_global -P linenum -P pagenum"
    fi

    # Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
    rm -rf "$CORPORADIR"/data/"$CORPUSLOWER"
    mkdir -p "$CORPORADIR"/data/"$CORPUSLOWER"

    if [ -d "$CORPORADIR/registry" ]
      then
        echo "Directory 'registry' already present. Continuing ..." &>> "$STDOUT_FILE"
      else
        echo "Directory 'registry' not present. Will create it ..." &>> "$STDOUT_FILE"
        mkdir -p "$CORPORADIR"/registry
    fi

    # Fjern registryindgangen.
    rm -f "$CORPORADIR"/registry/"$CORPUSLOWER"

    # Kør cwb-encode med diverse parametre:
    # -d: Det direktorie hvor de encodede filer skal ligge.
    # -R: Registryindgangen.
    # -x: XML-kompatibilitet.
    # -s: Skip blanke linjer.
    # -c: Encoding.
    # -f: Inputfil (vrt-format).
    # -P: Positional attribute.
    # -S: Structural attribute.
    cwb-encode -d "$CORPORADIR"/data/"$CORPUSLOWER" \
               -R "$CORPORADIR"/registry/"$CORPUSLOWER" \
               -c utf8 \
               -f "$CORPUSFILE" \
               $ATTRS \
               &>> "$STDOUT_FILE"

    # Gennemfør indekseringen
    cwb-makeall -V -r "$CORPORADIR"/registry "$CORPUSUPPER" &>> "$STDOUT_FILE"

    echo "Done encoding $CORPUSUPPER." &>> "$STDOUT_FILE"
    echo "" &>> "$STDOUT_FILE"

    echo "Creating .info file for $CORPUSUPPER necessary for displaying trend diagram ..." &>> "$STDOUT_FILE"

    INFOPATH="$CORPORADIR/data/$CORPUSLOWER/.info"

    datestr=$(date +"%Y-%m-%d")
     firstdate=$(mysql -B -uroot -p1234 korp --disable-column-names -e "select min(datefrom) from timedata where corpus = '"$CORPUSUPPER"'")
     lastdate=$(mysql -B -uroot -p1234 korp --disable-column-names -e "select max(dateto) from timedata where corpus = '"$CORPUSUPPER"'")

    > "$INFOPATH"
    echo "Updated: $datestr" >> "$INFOPATH"
     echo "FirstDate: $firstdate" >> "$INFOPATH"
     echo "LastDate: $lastdate" >> "$INFOPATH"
done

echo "Done running $0."
echo "Stdout written to $STDOUT_FILE."