console.log('Top of config.js');

var isLab = window.isLab || false;

// The statistics tab will fail if this setting is left undefined [sg]
settings.groupStatistics = [];

settings.autocomplete = true;
settings.enableMap = !isLab;
settings.mapPosTag = ["PM", "NNP", "NNPS"]
settings.newMapEnabled = isLab;
settings.hitsPerPageDefault = 25
settings.hitsPerPageValues = [25,50,75,100,500,1000]
settings.enableBackendKwicDownload = false
settings.enableFrontendKwicDownload = true

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

// 'union' vs. 'intersection':
// 'union' will show the union of all attributes available in any corpora.
// 'intersection' will show only attributes available in all corpora. 

// for extended search dropdown, can be 'union' or 'intersection'
settings.wordAttributeSelector = "union";
settings.structAttributeSelector = "union";

// for 'compile statistics by' selector, can be 'union' or 'intersection'
settings.reduceWordAttributeSelector = "union";
settings.reduceStructAttributeSelector = "union";

// TODO: What is this?
settings.filterSelection = "intersection"

// settings.newsDeskUrl = "https://svn.spraakdata.gu.se/sb-arkiv/pub/component_news/json/korpnews.json";

settings.wordpictureTagset = {
    // supported pos-tags
    verb: "vb",

    noun: "nn",
    adjective: "jj",
    adverb: "ab",
    preposition: "pp",

    // dependency releations
    subject: "ss",
    object: "obj",
    adverbial: "adv",
    preposition_rel: "pa",
    pre_modifier: "at",
    post_modifier: "et",
    adverbial2: "aa"
}


settings.wordPictureConf = {
    verb: [[
        {rel: "subject", css_class: "color_blue"},
        "_",
        {rel: "object", css_class: "color_purple"},
        {rel: "adverbial", css_class: "color_green"}
    ]],
    noun: [
        [{rel: "preposition_rel", css_class: "color_yellow", field_reverse: true},
         {rel: "pre_modifier", css_class: "color_azure"},
         "_",
         {rel: "post_modifier", css_class: "color_red"}],

        ["_", {rel: "subject", css_class: "color_blue", field_reverse: true, alt_label: "vb"}],
        [{rel: "object", css_class: "color_purple", field_reverse: true, alt_label: "vb"}, "_"]
    ],
    adjective: [
        ["_", {rel: "pre_modifier", css_class: "color_yellow", field_reverse: true}],
        [{rel: "adverbial2", css_class: "color_purple"}, "_"]
    ],
    adverb: [
        ["_", {rel: "adverbial", css_class: "color_yellow", field_reverse: true}],
        ["_", {rel: "adverbial2", css_class: "color_purple", field_reverse: true}]
    ],
    preposition: [["_", {rel: "preposition_rel", css_class: "color_green"}]]

}


settings.visibleModes = 5
console.log('config.js before settings.modeConfig');
settings.modeConfig = [
    {
        localekey: "lanchart_transcriptions",
        mode: "default"
    }
];
console.log('config.js after settings.modeConfig');


settings.primaryColor = "rgb(221, 233, 255)";
settings.primaryLight = "rgb(242, 247, 255)";

settings.defaultOverviewContext = "1 sentence"
settings.defaultReadingContext = "5 sentence"

// settings.defaultWithin causes trouble if set to e.g.
// "sentence": "sentence", "text": "text", even when the corpus has
// both <sentence> and <text> elements. For now, it must be just "sentence": "sentence",
// and multiple 'within' values have to be set on each corpus individually.
// Cf. https://github.com/spraakbanken/korp-frontend/issues/221
settings.defaultWithin = { "sentence": "sentence" };

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
}

//SET THIS BY PROJECT.
// Local development: Use "http://127.0.0.1:1234"
settings.korpBackendURL = "http://127.0.0.1:1234";
//settings.korpBackendURL = "https://lanchartkorp.ku.dk/backend";
console.log('settings.korpBackendURL set to: "' + settings.korpBackendURL + '". If this is not valid, a "TypeError: r.corpora is undefined" will be raised.');

settings.mapCenter = {
  lat: 62.99515845212052,
  lng: 16.69921875,
  zoom: 4
};

settings.readingModeField = "sentence_id"

console.log('Bottom of config.js');

