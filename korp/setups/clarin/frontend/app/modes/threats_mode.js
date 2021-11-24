settings.primaryColor = "#ded8d3";
settings.primaryLight = "#f4f2f0";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
// Note: Subtle gotcha - preselectedCorpora was previously preselected_corpora.
settings.preselectedCorpora = ["threats_art","threats_jeb","threats_jtb","threats_kar"];

console.log('Preselected corpora defined');

settings.corporafolders.trusler = {
        title : "Danske trusler",
        contents : ["threats_art","threats_jeb","threats_jtb","threats_kar"],
        description : "Trusselsbreve mv."
};

console.log('Corporafolders populated.');



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

var my_custom_msd = {
    label: "msd",
    opts: settings.defaultOptions,
    order: 1
};

var p_numincorp = {
    label: "num_in_corp",
    opts: settings.defaultOptions,
    order: 6,
    stats_stringify: function(values) {return values.join(" ")}
};
var p_numintext = {
    label: "num_in_text",
    opts: settings.defaultOptions,
    order: 7,
    stats_stringify: function(values) {return values.join(" ")}
};
var p_numinp = {
    label: "num_in_p",
    opts: settings.defaultOptions,
    order: 8,
    stats_stringify: function(values) {return values.join(" ")}
}; 
var p_numinline = {
    label: "num_in_line",
    opts: settings.defaultOptions,
    order: 9,
    stats_stringify: function(values) {return values.join(" ")}
};

var truAttrs = {
    pos : truattrs.pos,
    //msd : attrs.msd,
    msd : my_custom_msd,
    lemma : attrs.baseform,
    prefix : attrs.prefix,
    suffix : attrs.suffix,
    numincorp : p_numincorp,
    numintext : p_numintext,
    numinp : p_numinp,
    numinline : p_numinline
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

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
};


console.log('truStructAttributes defined.');

settings.corpora.threats_art = {
    id : "threats_art",
    title : "Trusselsbeskeder fra artikler",
    description : "Trusselsbeskeder fra artikler",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};


settings.corpora.threats_jeb = {
    id : "threats_jeb",
    title : "Udvalgte trusselsbreve fra Rigspolitiets arkiv: JEB",
    description : " - Jeg er bevægnet og har tømmermænd - Udvalgte trusselsbreve fra Rigspolitiets arkiv, 1980 til 2007",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};


settings.corpora.threats_jtb = {
    id : "threats_jtb",
    title : "Udvalgte trusselsbreve fra Rigspolitiets arkiv: JTB",
    description : " - Jeg tager bomben med når jeg går - Udvalgte trusselsbreve fra Rigspolitiets arkiv, 1980 til 2007",
	//within : settings.defaultWithin,
    // context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};


settings.corpora.threats_kar = {
    id : "threats_kar",
    title : "Trusler fra Karnov online",
    description : "Trusler fra Karnov online",
	//within : settings.defaultWithin,
    //context : settings.defaultContext,
	within : threatsWithin,
	context : threatsContext,

    attributes : truAttrs,
    structAttributes : truStructAttributes
};


console.log('Corpus configs defined.');


settings.corpusListing = new CorpusListing(settings.corpora);

console.log('settings.corpusListing defined');

