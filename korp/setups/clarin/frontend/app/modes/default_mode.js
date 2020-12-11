settings.primaryColor = "#F7D1E4";
settings.primaryLight = "#FFEBF5";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

// TODO: something wrong with lsphealth2sundheddk4, commented out for now
settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["lspclimateaktuelnaturvidenskab", "lspclimatedmu", "lspclimatehovedland", "lspclimateoekraad"];

settings.corporafolders.lsp = {
    title : "CLARIN Fagsprogligt Korpus (LSP)",
    contents : [],
    description : "CLARIN Fagsprogligt Korpus i alt ca. 13 mio. ord"
};

settings.corporafolders.lsp.construction = {
    title : "LSP Byggeri og anlæg",
    contents : ["lspconstructioneb1", "lspconstructioneb2", "lspconstructionmuro","lspconstructionsbi"],
    description : "Fagsprogligt Korpus - byggeri og anlæg"
};

settings.corporafolders.lsp.agriculture = {
    title : "LSP Landbrug",
    contents : ["lspagriculturejordbrugsforskning"]
};

settings.corporafolders.lsp.climate = {
    title : "LSP Klima og miljø",
    contents : ["lspclimateaktuelnaturvidenskab", "lspclimatedmu", "lspclimatehovedland", "lspclimateoekraad"]
};

settings.corporafolders.lsp.health1 = {
    title : "LSP Health 1",
    contents : ["lsphealth1aktuelnaturvidenskab","lsphealth1librissundhed","lsphealth1netpatient", "lsphealth1regionh","lsphealth1soefartsstyrelsen","lsphealth1sst"]
};

settings.corporafolders.lsp.health2 = {
    title : "LSP Health 2",
    contents : ["lsphealth2sundheddk1","lsphealth2sundheddk2","lsphealth2sundheddk3","lsphealth2sundheddk5"]
//    contents : ["lsphealth2sundheddk1","lsphealth2sundheddk2","lsphealth2sundheddk3","lsphealth2sundheddk4","lsphealth2sundheddk5"]
};

settings.corporafolders.lsp.nano = {
    title : "LSP Nano",
    contents : ["lspnanonano1","lspnanonano2","lspnanonano3","lspnanonano4","lspnanoaktuelnaturvidenskab"]
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

settings.corpora.lspconstructioneb1 = {
    id : "LSPCONSTRUCTIONEB1",
    title : "LSP Byg, Erhvervs- og byggestyrelsen 1",
    description : " ",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspconstructioneb2 = {
    id : "LSPCONSTRUCTIONEB2",
    title : "LSP Byg, Erhvervs- og byggestyrelsen 2",
    description : " ",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspconstructionmuro = {
    id : "LSPCONSTRUCTIONMURO",
    title : "LSP Byg, Murerfagets Oplysningsråd",
    description : " ",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspconstructionsbi = {
    id : "LSPCONSTRUCTIONSBI",
    title : "LSP Byg, Statens Byggeforskningsinstitut",
    description : " ",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

/*settings.corpora.lspbyggeri3c = {
    id : "LSPBYGGERI3C",
    title : "LSP Byggeri 3 gange",
    description : "LSP Byggeri token,3*(w,nypos,nymsd,lemma):sent:p)",
    within : settings.spWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};*/

settings.corpora.lspclimateaktuelnaturvidenskab = {
    id : "LSPCLIMATEAKTUELNATURVIDENSKAB",
    title : "LSP CLIMATEAKTUELNATURVIDENSKAB",
    description : "LSP CLIMATE  Akt nat vid",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspclimatedmu = {
    id : "LSPCLIMATEDMU",
    title : "LSP CLIMATE DMU",
    description : "LSP CLIMATE DMU",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspclimatehovedland = {
    id : "LSPCLIMATEHOVEDLAND",
    title : "LSP CLIMATE HOVEDLAND",
    description : "LSP CLIMATE Forlaget HOVEDLAND",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspclimateoekraad = {
    id : "LSPCLIMATEOEKRAAD",
    title : "LSP CLIMATE Oekraad",
    description : "LSP CLIMATE Oekråd",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1aktuelnaturvidenskab = {
    id : "LSPHEALTH1AKTUELNATURVIDENSKAB",
    title : "LSP Health1 AktuelNaturvidenskab",
    description : "LSP Health, AktuelNaturvidenskab 2001-2009",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1librissundhed = {
    id : "LSPHEALTH1LIBRISSUNDHED",
    title : "LSP Health1 Libris",
    description : "LSP Health, Libris 2005-2006",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1netpatient = {
    id : "LSPHEALTH1NETPATIENT",
    title : "LSP Health1 Netpatient",
    description : "LSP Health, Netpatient.dk 2007",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1regionh = {
    id : "LSPHEALTH1REGIONH",
    title : "LSP Health1 RegionH",
    description : "LSP Health, RegionH 2006",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1soefartsstyrelsen = {
    id : "LSPHEALTH1SOEFARTSSTYRELSEN",
    title : "LSP Health1  Søfartsstyrelsen",
    description : "LSP Health,  Søfartsstyrelsen 2005-2010",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth1sst = {
    id : "LSPHEALTH1SST",
    title : "LSP Health1 Sundhedsstyrelsen",
    description : "LSP Health, SST 2000-2010",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth2sundheddk1 = {
    id : "LSPHEALTH2SUNDHEDDK1",
    title : "LSP Health2 Sundhed.dk 1",
    description : "LSP Health, Sundhed.dk 1",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth2sundheddk2 = {
    id : "LSPHEALTH2SUNDHEDDK2",
    title : "LSP Health2 Sundhed.dk 2",
    description : "LSP Health, Sundhed.dk 2",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lsphealth2sundheddk3 = {
    id : "LSPHEALTH2SUNDHEDDK3",
    title : "LSP Health2 Sundhed.dk 3",
    description : "LSP Health, Sundhed.dk 3",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

//settings.corpora.lsphealth2sundheddk4 = {
//    id : "LSPHEALTH2SUNDHEDDK4",
//    title : "LSP Health2 Sundhed.dk 4",
//    description : "LSP Health, Sundhed.dk 4",
//    within : settings.defaultWithin,
//    context : defaultContext,
//    attributes : modernAttrs,
//    structAttributes : {
//        text_title : {label : "title"},
//    }
//};

settings.corpora.lsphealth2sundheddk5 = {
    id : "LSPHEALTH2SUNDHEDDK5",
    title : "LSP Health2 Sundhed.dk 5",
    description : "LSP Health, Sundhed.dk 5",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};
/* It */

settings.corpora.lspnanonano1 = {
    id : "LSPNANONANO1",
    title : "LSP Nano 1: DTU og KU",
    description : "LSP Nano 1: DTU, iNano, Institut for Fysik og Astronomi, Niels Bohr Institutet, KU",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspnanonano2 = {
    id : "LSPNANONANO2",
    title : "LSP Nano 2: iNano, AU",
    description : "LSP Nano 2: iNano, Aarhus Universitetsforlag",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspnanonano3 = {
    id : "LSPNANONANO3",
    title : "LSP Nano 3: Forskningscenter Risoe, Miljoestyrelsen, Ministeriet for Sundhed og Forebyggelse",
    description : "LSP Nano 3: Forskningscenter Risoe, Miljoestyrelsen, Ministeriet for Sundhed og Forebyggelse",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspnanonano4 = {
    id : "LSPNANONANO4",
    title : "LSP Nano 4: AU",
    description : "LSP Nano 4: Interdisciplinary Nanoscience Center, Aarhus Universitet",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpora.lspnanoaktuelnaturvidenskab = {
    id : "LSPNANOAKTUELNATURVIDENSKAB",
    title : "LSP Nano: Aktuel Naturvidenskab",
    description : "LSP Nano : Aktuel Naturvidenskab",
    within : settings.defaultWithin,
    context : defaultContext,
    attributes : modernAttrs,
    structAttributes : {
        text_title : {label : "title"},
    }
};

settings.corpusListing = new CorpusListing(settings.corpora);
