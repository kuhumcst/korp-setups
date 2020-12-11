settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselected_corpora = ["threatsjeb"];


var threatsContext = {
    "1 sentence": "1 sentence",
    "1 p": "1 paragraph"
};

var threatsWithin = {
    "text" : "text"
};

var truattrs = {};  // positional attributes for threats corpora

truattrs.pos = {
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
    pos : truattrs.pos,
    msd : attrs.msd,
    lemma : attrs.baseform,
    prefix : attrs.prefix,
    suffix : attrs.suffix
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

settings.corporafolders.trusler = {
        title : "Danske trusler",
        contents : ["threatsjeb","threatsjeb2","threatskar","threatsart"],
        description : "Trusselsbreve mv."
};


var truStructAttributes = {
    text_title : {label : "title"},
    text_Instrument : {label : "Instrument"},
    text_Platform : {label : "Platform"},
    text_Mediatype : {label : "Mediatype"},
    text_Original : {label : "Original"},
    text_Domain : {label : "Domain"},
    text_Exactdate : {label : "Exactdate"},
    text_Notbeforedate : {label : "Notbeforedate"},
    text_Notafterdate : {label : "Notafterdate"},
    text_Origplace : {label : "Origplace"},
    text_Juridoutcome : {label : "Juridoutcome"},
    text_SenderTargetrelation : {label : "SenderTargetrelation"},
    text_Sendertype : {label : "Sendertype"},
    text_SenderID : {label : "SenderID"},
    text_Senderage : {label : "Senderage"},
    text_Sendergender : {label : "Sendergender"},
    text_Victimtype : {label : "Victimtype"},
    text_VictimID : {label : "VictimID"},
    text_Victimage : {label : "Victimage"},
    text_Victimgender : {label : "Victimgender"},
    sentence_id : {label : "id"},
    paragraph_id : {label : "idp"}
}

settings.corpora.threatsjeb = {
    id : "THREATSJEB",
    title : "Udvalgte trusselsbreve fra Rigspolitiets arkiv: JEB 1",
    description : "JEB - Udvalgte trusselsbreve fra Rigspolitiets arkiv, 1980 til 2007",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};

settings.corpora.threatsjeb2 = {
    id : "THREATSJEB2",
    title : "Udvalgte trusselsbreve fra Rigspolitiets arkiv: JEB 2",
    description : "JEB - Udvalgte trusselsbreve fra Rigspolitiets arkiv 2, 1980 til 2007",
	//within : settings.defaultWithin,
    // context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};

settings.corpora.threatskar = {
    id : "THREATSKAR",
    title : "Trusler fra Karnov online",
    description : "Trusler fra Karnov online",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};

settings.corpora.threatsart = {
    id : "THREATSART",
    title : "Trusselsbeskeder fra artikler",
    description : "Trusselsbeskeder fra artikler",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};

settings.corpusListing = new CorpusListing(settings.corpora);
