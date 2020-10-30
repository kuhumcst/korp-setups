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


var lanchart_amagerAttrs = {};

lanchart_amagerAttrs.xmin = {
        label: "xmin",
        opts: settings.defaultOptions,
        order: 0 };
lanchart_amagerAttrs.xmax = {
        label: "xmax",
        opts: settings.defaultOptions,
        order: 1 };
lanchart_amagerAttrs.phonetic = {
        label: "phonetic",
        opts: settings.defaultOptions,
        order: 2 };
lanchart_amagerAttrs.uncertain_transcription = {
        label: "uncertain_transcription",
        opts: settings.defaultOptions,
        order: 3 };
lanchart_amagerAttrs.IPA = {
        label: "IPA",
        opts: settings.defaultOptions,
        order: 4 };
lanchart_amagerAttrs.PoS = {
        label: "PoS",
        opts: settings.defaultOptions,
        order: 5 };
lanchart_amagerAttrs.RedPoS = {
        label: "RedPoS",
        opts: settings.defaultOptions,
        order: 6 };
lanchart_amagerAttrs.TtT = {
        label: "TtT",
        opts: settings.defaultOptions,
        order: 7 };
lanchart_amagerAttrs.turns = {
        label: "turns",
        opts: settings.defaultOptions,
        order: 8 };
lanchart_amagerAttrs.speaker = {
        label: "speaker",
        opts: settings.defaultOptions,
        order: 9 };
lanchart_amagerAttrs.Comments = {
        label: "Comments",
        opts: settings.defaultOptions,
        order: 10 };
lanchart_amagerAttrs.events = {
        label: "events",
        opts: settings.defaultOptions,
        order: 11 };
lanchart_amagerAttrs.xlength = {
        label: "xlength",
        opts: settings.defaultOptions,
        order: 12 };
lanchart_amagerAttrs.filename = {
        label: "filename",
        opts: settings.defaultOptions,
        order: 13 };
lanchart_amagerAttrs.grammatik = {
        label: "grammatik",
        opts: settings.defaultOptions,
        order: 14 };
lanchart_amagerAttrs.gramma_II = {
        label: "gramma_II",
        opts: settings.defaultOptions,
        order: 15 };
lanchart_amagerAttrs.generisk = {
        label: "generisk",
        opts: settings.defaultOptions,
        order: 16 };
lanchart_amagerAttrs.GEX = {
        label: "GEX",
        opts: settings.defaultOptions,
        order: 17 };
lanchart_amagerAttrs.GIDDY = {
        label: "GIDDY",
        opts: settings.defaultOptions,
        order: 18 };
lanchart_amagerAttrs.Interaktionsstruktur = {
        label: "Interaktionsstruktur",
        opts: settings.defaultOptions,
        order: 19 };
lanchart_amagerAttrs.Udsigelse = {
        label: "Udsigelse",
        opts: settings.defaultOptions,
        order: 20 };
lanchart_amagerAttrs.Genre = {
        label: "Genre",
        opts: settings.defaultOptions,
        order: 21 };
lanchart_amagerAttrs.Aktivitetstype = {
        label: "Aktivitetstype",
        opts: settings.defaultOptions,
        order: 22 };
lanchart_amagerAttrs.Samtaletype = {
        label: "Samtaletype",
        opts: settings.defaultOptions,
        order: 23 };
lanchart_amagerAttrs.Makrosproghandling = {
        label: "Makrosproghandling",
        opts: settings.defaultOptions,
        order: 24 };
lanchart_amagerAttrs.IIV_SMU_kommentarer = {
        label: "IIV_SMU_kommentarer",
        opts: settings.defaultOptions,
        order: 25 };
lanchart_amagerAttrs.IIV_AIG_kommentarer = {
        label: "IIV_AIG_kommentarer",
        opts: settings.defaultOptions,
        order: 26 };
lanchart_amagerAttrs.global_events = {
        label: "global_events",
        opts: settings.defaultOptions,
        order: 27 };
lanchart_amagerAttrs.sync = {
        label: "sync",
        opts: settings.defaultOptions,
        order: 28 };
lanchart_amagerAttrs.turn = {
        label: "turn",
        opts: settings.defaultOptions,
        order: 29 };
lanchart_amagerAttrs.semvar = {
        label: "semvar",
        opts: settings.defaultOptions,
        order: 30 };
lanchart_amagerAttrs.epiststn = {
        label: "epiststn",
        opts: settings.defaultOptions,
        order: 31 };
lanchart_amagerAttrs.AUX = {
        label: "AUX",
        opts: settings.defaultOptions,
        order: 32 };
settings.corpora.lanchart_amager = {
        id : "lanchart_amager",
        title : "LANCHART lanchart_amager ...",
        description : "LANCHART-korpusset in spe -- lanchart_amager-filerne ...",
        within : {"turn": "turn"}, //defaultWithin,
        context : {"1 turn": "1 turn"}, //defaultContext,
        attributes : lanchart_amagerAttrs, //modernAttrs,
        structAttributes : {
            corpus_label : {label : "corpuslabel"},
            text_xmin : {label : "text-xmin"},
            text_xmax : {label : "text-xmax"},
            text_xlength : {label : "text-xlength"},
            text_size : {label : "text-size"},
            text_filename : {label : "text-filename"},
            turn_xmin : {label : "turn-xmin"},
            turn_xmax : {label : "turn-xmax"},
            turn_xlength : {label : "turn-xlength"},
            turn_speaker : {label : "turn-speaker"},
        }
        };



var lanchart_bornholmAttrs = {};

lanchart_bornholmAttrs.xmin = {
        label: "xmin",
        opts: settings.defaultOptions,
        order: 0 };
lanchart_bornholmAttrs.xmax = {
        label: "xmax",
        opts: settings.defaultOptions,
        order: 1 };
lanchart_bornholmAttrs.Comments = {
        label: "Comments",
        opts: settings.defaultOptions,
        order: 2 };
lanchart_bornholmAttrs.events = {
        label: "events",
        opts: settings.defaultOptions,
        order: 3 };
lanchart_bornholmAttrs.phonetic = {
        label: "phonetic",
        opts: settings.defaultOptions,
        order: 4 };
lanchart_bornholmAttrs.uncertain_transcription = {
        label: "uncertain_transcription",
        opts: settings.defaultOptions,
        order: 5 };
lanchart_bornholmAttrs.IPA = {
        label: "IPA",
        opts: settings.defaultOptions,
        order: 6 };
lanchart_bornholmAttrs.PoS = {
        label: "PoS",
        opts: settings.defaultOptions,
        order: 7 };
lanchart_bornholmAttrs.RedPoS = {
        label: "RedPoS",
        opts: settings.defaultOptions,
        order: 8 };
lanchart_bornholmAttrs.TtT = {
        label: "TtT",
        opts: settings.defaultOptions,
        order: 9 };
lanchart_bornholmAttrs.turns = {
        label: "turns",
        opts: settings.defaultOptions,
        order: 10 };
lanchart_bornholmAttrs.sync = {
        label: "sync",
        opts: settings.defaultOptions,
        order: 11 };
lanchart_bornholmAttrs.turn = {
        label: "turn",
        opts: settings.defaultOptions,
        order: 12 };
lanchart_bornholmAttrs.speaker = {
        label: "speaker",
        opts: settings.defaultOptions,
        order: 13 };
lanchart_bornholmAttrs.xlength = {
        label: "xlength",
        opts: settings.defaultOptions,
        order: 14 };
lanchart_bornholmAttrs.filename = {
        label: "filename",
        opts: settings.defaultOptions,
        order: 15 };
settings.corpora.lanchart_bornholm = {
        id : "lanchart_bornholm",
        title : "LANCHART lanchart_bornholm ...",
        description : "LANCHART-korpusset in spe -- lanchart_bornholm-filerne ...",
        within : {"turn": "turn"}, //defaultWithin,
        context : {"1 turn": "1 turn"}, //defaultContext,
        attributes : lanchart_bornholmAttrs, //modernAttrs,
        structAttributes : {
            corpus_label : {label : "corpuslabel"},
            text_xmin : {label : "text-xmin"},
            text_xmax : {label : "text-xmax"},
            text_xlength : {label : "text-xlength"},
            text_size : {label : "text-size"},
            text_filename : {label : "text-filename"},
            turn_xmin : {label : "turn-xmin"},
            turn_xmax : {label : "turn-xmax"},
            turn_xlength : {label : "turn-xlength"},
            turn_speaker : {label : "turn-speaker"},
        }
        };



var lanchart_koegeAttrs = {};

lanchart_koegeAttrs.xmin = {
        label: "xmin",
        opts: settings.defaultOptions,
        order: 0 };
lanchart_koegeAttrs.xmax = {
        label: "xmax",
        opts: settings.defaultOptions,
        order: 1 };
lanchart_koegeAttrs.phonetic = {
        label: "phonetic",
        opts: settings.defaultOptions,
        order: 2 };
lanchart_koegeAttrs.IPA = {
        label: "IPA",
        opts: settings.defaultOptions,
        order: 3 };
lanchart_koegeAttrs.PoS = {
        label: "PoS",
        opts: settings.defaultOptions,
        order: 4 };
lanchart_koegeAttrs.RedPoS = {
        label: "RedPoS",
        opts: settings.defaultOptions,
        order: 5 };
lanchart_koegeAttrs.TtT = {
        label: "TtT",
        opts: settings.defaultOptions,
        order: 6 };
lanchart_koegeAttrs.turns = {
        label: "turns",
        opts: settings.defaultOptions,
        order: 7 };
lanchart_koegeAttrs.speaker = {
        label: "speaker",
        opts: settings.defaultOptions,
        order: 8 };
lanchart_koegeAttrs.events = {
        label: "events",
        opts: settings.defaultOptions,
        order: 9 };
lanchart_koegeAttrs.uncertain_transcription = {
        label: "uncertain_transcription",
        opts: settings.defaultOptions,
        order: 10 };
lanchart_koegeAttrs.xlength = {
        label: "xlength",
        opts: settings.defaultOptions,
        order: 11 };
lanchart_koegeAttrs.filename = {
        label: "filename",
        opts: settings.defaultOptions,
        order: 12 };
lanchart_koegeAttrs.Comments = {
        label: "Comments",
        opts: settings.defaultOptions,
        order: 13 };
lanchart_koegeAttrs.TRDK = {
        label: "TRDK",
        opts: settings.defaultOptions,
        order: 14 };
settings.corpora.lanchart_koege = {
        id : "lanchart_koege",
        title : "LANCHART lanchart_koege ...",
        description : "LANCHART-korpusset in spe -- lanchart_koege-filerne ...",
        within : {"turn": "turn"}, //defaultWithin,
        context : {"1 turn": "1 turn"}, //defaultContext,
        attributes : lanchart_koegeAttrs, //modernAttrs,
        structAttributes : {
            corpus_label : {label : "corpuslabel"},
            text_xmin : {label : "text-xmin"},
            text_xmax : {label : "text-xmax"},
            text_xlength : {label : "text-xlength"},
            text_size : {label : "text-size"},
            text_filename : {label : "text-filename"},
            turn_xmin : {label : "turn-xmin"},
            turn_xmax : {label : "turn-xmax"},
            turn_xlength : {label : "turn-xlength"},
            turn_speaker : {label : "turn-speaker"},
        }
        };


settings.corpusListing = new CorpusListing(settings.corpora);