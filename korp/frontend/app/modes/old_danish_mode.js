settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["duds"];

var gldaattrs = {};  // positional attributes for gl dansk

gldaattrs.pos = {
    label : "pos",
    translationKey : "pos_",
    dataset : {
        "adj" : "ADJ",
        "adv" : "AB",
        "art" : "UNIK",
	    "sb" : "NN",
        "konj" : "konj",
        "intj" : "intj",
        "num" : "num",
        "tgn" : "OTHER",
        "præp" : "PREP",
        "pron" : "PRON",
        "stn|pers|bn" : "PROPN",
        "uvis" : "uvis",
        "intp" : "intp",
        "vb" : "vb",
        "ukl" : "ukl",
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false,
};

settings.gldaAttrs = {
    neutral : {
                  label : "neutral",
                  type : "set",
                  opts : liteOptions,
                  extendedTemplate : "<input ng-model='model' >"
              },
    lemma : attrs.baseform,
    pos : gldaattrs.pos,
    homograf : {
                   label : "homograf",
                   type : "set",
                   opts : liteOptions,
                   extendedTemplate : "<input ng-model='model' >"
               },
    //ref : attrs.ref,
    prefix : attrs.prefix,
    suffix : attrs.suffix
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

settings.corporafolders.duds = {
        title : "Ældre danske tekster",
        contents : [],
        description : "Ældre danske tekster: folkeviser mv"
};

settings.corporafolders.duds.dfk = {
    title : "Den ældste danske viseoverlevering",
    contents : ["dudsdfkbille1","dudsdfkbillall"]
};

settings.corpora["dudsdfkbille1"] = {
    id : "DUDSDFKBILLE1",
    title : "Jens Billes håndskrift (1557-1559) Test Juli",
    description : "Viser til test. Her svarer en sætning til en linje i en vise, og et afsnit i teksten svarer til en strofe. Ved uklar datering bruges en fiktik startdato 1500.",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : settings.gldaAttrs,
    structAttributes : {
        text_title : {label : "title"},
        p_id : {label : "strofeid"},
        sentence_type : {label : "stype"},
        //sentence_id : {label : "sid"},
    }
};

settings.corpora["dudsdfkbillall"] = {
    id : "DUDSDFKBILLALL",
    title : "Jens Billes haandskrift(1557-1559) TEST",
    description : "Viser til test. Her svarer en sætning til en linje(vers) i en vise, og et afsnit i teksten svarer til en strofe. Ved uklar datering bruges en fiktik startdato.",
    within : settings.defaultWithin,
    context : {
                  "1 sentence" : "1 sentence",
                  "1 p" : "1 paragraph"
              },
    attributes : settings.gldaAttrs,
    structAttributes : {
        text_title : {label : "title"},
        p_id : {label : "strofeid"},
        sentence_type : {label : "stype"},
        //sentence_id : {label : "sid"},
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);
