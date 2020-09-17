settings.primaryColor = "#ccdaec";
settings.primaryLight = "#d9e9fd";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ['lanchart_amager'];

settings.corporafolders.lanchart = {
    title : "LANCHART-korpusset",
    contents : ['lanchart_amager', 'lanchart_bornholm', 'lanchart_koege'],
    description : "LANCHART-korpusset, delt op efter projekt."
};


var lanchart_Aktivitetstype = { label: "Aktivitetstype",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_AUX = { label: "AUX",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Comments = { label: "Comments",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_epistsxtn = { label: "epistsxtn",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_events = { label: "events",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_filename = { label: "filename",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_generisk = { label: "generisk",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Genre = { label: "Genre",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_GEX = { label: "GEX",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_GIDDY = { label: "GIDDY",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_global_events = { label: "global_events",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_gramma_II = { label: "gramma_II",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_grammatik = { label: "grammatik",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_IIV_AIG_kommentarer = { label: "IIV_AIG_kommentarer",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_IIV_SMU_kommentarer = { label: "IIV_SMU_kommentarer",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Interaktionsstruktur = { label: "Interaktionsstruktur",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_IPA = { label: "IPA",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Makrosproghandling = { label: "Makrosproghandling",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_phonetic = { label: "phonetic",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_PoS = { label: "PoS",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_RedPoS = { label: "RedPoS",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Samtaletype = { label: "Samtaletype",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_semvar = { label: "semvar",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_speaker = { label: "speaker",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_sync = { label: "sync",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_TRDK = { label: "TRDK",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_TtT = { label: "TtT",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_turn = { label: "turn",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_turns = { label: "turns",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_Udsigelse = { label: "Udsigelse",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_uncertain_transcription = { label: "uncertain_transcription",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_xlength = { label: "xlength",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_xmax = { label: "xmax",
    opts: settings.defaultOptions,
    order: 100 };
var lanchart_xmin = { label: "xmin",
    opts: settings.defaultOptions,
    order: 100 };

settings.corpora.lanchart_amager = {
    id : "lanchart_amager",
    title : "Amager",
    description : "Korpus af udskrifterne fra Amager-projektet.",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : {
        xmin : lanchart_xmin,
            xmax : lanchart_xmax,
            events : lanchart_events,
            phonetic : lanchart_phonetic,
            uncertain_transcription : lanchart_uncertain_transcription,
            Comments : lanchart_Comments,
            grammatik : lanchart_grammatik,
            generisk : lanchart_generisk,
            gramma_II : lanchart_gramma_II,
            IPA : lanchart_IPA,
            PoS : lanchart_PoS,
            RedPoS : lanchart_RedPoS,
            TtT : lanchart_TtT,
            GEX : lanchart_GEX,
            GIDDY : lanchart_GIDDY,
            turns : lanchart_turns,
            Udsigelse : lanchart_Udsigelse,
            Samtaletype : lanchart_Samtaletype,
            IIV_AIG_kommentarer : lanchart_IIV_AIG_kommentarer,
            Interaktionsstruktur : lanchart_Interaktionsstruktur,
            Makrosproghandling : lanchart_Makrosproghandling,
            IIV_SMU_kommentarer : lanchart_IIV_SMU_kommentarer,
            Aktivitetstype : lanchart_Aktivitetstype,
            Genre : lanchart_Genre,
            speaker : lanchart_speaker,
            xlength : lanchart_xlength,
            filename : lanchart_filename,
            global_events : lanchart_global_events,
            sync : lanchart_sync,
            turn : lanchart_turn,
            semvar : lanchart_semvar,
            epistsxtn : lanchart_epistsxtn,
            AUX : lanchart_AUX
    },
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





settings.corpora.lanchart_bornholm = {
    id : "lanchart_bornholm",
    title : "Bornholm",
    description : "Korpus af udskrifterne fra Bornholm-projektet.",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : {
        xmin : lanchart_xmin,
            xmax : lanchart_xmax,
            Comments : lanchart_Comments,
            events : lanchart_events,
            phonetic : lanchart_phonetic,
            uncertain_transcription : lanchart_uncertain_transcription,
            IPA : lanchart_IPA,
            PoS : lanchart_PoS,
            RedPoS : lanchart_RedPoS,
            TtT : lanchart_TtT,
            turns : lanchart_turns,
            sync : lanchart_sync,
            turn : lanchart_turn,
            speaker : lanchart_speaker,
            xlength : lanchart_xlength,
            filename : lanchart_filename
    },
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





settings.corpora.lanchart_koege = {
    id : "lanchart_koege",
    title : "Køge",
    description : "Korpus af udskrifterne fra Køge-projektet.",
    within : {"turn": "turn"}, //defaultWithin,
    context : {"1 turn": "1 turn"}, //defaultContext,
    attributes : {
        xmin : lanchart_xmin,
            xmax : lanchart_xmax,
            Comments : lanchart_Comments,
            phonetic : lanchart_phonetic,
            uncertain_transcription : lanchart_uncertain_transcription,
            turns : lanchart_turns,
            speaker : lanchart_speaker,
            TRDK : lanchart_TRDK,
            xlength : lanchart_xlength,
            filename : lanchart_filename,
            events : lanchart_events,
            IPA : lanchart_IPA,
            PoS : lanchart_PoS,
            RedPoS : lanchart_RedPoS,
            TtT : lanchart_TtT
    },
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