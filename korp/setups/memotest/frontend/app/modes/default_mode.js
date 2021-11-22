settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_1870",
"memo_1871"];

settings.corporafolders.memotestdecades = {
    title : "MeMo test, romaner pr. tiår", 
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud grupperet efter tiår.",
};

settings.corporafolders.memotestdecades.memo1870ies = {
    title : "MeMo test, romaner fra 1870'erne",
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud.",
    contents : ["memo_1870",
"memo_1871",
"memo_1872",
"memo_1873",
"memo_1874",
"memo_1875",
"memo_1876",
"memo_1877",
"memo_1878",
"memo_1879"]
};

settings.corporafolders.memotestdecades.memo1880ies = {
    title : "MeMo test, romaner fra 1880'erne",
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud.",
    contents : ["memo_1880",
"memo_1881",
"memo_1882",
"memo_1883",
"memo_1884",
"memo_1885",
"memo_1886",
"memo_1887",
"memo_1888",
"memo_1889"]
};

settings.corporafolders.memotestdecades.memo1890ies = {
    title : "MeMo test, romaner fra 1890'erne",
    description : "Testkorpusser fra Measuring Modernity-projektet: Samtlige romaner fra Det Moderne Gennembrud.",
    contents : ["memo_1890",
"memo_1891",
"memo_1892",
"memo_1893",
"memo_1894",
"memo_1895",
"memo_1896",
"memo_1897",
"memo_1898",
"memo_1899"]
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
};


var memocorpAttrs = {
    pos : memocorpAttrs.pos,
    lemma : attrs.baseform
};

$("#lemgram_list_item").remove();


/*
 * CORPORA
 */



settings.corpora.memo_1870 = {
    id : "memo_1870",
    title : "MeMo 1870)",
    description : "Romaner fra 1870.",
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


settings.corpora.memo_1871 = {
    id : "memo_1871",
    title : "MeMo 1871)",
    description : "Romaner fra 1871.",
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


settings.corpora.memo_1872 = {
    id : "memo_1872",
    title : "MeMo 1872)",
    description : "Romaner fra 1872.",
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


settings.corpora.memo_1873 = {
    id : "memo_1873",
    title : "MeMo 1873)",
    description : "Romaner fra 1873.",
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


settings.corpora.memo_1874 = {
    id : "memo_1874",
    title : "MeMo 1874)",
    description : "Romaner fra 1874.",
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


settings.corpora.memo_1875 = {
    id : "memo_1875",
    title : "MeMo 1875)",
    description : "Romaner fra 1875.",
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


settings.corpora.memo_1876 = {
    id : "memo_1876",
    title : "MeMo 1876)",
    description : "Romaner fra 1876.",
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


settings.corpora.memo_1877 = {
    id : "memo_1877",
    title : "MeMo 1877)",
    description : "Romaner fra 1877.",
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


settings.corpora.memo_1878 = {
    id : "memo_1878",
    title : "MeMo 1878)",
    description : "Romaner fra 1878.",
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


settings.corpora.memo_1879 = {
    id : "memo_1879",
    title : "MeMo 1879)",
    description : "Romaner fra 1879.",
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


settings.corpora.memo_1880 = {
    id : "memo_1880",
    title : "MeMo 1880)",
    description : "Romaner fra 1880.",
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


settings.corpora.memo_1881 = {
    id : "memo_1881",
    title : "MeMo 1881)",
    description : "Romaner fra 1881.",
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


settings.corpora.memo_1882 = {
    id : "memo_1882",
    title : "MeMo 1882)",
    description : "Romaner fra 1882.",
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


settings.corpora.memo_1883 = {
    id : "memo_1883",
    title : "MeMo 1883)",
    description : "Romaner fra 1883.",
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


settings.corpora.memo_1884 = {
    id : "memo_1884",
    title : "MeMo 1884)",
    description : "Romaner fra 1884.",
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


settings.corpora.memo_1885 = {
    id : "memo_1885",
    title : "MeMo 1885)",
    description : "Romaner fra 1885.",
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


settings.corpora.memo_1886 = {
    id : "memo_1886",
    title : "MeMo 1886)",
    description : "Romaner fra 1886.",
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


settings.corpora.memo_1887 = {
    id : "memo_1887",
    title : "MeMo 1887)",
    description : "Romaner fra 1887.",
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


settings.corpora.memo_1888 = {
    id : "memo_1888",
    title : "MeMo 1888)",
    description : "Romaner fra 1888.",
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


settings.corpora.memo_1889 = {
    id : "memo_1889",
    title : "MeMo 1889)",
    description : "Romaner fra 1889.",
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


settings.corpora.memo_1890 = {
    id : "memo_1890",
    title : "MeMo 1890)",
    description : "Romaner fra 1890.",
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


settings.corpora.memo_1891 = {
    id : "memo_1891",
    title : "MeMo 1891)",
    description : "Romaner fra 1891.",
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


settings.corpora.memo_1892 = {
    id : "memo_1892",
    title : "MeMo 1892)",
    description : "Romaner fra 1892.",
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


settings.corpora.memo_1893 = {
    id : "memo_1893",
    title : "MeMo 1893)",
    description : "Romaner fra 1893.",
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


settings.corpora.memo_1894 = {
    id : "memo_1894",
    title : "MeMo 1894)",
    description : "Romaner fra 1894.",
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


settings.corpora.memo_1895 = {
    id : "memo_1895",
    title : "MeMo 1895)",
    description : "Romaner fra 1895.",
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


settings.corpora.memo_1896 = {
    id : "memo_1896",
    title : "MeMo 1896)",
    description : "Romaner fra 1896.",
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


settings.corpora.memo_1897 = {
    id : "memo_1897",
    title : "MeMo 1897)",
    description : "Romaner fra 1897.",
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


settings.corpora.memo_1898 = {
    id : "memo_1898",
    title : "MeMo 1898)",
    description : "Romaner fra 1898.",
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


settings.corpora.memo_1899 = {
    id : "memo_1899",
    title : "MeMo 1899)",
    description : "Romaner fra 1899.",
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





settings.corpusListing = new CorpusListing(settings.corpora);
