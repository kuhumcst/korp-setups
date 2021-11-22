settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_pontoppidan_isbjoernen_1887",
"memo_pontoppidan_mimoser_1886",
"memo_pontoppidan_sandingemenighed_1883",
"memo_pontoppidan_staekkedevinger_1881"];

settings.corporafolders.memotestauthornovels = {
    title : "MEMO test, individuelle romaner af udvalgte forfattere",
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud."
};


settings.corporafolders.memotestauthornovels.pontoppidan = {
    title : "MEMO test, romaner af Pontoppidan",
    contents : ["memo_pontoppidan_isbjoernen_1887",
"memo_pontoppidan_mimoser_1886",
"memo_pontoppidan_sandingemenighed_1883",
"memo_pontoppidan_staekkedevinger_1881"],
    description : "Romaner af Pontoppidan."
};




settings.corporafolders.memotestauthornovels.hermanbang = {
    title : "MEMO test, romaner af Herman Bang",
    contents : ["memo_bangh_faedra_1883",
"memo_bangh_praester_1883",
"memo_bangh_stilleeksistenser_1886",
"memo_bangh_stuk_1887",
"memo_bangh_tine_1889"],
    description : "Romaner af Herman Bang."
};
/*
 * Positional attributes for test corpus.
 */

var memocorpAttrs = {};  

memocorpAttrs.pos = {
    label : "pos",
    dataset : {
"pron" : "pron",
"sb" : "sb",
"v" : "v",
"adv" : "adv",
"ZD" : "ZD",
"præp" : "præp",
"adj" : "adj",
"konj" : "konj",
"ZP" : "ZP",
"propr" : "propr",
"præt" : "præt",
"ATI" : "ATI",
"XF" : "XF",
"ZI" : "ZI",
"num" : "num",
"part" : "part",
"ZQ" : "ZQ",
"ubestpron" : "ubestpron",
"interj" : "interj",
"ZH" : "ZH",
"ENDING" : "ENDING",
"ZA" : "ZA",
"XS" : "XS",
"LEXICAL" : "LEXICAL",
"ZS" : "ZS",
"'" : "'",
"//" : "//",
"»" : "»"
    },
    opts : liteOptions,
    // Changed from selectType [sg]
    extendedComponent: "datasetSelect",
    escape: false
}


var memocorpAttrs = {
    pos : memocorpAttrs.pos,
    lemma : attrs.baseform
};

$("#lemgram_list_item").remove();


/*
 * CORPORA
 */



settings.corpora.memo_bangh_faedra_1883 = {
    id : "memo_bangh_faedra_1883",
    title : "BangH: Faedra (1883)",
    description : "Romanen Faedra af BangH fra 1883.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};


settings.corpora.memo_bangh_praester_1883 = {
    id : "memo_bangh_praester_1883",
    title : "BangH: Praester (1883)",
    description : "Romanen Praester af BangH fra 1883.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_bangh_stilleeksistenser_1886 = {
    id : "memo_bangh_stilleeksistenser_1886",
    title : "BangH: StilleEksistenser (1886)",
    description : "Romanen StilleEksistenser af BangH fra 1886.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};


settings.corpora.memo_bangh_stuk_1887 = {
    id : "memo_bangh_stuk_1887",
    title : "BangH: Stuk (1887)",
    description : "Romanen Stuk af BangH fra 1887.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};


settings.corpora.memo_bangh_tine_1889 = {
    id : "memo_bangh_tine_1889",
    title : "BangH: Tine (1889)",
    description : "Romanen Tine af BangH fra 1889.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};



settings.corpora.memo_pontoppidan_staekkedevinger_1881 = {
    id : "memo_pontoppidan_staekkedevinger_1881",
    title : "Pontoppidan: StaekkedeVinger (1881)",
    description : "Romanen StaekkedeVinger af Pontoppidan fra 1881.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};


settings.corpora.memo_pontoppidan_sandingemenighed_1883 = {
    id : "memo_pontoppidan_sandingemenighed_1883",
    title : "Pontoppidan: SandingeMenighed (1883)",
    description : "Romanen SandingeMenighed af Pontoppidan fra 1883.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};

settings.corpora.memo_pontoppidan_mimoser_1886 = {
    id : "memo_pontoppidan_mimoser_1886",
    title : "Pontoppidan: Mimoser (1886)",
    description : "Romanen Mimoser af Pontoppidan fra 1886.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"},
        sentence_id : {label : "Sætning nr."}
    }
};




settings.corpora.memo_pontoppidan_isbjoernen_1887 = {
    id : "memo_pontoppidan_isbjoernen_1887",
    title : "Pontoppidan: Isbjoernen (1887)",
    description : "Romanen Isbjoernen af Pontoppidan fra 1887.",
    within : { "sentence": "sentence" },
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {
        text_title : {label : "Titel"},
        text_author : {label : "Forfatter"},
        text_pseudonym : {label : "Pseudonym"},
        text_date : {label : "Dato"},
        text_datefrom : {label : "Datofra"},
        text_dateto : {label : "Datotil"},
        text_timefrom : {label : "Tidfra"},
        text_timeto : {label : "Tidtil"},
        text_gender : {label : "Køn"},
        text_source : {label : "Kilde"},
        text_nationality : {label : "Nationalitet"},
        text_subtitle : {label : "Undertitel"},
        text_pages : {label : "Sider"},
        text_illustrations : {label : "Illustrationer"},
        text_typeface : {label : "Skriftsnit"},
        text_publisher : {label : "Udgiver"},
        text_price : {label : "Pris"}
    }
};


settings.corpusListing = new CorpusListing(settings.corpora);
