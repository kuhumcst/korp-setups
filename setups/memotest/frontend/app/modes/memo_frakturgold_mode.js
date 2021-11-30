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

// Note: liteOptions is hard to find, but exists in common.js, 
// which we currently import directly from Spraakbanken's github.
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
    lineword: {
        label : "lineword",
        opts : settings.defaultOptions,
        order : 1
        },
    line: {
        label : "line",
        opts : settings.defaultOptions,
        order : 1
        },
    page: {
        label : "page",
        opts : settings.defaultOptions,
        order : 1
        },
    ocrtok: {
        label : "ocrtok",
        opts : settings.defaultOptions,
        order : 1
        },
    leven: {
        label : "leven",
        opts : settings.defaultOptions,
        order : 1
        },
    ratio: {
        label : "ratio",
        opts : settings.defaultOptions,
        order : 1
        },
    cer: {
        label : "cer",
        opts : settings.defaultOptions,
        order : 1
        },
    levcat: {
        label : "levcat",
        opts : settings.defaultOptions,
        order : 1
        },
    subst: {
        label : "subst",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_ocrtok: {
        label : "kb_ocrtok",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_leven: {
        label : "kb_leven",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_ratio: {
        label : "kb_ratio",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_cer: {
        label : "kb_cer",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_levcat: {
        label : "kb_levcat",
        opts : settings.defaultOptions,
        order : 1
        },
    kb_subst: {
        label : "kb_subst",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_ocrtok: {
        label : "corr_ocrtok",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_leven: {
        label : "corr_leven",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_ratio: {
        label : "corr_ratio",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_cer: {
        label : "corr_cer",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_levcat: {
        label : "corr_levcat",
        opts : settings.defaultOptions,
        order : 1
        },
    corr_subst: {
        label : "corr_subst",
        opts : settings.defaultOptions,
        order : 1
        },
    sentword: {
        label : "sentword",
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
