settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["lanchart"];

settings.corporafolders.lanchart = {
    title : "LANCHART",
    contents : ["lanchart"],
    description : "LANCHART-korpusset (in spe)."
};

/*
 * Positional attributes for test corpus.
 */

var lanchartAttrs = {};  

lanchartAttrs.nul1 = {
    label: "nul1",
    opts: settings.defaultOptions,
    order: 0
};

lanchartAttrs.nul2 = {
    label: "nul2",
    opts: settings.defaultOptions,
    order: 1
};

lanchartAttrs.nul3 = {
    label: "nul3",
    opts: settings.defaultOptions,
    order: 2
};

lanchartAttrs.nul4 = {
    label: "nul4",
    opts: settings.defaultOptions,
    order: 3
};

lanchartAttrs.nul5 = {
    label: "nul5",
    opts: settings.defaultOptions,
    order: 4
};

lanchartAttrs.nul6 = {
    label: "nul6",
    opts: settings.defaultOptions,
    order: 5
};

lanchartAttrs.nul7 = {
    label: "nul7",
    opts: settings.defaultOptions,
    order: 6
};

lanchartAttrs.nul8 = {
    label: "nul8",
    opts: settings.defaultOptions,
    order: 7
};

lanchartAttrs.nul9 = {
    label: "nul9",
    opts: settings.defaultOptions,
    order: 8
};

lanchartAttrs.nul10 = {
    label: "nul10",
    opts: settings.defaultOptions,
    order: 9
};

lanchartAttrs.nul11 = {
    label: "nul11",
    opts: settings.defaultOptions,
    order: 10
};

lanchartAttrs.nul12 = {
    label: "nul12",
    opts: settings.defaultOptions,
    order: 11
};

lanchartAttrs.nul13 = {
    label: "nul13",
    opts: settings.defaultOptions,
    order: 12
};

lanchartAttrs.nul14 = {
    label: "nul14",
    opts: settings.defaultOptions,
    order: 13
};

lanchartAttrs.phoneme = {
    label: "phoneme",
    opts: settings.defaultOptions,
    order: 14
};

lanchartAttrs.ipa = {
    label: "ipa",
    opts: settings.defaultOptions,
    order: 15
};

lanchartAttrs.Mmmm = {
    label: "Mmmm",
    opts: settings.defaultOptions,
    order: 16
};

lanchartAttrs.Ssss = {
    label: "Ssss",
    opts: settings.defaultOptions,
    order: 17
};

lanchartAttrs.Aaaa = {
    label: "Aaaa",
    opts: settings.defaultOptions,
    order: 18
};

lanchartAttrs.xmin = {
    label: "xmin",
    opts: settings.defaultOptions,
    order: 19
};

lanchartAttrs.xmax = {
    label: "xmax",
    opts: settings.defaultOptions,
    order: 20
};

lanchartAttrs.pos = {
    label: "pos",
    opts: settings.defaultOptions,
    order: 21
};

lanchartAttrs.pos2 = {
    label: "pos2",
    opts: settings.defaultOptions,
    order: 22
};


var lanchartAttrs = {
    nul1 : lanchartAttrs.nul1,
    nul2 : lanchartAttrs.nul2,
    nul3 : lanchartAttrs.nul3,
    nul4 : lanchartAttrs.nul4,
    nul5 : lanchartAttrs.nul5,
    nul6 : lanchartAttrs.nul6,
    nul7 : lanchartAttrs.nul7,
    nul8 : lanchartAttrs.nul8,
    nul9 : lanchartAttrs.nul9,
    nul10 : lanchartAttrs.nul10,
    nul11 : lanchartAttrs.nul11,
    nul12 : lanchartAttrs.nul12,
    nul13 : lanchartAttrs.nul13,
    nul14 : lanchartAttrs.nul14,
    phoneme : lanchartAttrs.phoneme,
    ipa : lanchartAttrs.ipa,
    Mmmm : lanchartAttrs.Mmmm,
    Ssss : lanchartAttrs.Ssss,
    Aaaa : lanchartAttrs.Aaaa,
    xmin : lanchartAttrs.xmin,
    xmax : lanchartAttrs.xmax,
    pos : lanchartAttrs.pos,
    pos2 : lanchartAttrs.pos2
};

var lanchartAttrs_working = {
    pos : lanchartAttrs.pos,
    pos2 : lanchartAttrs.pos2
};

$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

settings.corpora.lanchart = {
    id : "lanchart",
    title : "LANCHART ...",
    description : "LANCHART-korpusset in spe ...",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : lanchartAttrs, //modernAttrs,
    structAttributes : {
        turn_speaker : {label : "speaker"},
        text_xmin : {label : "textxmin"},
        text_xmax : {label : "textxmax"},
        text_size : {label : "textsize"},
        text_tiers : {label : "tiers"}
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);