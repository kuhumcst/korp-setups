settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_fraktur_corr_1870", "memo_fraktur_corr_1871", "memo_fraktur_corr_1872", "memo_fraktur_corr_1873", "memo_fraktur_corr_1874", "memo_fraktur_corr_1875", "memo_fraktur_corr_1876", "memo_fraktur_corr_1877", "memo_fraktur_corr_1878", "memo_fraktur_corr_1880", "memo_fraktur_corr_1881", "memo_fraktur_corr_1882", "memo_fraktur_corr_1883", "memo_fraktur_corr_1884", "memo_fraktur_corr_1885", "memo_fraktur_corr_1886", "memo_fraktur_corr_1887", "memo_fraktur_corr_1888", "memo_fraktur_corr_1889", "memo_fraktur_corr_1890", "memo_fraktur_corr_1891"];

settings.corporafolders.memotestdecades = {
    title : "MeMo korrigeret fraktur, romaner pr. tiår",
    description : "Testkorpusser fra Measuring Modernity-projektet: Romaner fra Det Moderne Gennembrud, korrigeret for OCR-fejl, grupperet efter tiår.",
};

settings.corporafolders.memotestdecades.memo1870ies = {
    title : "MeMo korrigeret fraktur, romaner fra 1870'erne",
    description : "Romaner fra Det Moderne Gennembrud, korrigeret for OCR-fejl.",
    contents : ["memo_fraktur_corr_1870", "memo_fraktur_corr_1871", "memo_fraktur_corr_1872", "memo_fraktur_corr_1873", "memo_fraktur_corr_1874", "memo_fraktur_corr_1875", "memo_fraktur_corr_1876", "memo_fraktur_corr_1877", "memo_fraktur_corr_1878"]
};

settings.corporafolders.memotestdecades.memo1880ies = {
    title : "MeMo korrigeret fraktur, romaner fra 1880'erne",
    description : "Romaner fra Det Moderne Gennembrud, korrigeret for OCR-fejl.",
    contents : ["memo_fraktur_corr_1880", "memo_fraktur_corr_1881", "memo_fraktur_corr_1882", "memo_fraktur_corr_1883", "memo_fraktur_corr_1884", "memo_fraktur_corr_1885", "memo_fraktur_corr_1886", "memo_fraktur_corr_1887", "memo_fraktur_corr_1888", "memo_fraktur_corr_1889"]
};

settings.corporafolders.memotestdecades.memo1890ies = {
    title : "MeMo korrigeret fraktur, romaner fra 1890'erne",
    description : "Romaner fra Det Moderne Gennembrud, korrigeret for OCR-fejl.",
    contents : ["memo_fraktur_corr_1890", "memo_fraktur_corr_1891"]
};


/*
 * Positional attributes for test corpus.
 */

// Note: liteOptions is hard to find, but exists in common.js,
// which we currently import directly from Spraakbanken's github.
/*
var memofrakturcorrAttrs = {
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
    ...,
    sentword: {
        label : "sentword",
        opts : settings.defaultOptions,
        order : 1
        }
};
*/

var memofrakturcorrAttrs = {
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
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    lineword: {
        label : "LINEWORD",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    line: {
        label : "LINE",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    novel_id: {
        label : "NOVEL_ID",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_ocrtok: {
        label : "KB_OCRTOK",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_leven: {
        label : "KB_LEVEN",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_ratio: {
        label : "KB_RATIO",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_cer: {
        label : "KB_CER",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_levcat: {
        label : "KB_LEVCAT",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_subst: {
        label : "KB_SUBST",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    kb_infreq: {
        label : "KB_INFREQ",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    sentword: {
        label : "SENTWORD",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    lemma: {
        label : "LEMMA",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    pos: {
        label : "POS",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        },
    corr_infreq: {
        label : "CORR_INFREQ",
        opts : settings.defaultOptions,
        order : 1,
        stats_stringify: function(values) {return values.join(" ")}
        }
};


$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

settings.corpora.memo_fraktur_corr_1870 = {
    id : "memo_fraktur_corr_1870",
    title : "MeMo korrigeret fraktur 1870",
    description : "Korpus med frakturtekster fra 1870 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1871 = {
    id : "memo_fraktur_corr_1871",
    title : "MeMo korrigeret fraktur 1871",
    description : "Korpus med frakturtekster fra 1871 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1872 = {
    id : "memo_fraktur_corr_1872",
    title : "MeMo korrigeret fraktur 1872",
    description : "Korpus med frakturtekster fra 1872 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1873 = {
    id : "memo_fraktur_corr_1873",
    title : "MeMo korrigeret fraktur 1873",
    description : "Korpus med frakturtekster fra 1873 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1874 = {
    id : "memo_fraktur_corr_1874",
    title : "MeMo korrigeret fraktur 1874",
    description : "Korpus med frakturtekster fra 1874 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1875 = {
    id : "memo_fraktur_corr_1875",
    title : "MeMo korrigeret fraktur 1875",
    description : "Korpus med frakturtekster fra 1875 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1876 = {
    id : "memo_fraktur_corr_1876",
    title : "MeMo korrigeret fraktur 1876",
    description : "Korpus med frakturtekster fra 1876 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1877 = {
    id : "memo_fraktur_corr_1877",
    title : "MeMo korrigeret fraktur 1877",
    description : "Korpus med frakturtekster fra 1877 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1878 = {
    id : "memo_fraktur_corr_1878",
    title : "MeMo korrigeret fraktur 1878",
    description : "Korpus med frakturtekster fra 1878 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1880 = {
    id : "memo_fraktur_corr_1880",
    title : "MeMo korrigeret fraktur 1880",
    description : "Korpus med frakturtekster fra 1880 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1881 = {
    id : "memo_fraktur_corr_1881",
    title : "MeMo korrigeret fraktur 1881",
    description : "Korpus med frakturtekster fra 1881 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1882 = {
    id : "memo_fraktur_corr_1882",
    title : "MeMo korrigeret fraktur 1882",
    description : "Korpus med frakturtekster fra 1882 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1883 = {
    id : "memo_fraktur_corr_1883",
    title : "MeMo korrigeret fraktur 1883",
    description : "Korpus med frakturtekster fra 1883 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1884 = {
    id : "memo_fraktur_corr_1884",
    title : "MeMo korrigeret fraktur 1884",
    description : "Korpus med frakturtekster fra 1884 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1885 = {
    id : "memo_fraktur_corr_1885",
    title : "MeMo korrigeret fraktur 1885",
    description : "Korpus med frakturtekster fra 1885 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1886 = {
    id : "memo_fraktur_corr_1886",
    title : "MeMo korrigeret fraktur 1886",
    description : "Korpus med frakturtekster fra 1886 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1887 = {
    id : "memo_fraktur_corr_1887",
    title : "MeMo korrigeret fraktur 1887",
    description : "Korpus med frakturtekster fra 1887 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1888 = {
    id : "memo_fraktur_corr_1888",
    title : "MeMo korrigeret fraktur 1888",
    description : "Korpus med frakturtekster fra 1888 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1889 = {
    id : "memo_fraktur_corr_1889",
    title : "MeMo korrigeret fraktur 1889",
    description : "Korpus med frakturtekster fra 1889 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1890 = {
    id : "memo_fraktur_corr_1890",
    title : "MeMo korrigeret fraktur 1890",
    description : "Korpus med frakturtekster fra 1890 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_fraktur_corr_1891 = {
    id : "memo_fraktur_corr_1891",
    title : "MeMo korrigeret fraktur 1891",
    description : "Korpus med frakturtekster fra 1891 der er korrigeret automatisk for OCR-fejl.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memofrakturcorrAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "Titel"},
        sentence_id : {label : "Sætning nr."}
    }
};


settings.corpusListing = new CorpusListing(settings.corpora);
