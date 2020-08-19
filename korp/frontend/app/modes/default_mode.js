settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

/*
 * Setup of checkbox hierarchy in corpus selector,
 * and specification of default corpus.
 */
settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["lspagriculturejordbrugsforskning"];

settings.corporafolders.lsp = {
    title : "CLARIN Fagsprogligt Korpus (LSP)",
    contents : [],
    description : "CLARIN Fagsprogligt Korpus i alt ca. 13 mio. ord"
};

settings.corporafolders.lsp.agriculture = {
    title : "LSP Landbrug",
    contents : ["lspagriculturejordbrugsforskning"]
};


/*
 * CORPORA
 */

settings.corpora.lspagriculturejordbrugsforskning = {
    id : "LSPAGRICULTUREJORDBRUGSFORSKNING",
    title : "LSP Agriculture Jordbrugsforskning",
    description : "LSP Dansk Jordbrugsforskning",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);
