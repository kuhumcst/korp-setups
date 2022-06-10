settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_all"];


/* Note:
   No sentences
   No lemma and pos annotations
*/


// From https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md:
// customAttributes: creates fields in the sidebar that have no corresponding attribute in the backend.
// Useful for combining two different attributes. All settings concerning sidebar format for normal attributes apply in addition to:
//    customType: "struct" / "pos" - decides if the attribute should be grouped under word attributes or text attributes.
//    pattern: Same as pattern for normal attributes, but struct_attrs and pos_attrs also available. 
// Example: '<p style="margin-left: 5px;"><%=struct_attrs.text_title - struct_attrs.text_description%></p>'

// PD: The S-attrs used here should be kept under structAttributes in the corpora.
// Avoid displaying them twice by setting hideSidebar: true in the attribute definitions.

// Note: <%="blaha"%> is apparently JSP syntax ... 

const qtch = '"';  // Hack: quotechar

settings.memoCustomAttrs = {
    author_cust : {
        label : "author_custom",
        order : 1,
        customType : "struct",
        pattern : '<p style="margin-left: 10px; margin-bottom: 5px">' +
                  // Conditional rendering based on ternary operator (condition ? value if true : value if false)
                  '<%=struct_attrs.text_surname ? "<span rel=" + qtch + "localize[surname]" + qtch + "></span>: " + struct_attrs.text_surname  :  "<span rel=" + qtch + "localize[surname]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_firstname ? "<span rel=" + qtch + "localize[firstname]" + qtch + "></span>: " + struct_attrs.text_firstname  :  "<span rel=" + qtch + "localize[firstname]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_gender ? "<span rel=" + qtch + "localize[gender]" + qtch + "></span>: " + struct_attrs.text_gender  :  "<span rel=" + qtch + "localize[gender]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_nationality ? "<span rel=" + qtch + "localize[nationality]" + qtch + "></span>: " + struct_attrs.text_nationality  :  "<span rel=" + qtch + "localize[nationality]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_pseudonym ? "<span rel=" + qtch + "localize[pseudonym]" + qtch + "></span>: " + struct_attrs.text_pseudonym  :  "<span rel=" + qtch + "localize[pseudonym]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '</p>'
    },
    book_cust : {
        label : "book_custom",
        order : 2,
        customType : "struct",
        pattern : '<p style="margin-left: 10px; margin-bottom: 5px">' +
                  '<%=struct_attrs.text_title ? "<span rel=" + qtch + "localize[title]" + qtch + "></span>: " + struct_attrs.text_title  :  "<span rel=" + qtch + "localize[title]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_subtitle ? "<span rel=" + qtch + "localize[subtitle]" + qtch + "></span>: " + struct_attrs.text_subtitle  :  "<span rel=" + qtch + "localize[subtitle]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_volume ? "<span rel=" + qtch + "localize[volume]" + qtch + "></span>: " + struct_attrs.text_volume  :  "<span rel=" + qtch + "localize[volume]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_year ? "<span rel=" + qtch + "localize[year]" + qtch + "></span>: " + struct_attrs.text_year  :  "<span rel=" + qtch + "localize[year]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_publisher ? "<span rel=" + qtch + "localize[publisher]" + qtch + "></span>: " + struct_attrs.text_publisher  :  "<span rel=" + qtch + "localize[publisher]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_typeface ? "<span rel=" + qtch + "localize[typeface]" + qtch + "></span>: " + struct_attrs.text_typeface  :  "<span rel=" + qtch + "localize[typeface]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_price ? "<span rel=" + qtch + "localize[price]" + qtch + "></span>: " + struct_attrs.text_price  :  "<span rel=" + qtch + "localize[price]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_pages ? "<span rel=" + qtch + "localize[pages]" + qtch + "></span>: " + struct_attrs.text_pages  :  "<span rel=" + qtch + "localize[pages]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_illustrations ? "<span rel=" + qtch + "localize[illustrations]" + qtch + "></span>: " + struct_attrs.text_illustrations  :  "<span rel=" + qtch + "localize[illustrations]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_source ? "<span rel=" + qtch + "localize[source]" + qtch + "></span>: " + struct_attrs.text_source  :  "<span rel=" + qtch + "localize[source]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_id ? "<span rel=" + qtch + "localize[id]" + qtch + "></span>: " + struct_attrs.text_id  :  "<span rel=" + qtch + "localize[id]" + qtch + "></span>: __UNDEF__"%><br/>' +

                  '</p>'
    }
};


/*
 * Positional attributes for test corpus.
 */

/*
var memofrakturgoldAttrs = {
    token: {
        label : "TOKEN",
        opts : settings.defaultOptions,
        order : 1
        },
    wordnum: {
        label : "WORDNUM",
        opts : settings.defaultOptions,
        order : 1
        },
    lineword: {
        label : "LINEWORD",
        opts : settings.defaultOptions,
        order : 1
        },
    line: {
        label : "LINE",
        opts : settings.defaultOptions,
        order : 1
        },
    page: {
        label : "PAGE",
        opts : settings.defaultOptions,
        order : 1
        },
    novel_id: {
        label : "NOVEL_ID",
        opts : settings.defaultOptions,
        order : 1
        }
};
*/

var memofrakturgoldAttrs = {
        token: {
        label : "TOKEN",
        opts : settings.defaultOptions,
        order : 1
        },
    wordnum: {
        label : "WORDNUM",
        opts : settings.defaultOptions,
        order : 1
        },
    lineword: {
        label : "LINEWORD",
        opts : settings.defaultOptions,
        order : 1
        },
    line: {
        label : "LINE",
        opts : settings.defaultOptions,
        order : 1
        },
    page: {
        label : "PAGE",
        opts : settings.defaultOptions,
        order : 1
        },
    novel_id: {
        label : "NOVEL_ID",
        opts : settings.defaultOptions,
        order : 1,
        hideSidebar : true
        }
};


$("#lemgram_list_item").remove();


/*
 * CORPORA
 */

/*
settings.corpora.memo_all = {
    id : "memo_all",
    title : "MeMo",
    description : "MeMo-korpusset med både antikva og fraktur.",
    within : { "text": "text" },
    context : { "20 words": "20 words" },
    attributes : memofrakturgoldAttrs,
    structAttributes : {
        corpus_id : {label : "Korpus-id"},
        text_id : {label : "id"},
        text_file_id : {label : "file_id"},
        text_firstname : {label : "firstname"},
        text_surname : {label : "surname"},
        text_pseudonym : {label : "pseudonym"},
        text_gender : {label : "gender"},
        text_nationality : {label : "nationality"},
        text_title : {label : "title"},
        text_subtitle : {label : "subtitle"},
        text_volume : {label : "volume"},
        text_year : {label : "year"},
        text_pages : {label : "pages"},
        text_illustrations : {label : "illustrations"},
        text_typeface : {label : "typeface"},
        text_publisher : {label : "publisher"},
        text_price : {label : "price"},
        text_source : {label : "source"},
        text_notes : {label : "notes"},
        text_readable : {label : "readable"}
        }
};




pos : {
        label: "pos",
        translationKey: "pos_",
        dataset : {
        "ADJ" : "ADJ",
        "ADV" : "ADV",
        "CONJ" : "CONJ",
        "INTERJ" : "INTERJ",
        "N" : "N",
        "NUM" : "NUM",
        "OTHER" : "OTHER",
        "PREP" : "PREP",
        "PRON" : "PRON",
        "PROPN" : "PROPN",
        "UNIK" : "UNIK",
        "V" : "V"
        },
        opts: liteOptions,
        extendedComponent: "datasetSelect",
        escape: false,
        order: 0
    },
    
    
*/
settings.corpora.memo_all = {
    id : "memo_all",
    title : "MeMo corpus v. 0.5",
    description : "MeMo-korpusset med både antikva og fraktur.",
    within : { "text": "text" },
    context : { "20 words": "20 words" },
    attributes : memofrakturgoldAttrs,
    structAttributes : {
        corpus_id : {label : "corpus_id", order: 3},

        text_firstname : {label : "firstname", hideSidebar: true},
        text_surname : {label : "surname", hideSidebar: true},
        text_gender : {label : "gender", extendedComponent: "datasetSelect", escape: false, dataset: ["f" , "m", ""], opts: liteOptions, hideSidebar: true},
        text_nationality : {label : "nationality", extendedComponent: "datasetSelect", escape: false, dataset: ["dk" , "no", "dk-no", ""], opts: liteOptions, hideSidebar: true},
        text_pseudonym : {label : "pseudonym", hideSidebar: true},
        
        text_title : {label : "title", hideSidebar: true},
        text_subtitle : {label : "subtitle", hideSidebar: true},
        text_volume : {label : "volume", extendedComponent: "datasetSelect", escape: false, dataset: ["1" , "2", ""], opts: liteOptions, hideSidebar: true},

        text_year : {label : "year", hideSidebar: true},
        text_publisher : {label : "publisher", hideSidebar: true},
        text_typeface : {label : "typeface", extendedComponent: "datasetSelect", escape: false, dataset: ["roman" , "gothic"], opts: liteOptions, hideSidebar: true},
        text_price : {label : "price", hideSidebar: true},
        text_pages : {label : "pages", hideSidebar: true},
        text_illustrations : {label : "illustrations", hideSidebar: true},
        text_source : {label : "source", hideSidebar: true},
        text_id : {label : "id", hideSidebar: true},


        text_file_id : {label : "file_id", hideSidebar: true} //,
        // text_notes : {label : "notes", hideSidebar: true},
        // text_readable : {label : "readable", hideSidebar: true}
        },
    customAttributes : settings.memoCustomAttrs
};


settings.corpusListing = new CorpusListing(settings.corpora);
