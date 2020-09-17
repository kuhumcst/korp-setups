settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_pontoppidan"];

settings.corporafolders.memotestauthors = {
    title : "MEMO test, romaner pr. forfatterskab", 
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud grupperet efter forfatter. De knap så produktive forfattere er slået sammen i ét korpus.",
    contents : ["memo_albertius",
"memo_andersenfo",
"memo_andersent",
"memo_bangh",
"memo_barner",
"memo_bergstroem",
"memo_bjoernsen",
"memo_boecker",
"memo_bondesen",
"memo_brosboell",
"memo_christensenm",
"memo_dodt",
"memo_ewaldhf",
"memo_fibiger",
"memo_gjellerup",
"memo_gjoerup",
"memo_gloeersen",
"memo_gnudtzmann",
"memo_gudmandhoeyer",
"memo_hambro",
"memo_hamsun",
"memo_hansenj",
"memo_jensenh",
"memo_jensenjv",
"memo_joergensenj",
"memo_juelhansen",
"memo_kieler",
"memo_knudsenj",
"memo_lorenzen",
"memo_madsenoghenriques",
"memo_meldgaard",
"memo_moellerc",
"memo_muusmann",
"memo_pontoppidan",
"memo_schandorph",
"memo_stuckenberg",
"memo_uproduktive"]
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


settings.corpora.memo_albertius = {
    id : "memo_albertius",
    title : "Albertius",
    description : "Romaner af Albertius.",
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


settings.corpora.memo_andersenfo = {
    id : "memo_andersenfo",
    title : "AndersenFO",
    description : "Romaner af AndersenFO.",
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


settings.corpora.memo_andersent = {
    id : "memo_andersent",
    title : "AndersenT",
    description : "Romaner af AndersenT.",
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


settings.corpora.memo_bangh = {
    id : "memo_bangh",
    title : "BangH",
    description : "Romaner af BangH.",
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


settings.corpora.memo_barner = {
    id : "memo_barner",
    title : "Barner",
    description : "Romaner af Barner.",
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


settings.corpora.memo_bergstroem = {
    id : "memo_bergstroem",
    title : "Bergstroem",
    description : "Romaner af Bergstroem.",
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


settings.corpora.memo_bjoernsen = {
    id : "memo_bjoernsen",
    title : "Bjoernsen",
    description : "Romaner af Bjoernsen.",
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


settings.corpora.memo_boecker = {
    id : "memo_boecker",
    title : "Boecker",
    description : "Romaner af Boecker.",
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


settings.corpora.memo_bondesen = {
    id : "memo_bondesen",
    title : "Bondesen",
    description : "Romaner af Bondesen.",
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


settings.corpora.memo_brosboell = {
    id : "memo_brosboell",
    title : "Brosboell",
    description : "Romaner af Brosboell.",
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


settings.corpora.memo_christensenm = {
    id : "memo_christensenm",
    title : "ChristensenM",
    description : "Romaner af ChristensenM.",
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


settings.corpora.memo_dodt = {
    id : "memo_dodt",
    title : "Dodt",
    description : "Romaner af Dodt.",
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


settings.corpora.memo_ewaldhf = {
    id : "memo_ewaldhf",
    title : "EwaldHF",
    description : "Romaner af EwaldHF.",
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


settings.corpora.memo_fibiger = {
    id : "memo_fibiger",
    title : "Fibiger",
    description : "Romaner af Fibiger.",
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


settings.corpora.memo_gjellerup = {
    id : "memo_gjellerup",
    title : "Gjellerup",
    description : "Romaner af Gjellerup.",
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


settings.corpora.memo_gjoerup = {
    id : "memo_gjoerup",
    title : "Gjoerup",
    description : "Romaner af Gjoerup.",
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


settings.corpora.memo_gloeersen = {
    id : "memo_gloeersen",
    title : "Gloeersen",
    description : "Romaner af Gloeersen.",
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


settings.corpora.memo_gnudtzmann = {
    id : "memo_gnudtzmann",
    title : "Gnudtzmann",
    description : "Romaner af Gnudtzmann.",
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


settings.corpora.memo_gudmandhoeyer = {
    id : "memo_gudmandhoeyer",
    title : "GudmandHoeyer",
    description : "Romaner af GudmandHoeyer.",
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


settings.corpora.memo_hambro = {
    id : "memo_hambro",
    title : "Hambro",
    description : "Romaner af Hambro.",
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


settings.corpora.memo_hamsun = {
    id : "memo_hamsun",
    title : "Hamsun",
    description : "Romaner af Hamsun.",
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


settings.corpora.memo_hansenj = {
    id : "memo_hansenj",
    title : "HansenJ",
    description : "Romaner af HansenJ.",
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


settings.corpora.memo_jensenh = {
    id : "memo_jensenh",
    title : "JensenH",
    description : "Romaner af JensenH.",
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


settings.corpora.memo_jensenjv = {
    id : "memo_jensenjv",
    title : "JensenJV",
    description : "Romaner af JensenJV.",
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


settings.corpora.memo_joergensenj = {
    id : "memo_joergensenj",
    title : "JoergensenJ",
    description : "Romaner af JoergensenJ.",
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


settings.corpora.memo_juelhansen = {
    id : "memo_juelhansen",
    title : "JuelHansen",
    description : "Romaner af JuelHansen.",
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


settings.corpora.memo_kieler = {
    id : "memo_kieler",
    title : "Kieler",
    description : "Romaner af Kieler.",
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


settings.corpora.memo_knudsenj = {
    id : "memo_knudsenj",
    title : "KnudsenJ",
    description : "Romaner af KnudsenJ.",
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


settings.corpora.memo_lorenzen = {
    id : "memo_lorenzen",
    title : "Lorenzen",
    description : "Romaner af Lorenzen.",
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


settings.corpora.memo_madsenoghenriques = {
    id : "memo_madsenoghenriques",
    title : "MadsenOgHenriques",
    description : "Romaner af MadsenOgHenriques.",
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


settings.corpora.memo_meldgaard = {
    id : "memo_meldgaard",
    title : "Meldgaard",
    description : "Romaner af Meldgaard.",
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


settings.corpora.memo_moellerc = {
    id : "memo_moellerc",
    title : "MoellerC",
    description : "Romaner af MoellerC.",
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


settings.corpora.memo_muusmann = {
    id : "memo_muusmann",
    title : "Muusmann",
    description : "Romaner af Muusmann.",
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


settings.corpora.memo_pontoppidan = {
    id : "memo_pontoppidan",
    title : "Pontoppidan",
    description : "Romaner af Pontoppidan.",
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


settings.corpora.memo_schandorph = {
    id : "memo_schandorph",
    title : "Schandorph",
    description : "Romaner af Schandorph.",
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


settings.corpora.memo_stuckenberg = {
    id : "memo_stuckenberg",
    title : "Stuckenberg",
    description : "Romaner af Stuckenberg.",
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


settings.corpora.memo_uproduktive = {
    id : "memo_uproduktive",
    title : "uproduktive",
    description : "Romaner af uproduktive.",
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
