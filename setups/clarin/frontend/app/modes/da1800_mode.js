settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;


settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["lit1800jpjnlt"];

var da1800attrs = {};  // positional attributes for Danish Litterature 1800-1899 
da1800attrs.pos = {
    label : "pos",
    translationKey : "pos_",
    dataset : {
        "adj" : "ADJ",
        "adv" : "ADV",
        "konj" : "CONJ",
        "interj" : "INTERJ",
        "sb" : "NN",
        "num" : "NUM",
        "præp" : "PREP",
        "propr" : "PROP",
        "ubestpron" : "UBESTPRON",
        "pron" : "PRON",
        "ATI" : "UNIK",
        "præt" : "v_præt",
        "part" : "v_part",
        "v" : "VB",
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false,
};

var da1800Attrs = {
    pos : da1800attrs.pos,
    msd : attrs.msd,
    lemma : attrs.baseform,
    ref : attrs.ref,
    prefix : attrs.prefix,
    suffix : attrs.suffix
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

settings.corporafolders.lit1800 = {
    title : "Dansk 1800-tals litteratur (adl.dk)",
    contents : ["lit1800jpjnlt"]
};

/*settings.corpora.lit1800jpjnl= {
    id : "LIT1800JPJNL",
    title : "JacobsenJP Niels Lyhne (adl.dk)",
    description : "JacobsenJP: Niels Lyhne, testversion(kap1-3)",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : da1800Attrs,
    struct_attributes : {
        text_title : {label : "title"},
    }
};*/

settings.corpora.lit1800jpjnlt= {
    id : "LIT1800JPJNLT",
    title : "JacobsenJP Niels Lyhne (adl.dk)",
    description : "JacobsenJP: Niels Lyhne, testversion (kap 1-14)",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : da1800Attrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};


settings.corpusListing = new CorpusListing(settings.corpora);

