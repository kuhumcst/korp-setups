settings.primaryColor = "#ccdaec";
settings.primaryLight = "#d9e9fd";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["lanchart_amager"];

settings.corporafolders.lanchart = {
    title : "LANCHART test",
    contents : ["lanchart_amager", "lanchart_bornholm", "lanchart_koege"],
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



var amagerAttrs = {};

amagerAttrs.xmin = {
    label: "xmin",
    opts: settings.defaultOptions,
    order: 0
};

amagerAttrs.xmax = {
    label: "xmax",
    opts: settings.defaultOptions,
    order: 1
};

amagerAttrs.phonetic = {
    label: "phonetic",
    opts: settings.defaultOptions,
    order: 2
};

amagerAttrs.uncertain_transcription = {
    label: "uncertain_transcription",
    opts: settings.defaultOptions,
    order: 3
};

amagerAttrs.IPA = {
    label: "IPA",
    opts: settings.defaultOptions,
    order: 4
};

amagerAttrs.PoS = {
    label: "PoS",
    opts: settings.defaultOptions,
    order: 5
};

amagerAttrs.RedPoS = {
    label: "RedPoS",
    opts: settings.defaultOptions,
    order: 6
};

amagerAttrs.TtT = {
    label: "TtT",
    opts: settings.defaultOptions,
    order: 7
};

amagerAttrs.speaker = {
    label: "speaker",
    opts: settings.defaultOptions,
    order: 8
};

amagerAttrs.Comments = {
    label: "Comments",
    opts: settings.defaultOptions,
    order: 9
};

amagerAttrs.events = {
    label: "events",
    opts: settings.defaultOptions,
    order: 10
};

amagerAttrs.xlength = {
    label: "xlength",
    opts: settings.defaultOptions,
    order: 11
};

amagerAttrs.tur = {
    label: "tur",
    opts: settings.defaultOptions,
    order: 12
};

amagerAttrs.segment = {
    label: "segment",
    opts: settings.defaultOptions,
    order: 13
};

amagerAttrs.filename = {
    label: "filename",
    opts: settings.defaultOptions,
    order: 14
};

amagerAttrs.grammatik = {
    label: "grammatik",
    opts: settings.defaultOptions,
    order: 15
};

amagerAttrs.gramma_II = {
    label: "gramma_II",
    opts: settings.defaultOptions,
    order: 16
};

amagerAttrs.generisk = {
    label: "generisk",
    opts: settings.defaultOptions,
    order: 17
};

amagerAttrs.GEX = {
    label: "GEX",
    opts: settings.defaultOptions,
    order: 18
};

amagerAttrs.GIDDY = {
    label: "GIDDY",
    opts: settings.defaultOptions,
    order: 19
};

amagerAttrs.Interaktionsstruktur = {
    label: "Interaktionsstruktur",
    opts: settings.defaultOptions,
    order: 20
};

amagerAttrs.Aktivitetstype = {
    label: "Aktivitetstype",
    opts: settings.defaultOptions,
    order: 21
};

amagerAttrs.Udsigelse = {
    label: "Udsigelse",
    opts: settings.defaultOptions,
    order: 22
};

amagerAttrs.Genre = {
    label: "Genre",
    opts: settings.defaultOptions,
    order: 23
};

amagerAttrs.Samtaletype = {
    label: "Samtaletype",
    opts: settings.defaultOptions,
    order: 24
};

amagerAttrs.Makrosproghandling = {
    label: "Makro-sproghandling",
    opts: settings.defaultOptions,
    order: 25
};

amagerAttrs.IIV_SMU_kommentarer = {
    label: "IIV_SMU_kommentarer",
    opts: settings.defaultOptions,
    order: 26
};

amagerAttrs.IIV_AIG_kommentarer = {
    label: "IIV_AIG_kommentarer",
    opts: settings.defaultOptions,
    order: 27
};

amagerAttrs.global_events = {
    label: "global_events",
    opts: settings.defaultOptions,
    order: 28
};

amagerAttrs.turn = {
    label: "turn",
    opts: settings.defaultOptions,
    order: 29
};

amagerAttrs.sync = {
    label: "sync",
    opts: settings.defaultOptions,
    order: 30
};

amagerAttrs.semvar = {
    label: "semvar",
    opts: settings.defaultOptions,
    order: 31
};

/* NB: æ'et var åbenbart et problem for Korp. */
amagerAttrs.epistsaetn = {
    label: "epistsætn",
    opts: settings.defaultOptions,
    order: 32
};

amagerAttrs.AUX = {
    label: "AUX",
    opts: settings.defaultOptions,
    order: 33
};


var bornholmAttrs = {};

bornholmAttrs.xmin = {
    label: "xmin",
    opts: settings.defaultOptions,
    order: 1
};
bornholmAttrs.xmax = {
    label: "xmax",
    opts: settings.defaultOptions,
    order: 2
};
bornholmAttrs.Comments = {
    label: "Comments",
    opts: settings.defaultOptions,
    order: 3
};
bornholmAttrs.events = {
    label: "events",
    opts: settings.defaultOptions,
    order: 4
};
bornholmAttrs.phonetic = {
    label: "phonetic",
    opts: settings.defaultOptions,
    order: 5
};
bornholmAttrs.uncertain_transcription = {
    label: "uncertain_transcription",
    opts: settings.defaultOptions,
    order: 6
};
bornholmAttrs.IPA = {
    label: "IPA",
    opts: settings.defaultOptions,
    order: 7
};
bornholmAttrs.PoS = {
    label: "PoS",
    opts: settings.defaultOptions,
    order: 8
};
bornholmAttrs.RedPoS = {
    label: "RedPoS",
    opts: settings.defaultOptions,
    order: 9
};
bornholmAttrs.TtT = {
    label: "TtT",
    opts: settings.defaultOptions,
    order: 10
};
bornholmAttrs.turn = {
    label: "turn",
    opts: settings.defaultOptions,
    order: 11
};
bornholmAttrs.sync = {
    label: "sync",
    opts: settings.defaultOptions,
    order: 12
};
bornholmAttrs.speaker = {
    label: "speaker",
    opts: settings.defaultOptions,
    order: 13
};
bornholmAttrs.xlength = {
    label: "xlength",
    opts: settings.defaultOptions,
    order: 14
};
bornholmAttrs.tur = {
    label: "tur",
    opts: settings.defaultOptions,
    order: 15
};
bornholmAttrs.segment = {
    label: "segment",
    opts: settings.defaultOptions,
    order: 16
};
bornholmAttrs.filename = {
    label: "filename",
    opts: settings.defaultOptions,
    order: 17
};




var koegeAttrs = {};

koegeAttrs.xmin = {
    label: "xmin",
    opts: settings.defaultOptions,
    order: 1
};
koegeAttrs.xmax = {
    label: "xmax",
    opts: settings.defaultOptions,
    order: 2
};
koegeAttrs.phonetic = {
    label: "phonetic",
    opts: settings.defaultOptions,
    order: 3
};
koegeAttrs.events = {
    label: "events",
    opts: settings.defaultOptions,
    order: 4
};
koegeAttrs.Comments = {
    label: "Comments",
    opts: settings.defaultOptions,
    order: 5
};
koegeAttrs.grammatik = {
    label: "grammatik",
    opts: settings.defaultOptions,
    order: 6
};
koegeAttrs.IPA = {
    label: "IPA",
    opts: settings.defaultOptions,
    order: 7
};
koegeAttrs.PoS = {
    label: "PoS",
    opts: settings.defaultOptions,
    order: 8
};
koegeAttrs.RedPoS = {
    label: "RedPoS",
    opts: settings.defaultOptions,
    order: 9
};
koegeAttrs.TtT = {
    label: "TtT",
    opts: settings.defaultOptions,
    order: 10
};
koegeAttrs.IIV_Kommentarer = {
    label: "IIV_Kommentarer",
    opts: settings.defaultOptions,
    order: 11
};
koegeAttrs.Genre = {
    label: "Genre",
    opts: settings.defaultOptions,
    order: 12
};
koegeAttrs.Aktivitetstype = {
    label: "Aktivitetstype",
    opts: settings.defaultOptions,
    order: 13
};
koegeAttrs.Interaktionsstruktur = {
    label: "Interaktionsstruktur",
    opts: settings.defaultOptions,
    order: 14
};
koegeAttrs.Udsigelse = {
    label: "Udsigelse",
    opts: settings.defaultOptions,
    order: 15
};
koegeAttrs.Samtaletype = {
    label: "Samtaletype",
    opts: settings.defaultOptions,
    order: 16
};
koegeAttrs.Makrosproghandling = {
    label: "Makro-sproghandling",
    opts: settings.defaultOptions,
    order: 17
};
koegeAttrs.speaker = {
    label: "speaker",
    opts: settings.defaultOptions,
    order: 18
};
koegeAttrs.emphasis = {
    label: "emphasis",
    opts: settings.defaultOptions,
    order: 19
};
koegeAttrs.variant_fonetik = {
    label: "variant_fonetik",
    opts: settings.defaultOptions,
    order: 20
};
koegeAttrs.variant_fonetik_kontekst_realiseret = {
    label: "variant_fonetik_kontekst_realiseret",
    opts: settings.defaultOptions,
    order: 21
};
koegeAttrs.variant_fonetik_kontekst_forventet = {
    label: "variant_fonetik_kontekst_forventet",
    opts: settings.defaultOptions,
    order: 22
};
koegeAttrs.variant_fonetik_R = {
    label: "variant_fonetik_R",
    opts: settings.defaultOptions,
    order: 23
};
koegeAttrs.ledsaet = {
    label: "ledsaet",
    opts: settings.defaultOptions,
    order: 24
};
koegeAttrs.attabekspl = {
    label: "at-tab-ekspl",
    opts: settings.defaultOptions,
    order: 25
};
koegeAttrs.attabeksplkomm = {
    label: "at-tab-ekspl-komm",
    opts: settings.defaultOptions,
    order: 26
};
koegeAttrs.KL = {
    label: "KL",
    opts: settings.defaultOptions,
    order: 27
};
koegeAttrs.xlength = {
    label: "xlength",
    opts: settings.defaultOptions,
    order: 28
};
koegeAttrs.tur = {
    label: "tur",
    opts: settings.defaultOptions,
    order: 29
};
koegeAttrs.segment = {
    label: "segment",
    opts: settings.defaultOptions,
    order: 30
};
koegeAttrs.filename = {
    label: "filename",
    opts: settings.defaultOptions,
    order: 31
};
koegeAttrs.Leksis_og_fraser = {
    label: "Leksis_og_fraser",
    opts: settings.defaultOptions,
    order: 32
};
koegeAttrs.uncertain_transcription = {
    label: "uncertain_transcription",
    opts: settings.defaultOptions,
    order: 33
};
koegeAttrs.TRDK = {
    label: "TR-DK",
    opts: settings.defaultOptions,
    order: 34
};



/*


$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

 /*
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
*/

settings.corpora.lanchart_amager = {
    id : "lanchart_amager",
    title : "LANCHART Amager...",
    description : "LANCHART-korpusset in spe -- Amager-filerne ...",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : amagerAttrs, //modernAttrs,
    structAttributes : {
        turn_taler : {label : "taler"},
        text_xmin : {label : "text-xmin"},
        text_xmax : {label : "text-xmax"},
        text_size : {label : "text-size"},
        text_filename : {label : "text-filename"},
        turn_taler : {label : "turn-taler"},
        turn_xmin : {label : "turn-xmin"},
        turn_xmax : {label : "turn-xmax"},
        turn_xlength : {label : "turn-xlength"},
        segment_xmin : {label : "segment-xmin"},
        segment_xmax : {label : "segment-xmax"},
        segment_xlength : {label : "segment-xlength"}
    }
};


settings.corpora.lanchart_bornholm = {
    id : "lanchart_bornholm",
    title : "LANCHART Bornholm ...",
    description : "LANCHART-korpusset in spe -- Bornholm-filerne ...",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : bornholmAttrs, //modernAttrs,
    structAttributes : {
        turn_taler : {label : "taler"},
        text_xmin : {label : "text-xmin"},
        text_xmax : {label : "text-xmax"},
        text_size : {label : "text-size"},
        text_filename : {label : "text-filename"},
        turn_taler : {label : "turn-taler"},
        turn_xmin : {label : "turn-xmin"},
        turn_xmax : {label : "turn-xmax"},
        turn_xlength : {label : "turn-xlength"},
        segment_xmin : {label : "segment-xmin"},
        segment_xmax : {label : "segment-xmax"},
        segment_xlength : {label : "segment-xlength"}
    }
};


settings.corpora.lanchart_koege = {
    id : "lanchart_koege",
    title : "LANCHART Køge ...",
    description : "LANCHART-korpusset in spe -- Køge-filerne ...",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : koegeAttrs, //modernAttrs,
    structAttributes : {
        turn_taler : {label : "taler"},
        text_xmin : {label : "text-xmin"},
        text_xmax : {label : "text-xmax"},
        text_size : {label : "text-size"},
        text_filename : {label : "text-filename"},
        turn_taler : {label : "turn-taler"},
        turn_xmin : {label : "turn-xmin"},
        turn_xmax : {label : "turn-xmax"},
        turn_xlength : {label : "turn-xlength"},
        segment_xmin : {label : "segment-xmin"},
        segment_xmax : {label : "segment-xmax"},
        segment_xlength : {label : "segment-xlength"}
    }
};



settings.corpusListing = new CorpusListing(settings.corpora);