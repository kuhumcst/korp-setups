settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["dkconstitutiontest"];

settings.corporafolders.testcorp = {
    title : "Testkorpusser",
    contents : ["dkconstitutiontest"],
    description : "Testkorpusser til at teste funktionaliteten af CWB og Korp."
};

/*
 * Positional attributes for test corpus.
 */

var testcorpAttrs = {};  

testcorpAttrs.msd = {
    label : "MSD",
    dataset : {
        "EGEN_GEN" : "EGEN_GEN",
        "N_DEF_PLU" : "N_DEF_PLU",
        "N_DEF_PLU_GEN" : "N_DEF_PLU_GEN",
        "N_DEF_SING" : "N_DEF_SING",
        "N_DEF_SING_GEN" : "N_DEF_SING_GEN",
        "N_INDEF_PLU" : "N_INDEF_PLU",
        "N_INDEF_PLU_GEN" : "N_INDEF_PLU_GEN",
        "N_INDEF_SING" : "N_INDEF_SING",
        "N_INDEF_SING_GEN" : "N_INDEF_SING_GEN",
        "NUM_ORD" : "NUM_ORD",
        "PRON_DEMO" : "PRON_DEMO",
        "PRON_INTER_REL" : "PRON_INTER_REL",
        "PRON_INTER_REL_GEN" : "PRON_INTER_REL_GEN",
        "PRON_PERS" : "PRON_PERS",
        "PRON_POSS" : "PRON_POSS",
        "PRON_UBST" : "PRON_UBST",
        "V_GERUND" : "V_GERUND",
        "V_IMP" : "V_IMP",
        "V_INF" : "V_INF",
        "V_INF_PAS" : "V_INF_PAS",
        "V_PARTC_PAST" : "V_PARTC_PAST",
        "V_PARTC_PRES" : "V_PARTC_PRES",
        "V_PAST" : "V_PAST",
        "V_PAST_PAS" : "V_PAST_PAS",
        "V_PRES" : "V_PRES",
        "V_PRES_PAS" : "V_PRES_PAS"
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false,
};


var testcorpAttrs = {
    pos : testcorpAttrs.msd,
    lemma : attrs.baseform
};

$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

settings.corpora.dkconstitutiontest = {
    id : "dkconstitutiontest",
    title : "Danmarks grundlov",
    description : "Testkorpus: Tre kapitler af Danmarks grundlov som separate tekster.",
    within : settings.defaultWithin,
    context : {"1 stk": "1 stk"}, //defaultContext,
    attributes : testcorpAttrs, //modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
        paragraph_id : {label : "paragraph"},
        stk_id : {label : "section"},
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);
