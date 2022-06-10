#!/bin/bash
# encode_memo.sh
# Encode hele MeMo-korpusset med antikva og korrigeret fraktur.

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
NOVELSDIR=$CORPORADIR/annotated/memo_all

# Tjek om Brill-all-mappen findes.
if [ -d "$NOVELSDIR" ]
then

	# Opret outfiler.
	> memo_encoding_output.txt
	> memo_configs.txt

    # Hvis der ikke er nogen registry-mappe, så lav den.
    if [ ! -d $CORPORADIR/registry ]
    then mkdir -p $CORPORADIR/registry
    fi



    CORPUSFILE=$NOVELSDIR/MEMO_ALL.vrt
    CORPUSBASENAME=`basename $CORPUSFILE`
    CORPUSNAME=MEMO_ALL
    CORPUSUPPER=${CORPUSNAME^^}
    CORPUSLOWER=${CORPUSNAME,,}

    # Fjern encodede filer hvis de findes. Lav direktoriet til encodede filer på ny.
    rm -rf $CORPORADIR/data/$CORPUSLOWER
    mkdir -p $CORPORADIR/data/$CORPUSLOWER

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

    # Forklaring til P-attributterne:
    # [word]: guldtoken
    # lineword: nummer ord på den givne linje
    # line: linjenummer
    # page: sidetal
    # ocrtok: OCR-token fra Tesseract
    # leven: ocrtoks levenshtein distance fra word
    # ratio: ocrtoks levenshtein ratio fra word
    # cer: ocrtoks character error rate ift. word
    # levcat: ocrtoks fejlkategori ift. word
    # subst: hvad er udskiftet i ocrtok ift. word
    # kb_ocrtok osv.: tilsvarende kategorier for KB's OCR-tokens
    # corr_ocrtok osv.: tilsvarende kategorier for korrigerede Tesseract-OCR-tokens
    # sentword: nummer ord i den givne sætning
    # lemma: lemmaet til word
    # pos: ordklassen til word

    # NOTE: No sentences yet!!!
#     cwb-encode -d $CORPORADIR/data/$CORPUSLOWER \
#                -R $CORPORADIR/registry/$CORPUSLOWER \
#                -xs -c utf8 \
#                -f $CORPUSFILE \
#                -P wordnum -P lineword -P line -P page -P novel_id \
#                -S sentence:0+id \
#                -S text:0+id+file_id+firstname+surname+pseudonym+gender+nationality+title+subtitle+volume+year+pages+illustrations+typeface+publisher+price+source+notes+readable \
#                -S corpus:0+id \
#                 &>> memo_encoding_output.txt
    cwb-encode -d $CORPORADIR/data/$CORPUSLOWER \
               -R $CORPORADIR/registry/$CORPUSLOWER \
               -xs -c utf8 \
               -f $CORPUSFILE \
               -P wordnum -P lineword -P line -P page -P novel_id \
               -S text:0+id+file_id+firstname+surname+pseudonym+gender+nationality+title+subtitle+volume+year+pages+illustrations+typeface+publisher+price+source+notes+readable \
               -S corpus:0+id \
                &>> memo_encoding_output.txt

    # Gennemfør indekseringen
    cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $CORPORADIR/encodingscripts/output/memo_encoding_output.txt

    echo ""
fi
