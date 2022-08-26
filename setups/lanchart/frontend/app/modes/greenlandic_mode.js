console.log('Kalaallisut mode file: Top of file');

settings.primaryColor = "#ccdaec";
settings.primaryLight = "#d9e9fd";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ['c1_kal', 'c2_kal', 'c3_kal'];

settings.corporafolders.kalaallisut = {
    title : "Kalaallisut",
    contents : ['c1_kal', 'c2_kal', 'c3_kal'],
    description : "Kalaallisut ..."
};


/*
Positional Attributes:  * word
                          lemma
                          tags
                          pos
                          other
                          enc
                          func

Structural Attributes:    s
                          s_id                 [A]
*/

console.log('Kalaallisut mode file: Common P-attrs');


var kalaal_lemma = { label : "kal_lemma", opts : settings.defaultOptions, order : 0 };
var kalaal_tags = { label : "kal_tags", opts : settings.defaultOptions, order : 0 };
var kalaal_pos = { label : "kal_pos", opts : settings.defaultOptions, order : 0 };
var kalaal_other = { label : "kal_other", opts : settings.defaultOptions, order : 0 };
var kalaal_enc = { label : "kal_enc", opts : settings.defaultOptions, order : 0 };
var kalaal_func = { label : "kal_func", opts : settings.defaultOptions, order : 0 };


console.log('Kalaallisut mode file: Common S-attrs');

var kalaal_s_id = { label: "kal_s_id", order: 0 };


settings.corpora.c1_kal = {
    id : "c1_kal",
    title : "C1_KAL",
    description : "Kalaallisut C1",
    within :  {"s": "s"},
    context : {"1 s": "1 s"}, //defaultContext,
    attributes : {
        lemma : kalaal_lemma,
        tags : kalaal_tags,
        pos : kalaal_pos,
        other : kalaal_other,
        enc : kalaal_enc,
        func : kalaal_func
    },
    structAttributes : {
        s_id : kalaal_s_id
    }
    };


settings.corpora.c2_kal = {
    id : "C2_kal",
    title : "C2_KAL",
    description : "Kalaallisut C2",
    within :  {"s": "s"},
    context : {"1 s": "1 s"}, //defaultContext,
    attributes : {
        lemma : kalaal_lemma,
        tags : kalaal_tags,
        pos : kalaal_pos,
        other : kalaal_other,
        enc : kalaal_enc,
        func : kalaal_func
    },
    structAttributes : {
        s_id : kalaal_s_id
    }
    };


settings.corpora.c3_kal = {
    id : "c3_kal",
    title : "C3_KAL",
    description : "Kalaallisut C3",
    within :  {"s": "s"},
    context : {"1 s": "1 s"}, //defaultContext,
    attributes : {
        lemma : kalaal_lemma,
        tags : kalaal_tags,
        pos : kalaal_pos,
        other : kalaal_other,
        enc : kalaal_enc,
        func : kalaal_func
    },
    structAttributes : {
        s_id : kalaal_s_id
    }
    };



settings.corpusListing = new CorpusListing(settings.corpora);
