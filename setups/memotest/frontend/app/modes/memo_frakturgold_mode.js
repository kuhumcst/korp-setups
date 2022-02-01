settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_fraktur_gold"];


/*
 * Positional attributes for test corpus.
 */

var memofrakturgoldAttrs = {
    lemma : attrs.baseform,
    pos : {
        label : "pos",
        dataset : {
            "pron" : "pron",
            "sb" : "sb",
            "v" : "v",
            "adv" : "adv",
            "ZD" : "ZD",
            "præp" : "præp",
            "adj" : "adj",
            "konj" : "konj",
            "ZP" : "ZP",
            "propr" : "propr",
            "præt" : "præt",
            "ATI" : "ATI",
            "XF" : "XF",
            "ZI" : "ZI",
            "num" : "num",
            "part" : "part",
            "ZQ" : "ZQ",
            "ubestpron" : "ubestpron",
            "interj" : "interj",
            "ZH" : "ZH",
            "ENDING" : "ENDING",
            "ZA" : "ZA",
            "XS" : "XS",
            "LEXICAL" : "LEXICAL",
            "ZS" : "ZS",
            "'" : "'",
            "//" : "//",
            "»" : "»"
        },
        opts : liteOptions,
        // Changed from selectType [sg]
        extendedComponent: "datasetSelect",
        escape: false
        },
    token: {
        label : "TOKEN",
        opts : settings.defaultOptions,
        order : 1
        },
    lineword: {
        label : "LINEWORD",
        opts : settings.defaultOptions,
        order : 1
        },
    line: {
        label : "LINE",
        opts : settings.defaultOptions,
        order : 1
        },
    page: {
        label : "PAGE",
        opts : settings.defaultOptions,
        order : 1
        },
    novel_id: {
        label : "NOVEL_ID",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_ocrtok: {
        label : "FRAKTUR_OCRTOK",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_leven: {
        label : "FRAKTUR_LEVEN",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_ratio: {
        label : "FRAKTUR_RATIO",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_cer: {
        label : "FRAKTUR_CER",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_levcat: {
        label : "FRAKTUR_LEVCAT",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_subst: {
        label : "FRAKTUR_SUBST",
        opts : settings.defaultOptions,
        order : 1
        },
    fraktur_infreq: {
        label : "FRAKTUR_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_ocrtok: {
        label : "DAN_OCRTOK",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_leven: {
        label : "DAN_LEVEN",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_ratio: {
        label : "DAN_RATIO",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_cer: {
        label : "DAN_CER",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_levcat: {
        label : "DAN_LEVCAT",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_subst: {
        label : "DAN_SUBST",
        opts : settings.defaultOptions,
        order : 1
        },
    dan_infreq: {
        label : "DAN_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_ocrtok: {
        label : "FRK_OCRTOK",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_leven: {
        label : "FRK_LEVEN",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_ratio: {
        label : "FRK_RATIO",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_cer: {
        label : "FRK_CER",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_levcat: {
        label : "FRK_LEVCAT",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_subst: {
        label : "FRK_SUBST",
        opts : settings.defaultOptions,
        order : 1
        },
    frk_infreq: {
        label : "FRK_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_ocrtok: {
        label : "KB_OCRTOK",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_leven: {
        label : "KB_LEVEN",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_ratio: {
        label : "KB_RATIO",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_cer: {
        label : "KB_CER",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_levcat: {
        label : "KB_LEVCAT",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_subst: {
        label : "KB_SUBST",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_infreq: {
        label : "KB_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_ocrtok: {
        label : "CORR_OCRTOK",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_leven: {
        label : "CORR_LEVEN",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_ratio: {
        label : "CORR_RATIO",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_cer: {
        label : "CORR_CER",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_levcat: {
        label : "CORR_LEVCAT",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_subst: {
        label : "CORR_SUBST",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_infreq: {
        label : "CORR_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        },
    sentword: {
        label : "SENTWORD",
        opts : settings.defaultOptions,
        order : 1
        },
    lemma: {
        label : "LEMMA",
        opts : settings.defaultOptions,
        order : 1
        },
    pos: {
        label : "POS",
        opts : settings.defaultOptions,
        order : 1
        },
    gold_infreq: {
        label : "GOLD_INFREQ",
        opts : settings.defaultOptions,
        order : 1
        }
};


$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

settings.corpora.memo_fraktur_gold = {
    id : "memo_fraktur_gold",
    title : "Frakturguld",
    description : "Korpus med guldstandard for frakturtekster opmærket med OCR-fejl",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturgoldAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);
