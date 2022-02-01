#!/bin/bash
# encode_MEMO_fraktur_gold.sh
# Encode fraktur-guldstandarden med OCR-korrigeringsdata.

CORPORADIR=`dirname "$0"`/..
CORPORADIR=`realpath $CORPORADIR`
NOVELSDIR=$CORPORADIR/annotated/MEMO_FRAKTUR_GOLD/fraktur_freqs12_correasy_corrhard_symwordcorr

# Tjek om Brill-all-mappen findes.
if [ -d "$NOVELSDIR" ]
then

	# Opret outfiler.
	> memo_frakturgold_encoding_output.txt
	> memo_frakturgold_configs.txt

    # Hvis der ikke er nogen registry-mappe, så lav den.
    if [ ! -d $CORPORADIR/registry ]
    then mkdir -p $CORPORADIR/registry
    fi



    CORPUSFILE=$NOVELSDIR/MEMO_FRAKTUR_GOLD.annotated.vrt
    CORPUSBASENAME=`basename $CORPUSFILE`
    CORPUSNAME=MEMO_FRAKTUR_GOLD
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
    cwb-encode -d $CORPORADIR/data/$CORPUSLOWER \
               -R $CORPORADIR/registry/$CORPUSLOWER \
               -xs -c utf8 \
               -f $CORPUSFILE \
               -P lineword -P line -P page -P novel_id -P fraktur_ocrtok -P fraktur_leven -P fraktur_ratio -P fraktur_cer -P fraktur_levcat -P fraktur_subst -P fraktur_infreq -P dan_ocrtok -P dan_leven -P dan_ratio -P dan_cer -P dan_levcat -P dan_subst -P dan_infreq -P frk_ocrtok -P frk_leven -P frk_ratio -P frk_cer -P frk_levcat -P frk_subst -P frk_infreq -P kb_ocrtok -P kb_leven -P kb_ratio -P kb_cer -P kb_levcat -P kb_subst -P kb_infreq -P corr_ocrtok -P corr_leven -P corr_ratio -P corr_cer -P corr_levcat -P corr_subst -P corr_infreq -P sentword -P lemma -P pos -P gold_infreq \
               -S sentence:0+id \
               -S text:0+id \
               -S corpus:0+id \
               &>> memo_frakturgold_encoding_output.txt

    # Gennemfør indekseringen
    cwb-makeall -V -r $CORPORADIR/registry $CORPUSUPPER &>> $CORPORADIR/encodingscripts/output/memo_frakturgold_encoding_output.txt

    echo ""
fi
