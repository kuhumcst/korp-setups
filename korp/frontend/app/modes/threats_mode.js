settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;


settings.corpora = {};
settings.corporafolders = {};
settings.preselected_corpora = ["threatsjeb"];

var truAttrs = {};  // positional attributes for threats corpora

truAttrs.pos = {
    label : "pos",
    translationKey : "pos_",
    dataset : {
        "ADJ" : "ADJ",
        "ADV" : "ADV",
        "CONJ" : "CONJ",
        "INTERJ" : "INTERJ",
	    "N" : "N",
        "NUM" : "NUM",
        "OTHER" : "OTHER",
        "PREP" : "PREP",
        "PRON" : "PRON",
        "PROPN" : "PROPN",
        "V" : "V",
        "UNIK" : "UNIK",
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false,
};

var truAttrs = {
    pos : truAttrs.pos,
    msd : attrs.msd,
    lemma : attrs.baseform,
    prefix : attrs.prefix,
    suffix : attrs.suffix
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

settings.corporafolders.trusler = {
        title : "Danske trusler",
        contents : ["threatsjeb"],
        description : "Trusselsbreve mv."
};

settings.corpora.threatsjeb = {
    id : "THREATSJEB",
    title : "Udvalgte trusselsbreve fra Rigspolitiets arkiv: JEB",
    description : "JEB - Udvalgte trusselsbreve fra Rigspolitiets arkiv, 19800101 til 20071231",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : truAttrs,
    structAttributes : {
        text_title : {label : "title"},
        text_channel : {label : "channel"},
        text_writing : {label : "writing"},
        text_derivation : {label : "derivation"},
        text_domain : {label : "domain"},
        text_origin : {label : "origin"},
        text_interaction_type : {label : "interaction_type"},
        text_interaction_subtype : {label : "interaction_subtype"},
        text_sender : {label : "sender"},
        text_victim : {label : "victim"},
        text_relation : {label : "relation"},
        sentence_id : {label : "id"},
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);

