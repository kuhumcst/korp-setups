settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["saxodel01", "saxodel02","saxodel03", "saxodel04","saxodel05", "saxodel06","saxodel07", "saxodel08","saxodel09", "saxodel10","saxodel11", "saxodel12","saxodel13", "saxodel14","saxodel15", "saxodel16"];

var saxoattrs = {};  // positional attributes for saxo

saxoattrs.pos = {
    label : "pos",
    translationKey : "pos_",
    dataset : {
        //"ABBR" : "ABBR",
        //"ADJ" : "ADJ",
        "ADJ|ADJ_COM_SING|ADJ_COM_SING_INDEF|ADJ_COMP|ADJ_COMP_PLU|ADJ_COMP_SING_INDEF|ADJ_DEF|ADJ_GEN|ADJ_NEUT_SING|ADJ_NEUT_SING_INDEF|ADJ_PLU|ADJ_PLU_GEN|ADJ_PLU_INDEF|ADJ_SING|ADJ_SING_DEF|ADJ_SING_GEN_DEF|ADJ_SING_INDEF|ADJ_SUP|ADJ_SUP_DEF|ADJ_SUP_PLU|ADJ_SUP_PLU_DEF|ADJ_SUP_SING_DEF_" : "ADJ",
        "ADV|ADV_COMP|ADV_SUP" : "AB",
        "CONJ" : "CONJ",
        "INTERJ" : "INTERJ",
        "NN|NN_ACTION_COM_SING|NN_COM_PLU|NN_COM_PLU_DEF|NN_COM_PLU_GEN_DEF|NN_COM_PLU_GEN_INDEF|NN_COM_PLU_INDEF|NN_COM_SING_DEF|NN_COM_SING_DEF_GEN|NN_COM_SING_DEF_GEN|NN_COM_SING_GEN_INDEF|NN_COM_SING_INDEF|NN_INDEF|NN_NEUT_PLU_DEF|NN_NEUT_PLU_GEN_DEF|NN_NEUT_PLU_GEN_INDEF|NN_NEUT_PLU_INDEF|NN_NEUT_SING_DEF|NN_NEUT_SING_GEN_DEF|NN_NEUT_SING_GEN_INDEF|NN_NEUT_SING_INDEF|NN_NEUT_PLU_INDEF|NN_NEUT_SING_INDEF" : "NN",
        "NUM" : "NUM",
        "OTHER" : "OTHER",
        "PREP" : "PREP",
        "PRON" : "PRON",
        "PROPN" : "PROPN",
        //"SYM" : "SYM",
        "UNIK" : "UNIK",
        "V" : "V",
        "vb" : "vb",
        //"X" : "X"
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false,
};

var saxoAttrs = {
    pos : saxoattrs.pos,
    msd : attrs.msd,
    lemma : attrs.baseform,
    ref : attrs.ref,
    prefix : attrs.prefix,
    suffix : attrs.suffix
};

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();

settings.corporafolders.saxo = {
    title : "Saxo Grammaticus delt op i bøger",
    contents : ["saxodel01", "saxodel02","saxodel03", "saxodel04","saxodel05", "saxodel06","saxodel07", "saxodel08","saxodel09", "saxodel10","saxodel11", "saxodel12","saxodel13", "saxodel14","saxodel15", "saxodel16",]
};

settings.corpora.saxodel01= {
    id : "SAXODEL01",
    title : "Saxo bog 1",
    description : "Saxo bog 1",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel02= {
    id : "SAXODEL02",
    title : "Saxo bog 2",
    description : "Saxo bog 2",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel03= {
    id : "SAXODEL03",
    title : "Saxo bog 3",
    description : "Saxo bog 3",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel04= {
    id : "SAXODEL04",
    title : "Saxo bog 4",
    description : "Saxo bog 4",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel05= {
    id : "SAXODEL05",
    title : "Saxo bog 5",
    description : "Saxo bog 5",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel06= {
    id : "SAXODEL06",
    title : "Saxo bog 6",
    description : "Saxo bog 6",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel07= {
    id : "SAXODEL07",
    title : "Saxo bog 7",
    description : "Saxo bog 7",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel08= {
    id : "SAXODEL08",
    title : "Saxo bog 8",
    description : "Saxo bog 8",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel09= {
    id : "SAXODEL09",
    title : "Saxo bog 9",
    description : "Saxo bog 9",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel10= {
    id : "SAXODEL10",
    title : "Saxo bog 10",
    description : "Saxo bog 10",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel11= {
    id : "SAXODEL11",
    title : "Saxo bog 11",
    description : "Saxo bog 11",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel12= {
    id : "SAXODEL12",
    title : "Saxo bog 12",
    description : "Saxo bog 12",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel13= {
    id : "SAXODEL13",
    title : "Saxo bog 13",
    description : "Saxo bog 13",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel14= {
    id : "SAXODEL14",
    title : "Saxo bog 14",
    description : "Saxo bog 14",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel15= {
    id : "SAXODEL15",
    title : "Saxo bog 15",
    description : "Saxo bog 15",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxodel16= {
    id : "SAXODEL16",
    title : "Saxo bog 16",
    description : "Saxo bog 16",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : saxoAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

/*settings.corpora.saxos= {
    id : "SAXOS",
    title : "Saxo test",
    description : "Saxo TEST",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.saxoa= {
    id : "SAXOA",
    title : "Saxo test A",
    description : "Saxo TEST",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};*/

settings.corpusListing = new CorpusListing(settings.corpora);

