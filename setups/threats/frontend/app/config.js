
// Are these irrelevant?
var isLab = window.isLab || false;

// The statistics tab will fail if this setting is left undefined [sg]
settings.groupStatistics = []

settings.autocomplete = true;
settings.enableMap = !isLab;
settings.mapPosTag = ["PM", "NNP", "NNPS"];
settings.newMapEnabled = isLab;
// Irrelevant? ^

settings.hitsPerPageDefault = 25;
settings.hitsPerPageValues = [25,50,75,100,500,1000];
settings.enableBackendKwicDownload = false;
settings.enableFrontendKwicDownload = true;

settings.languages = ["en", "da"];
settings.defaultLanguage = "da";

settings.downloadFormats = [
    "csv",
    "tsv",
    "annot",
    "ref",
];

settings.downloadFormatParams = {
    "*": {
        structs: "+"
    },
    "ref": {
        format: "bibref,xls"
    },
    "csvp": {
        format: "tokens,csv",
        attrs: "+,-lex",
        match_marker: "***"
    },
    "csv": {
        format: "sentences,csv"
    },
    "annot": {
        format: "tokens,xls",
        attrs: "+,-lex",
        match_marker: "***"
    },
    "nooj": {
        attrs: "+"
    },
    "tsv": {
        format: "sentences,tsv"
    },
    "vrt": {
        attrs: "+"
    },
};

// for extended search dropdown, can be 'union' or 'intersection'
settings.wordAttributeSelector = "union";
settings.structAttributeSelector = "union";

// for 'compile statistics by' selector, can be 'union' or 'intersection'
settings.reduceWordAttributeSelector = "intersection";
settings.reduceStructAttributeSelector = "intersection";

settings.filterSelection = "intersection";

// settings.newsDeskUrl = "https://svn.spraakdata.gu.se/sb-arkiv/pub/component_news/json/korpnews.json";

settings.visibleModes = 5;
settings.modeConfig = [
    {
        localekey: "threats",
        mode: "default"
    }
];

// Note: Korp's 'native' primary colors are overridden in each mode file.
settings.primaryColor = "rgb(221, 233, 255)";
settings.primaryLight = "rgb(242, 247, 255)";

settings.defaultOverviewContext = "1 sentence";
settings.defaultReadingContext = "1 paragraph";

settings.defaultWithin = {
    "sentence": "sentence"
};

// for optimization purposes
settings.cqpPrio = ['deprel', 'pos', 'msd', 'suffix', 'prefix', 'grundform', 'lemgram', 'saldo', 'word'];

settings.defaultOptions = {
    "is": "=",
    "is_not": "!=",
    "starts_with": "^=",
    "contains": "_=",
    "ends_with": "&=",
    "matches": "*=",
    "matches_not": "!*=",
};

//settings.korpBackendURL = "https://alf.hum.ku.dk/korp/backend";
settings.korpBackendURL = "http://127.0.0.1:1234";
settings.downloadCgiScript = "https://ws.spraakbanken.gu.se/ws/korp/download";

settings.readingModeField = "sentence_id";
