// Mode file generated automatically from "default_mode.jinja2".
// Philip Diderichsen, December 2022

settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["memo_all"];


/* Positional attributes */

/*
var memoWithAnnotationsAttrs = {
    token: {
        label : "TOKEN",
        opts : settings.defaultOptions,
        order : 1
        },
    lemma: {
        label : "LEMMA",
        opts : settings.defaultOptions,
        order : 1
        },
    pos: {
        label : "POS",
        opts : settings.defaultOptions,
        order : 1
        },
    wordnum_in_sentence: {
        label : "WORDNUMINSENTENCE",
        opts : settings.defaultOptions,
        order : 1
        },
    wordnum_in_line: {
        label : "WORDNUMINLINE",
        opts : settings.defaultOptions,
        order : 1
        },
    wordnum_global: {
        label : "WORDNUMGLOBAL",
        opts : settings.defaultOptions,
        order : 1
        },
    linenum: {
        label : "LINE",
        opts : settings.defaultOptions,
        order : 1
        },
    pagenum: {
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

const custom_p_pos = {
        label : "memo_all_pos",
        dataset : {
            "" : "",
            "ATI" : "ATI",
            "ENDING" : "ENDING",
            "LEXICAL" : "LEXICAL",
            "XF" : "XF",
            "XS" : "XS",
            "ZA" : "ZA",
            "ZD" : "ZD",
            "ZH" : "ZH",
            "ZI" : "ZI",
            "ZP" : "ZP",
            "ZQ" : "ZQ",
            "ZS" : "ZS",
            "adj" : "adj",
            "adv" : "adv",
            "interj" : "interj",
            "konj" : "konj",
            "num" : "num",
            "part" : "part",
            "pron" : "pron",
            "propr" : "propr",
            "præp" : "præp",
            "præt" : "præt",
            "sb" : "sb",
            "ubestpron" : "ubestpron",
            "v" : "v"
            },
        opts : liteOptions,
        // Changed from selectType [sg]
        extendedComponent: "datasetSelect",
        escape: false,
        order: 3
        };

$("#lemgram_list_item").remove();

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
            label : "author_custom", order : 1, customType : "struct",
            pattern : '<p style="margin-left: 10px; margin-bottom: 5px">' +
                  // Conditional render based on ternary operator (cond ? if true : if false)
                  '<%=struct_attrs.text_surname ? "<span rel=" + qtch + "localize[memo_all_text_surname]" + qtch + "></span>: " + struct_attrs.text_surname  :  "<span rel=" + qtch + "localize[memo_all_text_surname]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_firstname ? "<span rel=" + qtch + "localize[memo_all_text_firstname]" + qtch + "></span>: " + struct_attrs.text_firstname  :  "<span rel=" + qtch + "localize[memo_all_text_firstname]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_gender ? "<span rel=" + qtch + "localize[memo_all_text_gender]" + qtch + "></span>: " + struct_attrs.text_gender  :  "<span rel=" + qtch + "localize[memo_all_text_gender]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_nationality ? "<span rel=" + qtch + "localize[memo_all_text_nationality]" + qtch + "></span>: " + struct_attrs.text_nationality  :  "<span rel=" + qtch + "localize[memo_all_text_nationality]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_pseudonym ? "<span rel=" + qtch + "localize[memo_all_text_pseudonym]" + qtch + "></span>: " + struct_attrs.text_pseudonym  :  "<span rel=" + qtch + "localize[memo_all_text_pseudonym]" + qtch + "></span>: __UNDEF__"%><br/>' + 
                  '</p>'
    },

    book_cust : {
            label : "book_custom", order : 2, customType : "struct",
            pattern : '<p style="margin-left: 10px; margin-bottom: 5px">' +
                  // Conditional render based on ternary operator (cond ? if true : if false)
                  '<%=struct_attrs.text_title ? "<span rel=" + qtch + "localize[memo_all_text_title]" + qtch + "></span>: " + struct_attrs.text_title  :  "<span rel=" + qtch + "localize[memo_all_text_title]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_subtitle ? "<span rel=" + qtch + "localize[memo_all_text_subtitle]" + qtch + "></span>: " + struct_attrs.text_subtitle  :  "<span rel=" + qtch + "localize[memo_all_text_subtitle]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_volume ? "<span rel=" + qtch + "localize[memo_all_text_volume]" + qtch + "></span>: " + struct_attrs.text_volume  :  "<span rel=" + qtch + "localize[memo_all_text_volume]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_year ? "<span rel=" + qtch + "localize[memo_all_text_year]" + qtch + "></span>: " + struct_attrs.text_year  :  "<span rel=" + qtch + "localize[memo_all_text_year]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_publisher ? "<span rel=" + qtch + "localize[memo_all_text_publisher]" + qtch + "></span>: " + struct_attrs.text_publisher  :  "<span rel=" + qtch + "localize[memo_all_text_publisher]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_typeface ? "<span rel=" + qtch + "localize[memo_all_text_typeface]" + qtch + "></span>: " + struct_attrs.text_typeface  :  "<span rel=" + qtch + "localize[memo_all_text_typeface]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_price ? "<span rel=" + qtch + "localize[memo_all_text_price]" + qtch + "></span>: " + struct_attrs.text_price  :  "<span rel=" + qtch + "localize[memo_all_text_price]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_pages ? "<span rel=" + qtch + "localize[memo_all_text_pages]" + qtch + "></span>: " + struct_attrs.text_pages  :  "<span rel=" + qtch + "localize[memo_all_text_pages]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_illustrations ? "<span rel=" + qtch + "localize[memo_all_text_illustrations]" + qtch + "></span>: " + struct_attrs.text_illustrations  :  "<span rel=" + qtch + "localize[memo_all_text_illustrations]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_source ? "<span rel=" + qtch + "localize[memo_all_text_source]" + qtch + "></span>: " + struct_attrs.text_source  :  "<span rel=" + qtch + "localize[memo_all_text_source]" + qtch + "></span>: __UNDEF__"%><br/>' +
                  '<%=struct_attrs.text_id ? "<span rel=" + qtch + "localize[memo_all_text_id]" + qtch + "></span>: " + struct_attrs.text_id  :  "<span rel=" + qtch + "localize[memo_all_text_id]" + qtch + "></span>: __UNDEF__"%><br/>' + 
                  '</p>'
    },
};

/* CORPORA */

// Note! datefrom, dateto, timefrom, and timeto CANNOT be configured using
//       extendedComponent: "datasetSelect" - this seems to make the frontend build fail,
//       and cripple the trend diagram .. (Probably something to do with the trend diagram
//       not being able to parse out the dates).

/*
settings.corpora.memo_all = {
    id : "memo_all",
    title : "MeMo",
    description : "MeMo-korpusset med både antikva og fraktur.",
    within : { "text": "text" },
    context : { "20 words": "20 words" },
    attributes : memoWithAnnotationsAttrs,
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
*/

settings.corpora.memo_all = {
        id : "memo_all",
        title : "MEMO_ALL",
        description : "The MEMO_ALL corpus.",
        within : { "text": "text" },
        context : { "20 words": "20 words" },
        attributes : {
            normalized: { label: "memo_all_normalized", opts: settings.defaultOptions, order: 1 },
            lemma: { label: "memo_all_lemma", opts: settings.defaultOptions, order: 2 },
            pos: custom_p_pos,
            wordnum_in_sentence: { label: "memo_all_wordnum_in_sentence", opts: settings.defaultOptions, order: 4 },
            wordnum_in_line: { label: "memo_all_wordnum_in_line", opts: settings.defaultOptions, order: 5 },
            wordnum_global: { label: "memo_all_wordnum_global", opts: settings.defaultOptions, order: 6 },
            linenum: { label: "memo_all_linenum", opts: settings.defaultOptions, order: 7 },
            pagenum: { label: "memo_all_pagenum", opts: settings.defaultOptions, order: 8 }
            },
        structAttributes : {
            corpus_id : {label : "memo_all_corpus_id", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['memo_all'] },
            text_file_id : {label : "memo_all_text_file_id", hideSidebar: true },
            text_file_received : {label : "memo_all_text_file_received", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'y'] },
            text_filename : {label : "memo_all_text_filename", hideSidebar: true },
            text_firstname : {label : "memo_all_text_firstname", hideSidebar: true },
            text_surname : {label : "memo_all_text_surname", hideSidebar: true },
            text_pseudonym : {label : "memo_all_text_pseudonym", hideSidebar: true },
            text_gender : {label : "memo_all_text_gender", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'f', 'f ', 'm'] },
            text_nationality : {label : "memo_all_text_nationality", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'dk', 'dk ', 'dk-no', 'no'] },
            text_title : {label : "memo_all_text_title", hideSidebar: true },
            text_subtitle : {label : "memo_all_text_subtitle", hideSidebar: true },
            text_volume : {label : "memo_all_text_volume", hideSidebar: true },
            text_year : {label : "memo_all_text_year", hideSidebar: true },
            text_pages : {label : "memo_all_text_pages", hideSidebar: true },
            text_illustrations : {label : "memo_all_text_illustrations", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'n', 'y'] },
            text_typeface : {label : "memo_all_text_typeface", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['gothic', 'gothic ', 'roman'] },
            text_publisher : {label : "memo_all_text_publisher", hideSidebar: true },
            text_price : {label : "memo_all_text_price", hideSidebar: true },
            text_file_status : {label : "memo_all_text_file_status", hideSidebar: true },
            text_source : {label : "memo_all_text_source", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'KB'] },
            text_notes : {label : "memo_all_text_notes", hideSidebar: true },
            text_filepath : {label : "memo_all_text_filepath", hideSidebar: true },
            text_fileformat : {label : "memo_all_text_fileformat", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'p', 'pdftxt', 'txt'] },
            text_txt_received : {label : "memo_all_text_txt_received", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'y'] },
            text_readable : {label : "memo_all_text_readable", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'n', 'y'] },
            text_historical : {label : "memo_all_text_historical", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'n', 'y', 'y '] },
            text_period : {label : "memo_all_text_period", hideSidebar: true },
            text_period_notes : {label : "memo_all_text_period_notes", hideSidebar: true },
            text_novel_start : {label : "memo_all_text_novel_start", hideSidebar: true },
            text_novel_end : {label : "memo_all_text_novel_end", hideSidebar: true },
            text_novelstart_rescan : {label : "memo_all_text_novelstart_rescan", hideSidebar: true },
            text_novelend_rescan : {label : "memo_all_text_novelend_rescan", hideSidebar: true },
            text_start_end_page_notes : {label : "memo_all_text_start_end_page_notes", hideSidebar: true },
            text_serialno : {label : "memo_all_text_serialno", hideSidebar: true },
            text_quarantine : {label : "memo_all_text_quarantine", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'y'] },
            text_discard : {label : "memo_all_text_discard", hideSidebar: true, extendedComponent: "datasetSelect", escape: false, opts: liteOptions, dataset: ['', 'y'] },
            text_datefrom : {label : "memo_all_text_datefrom", displayType: "hidden", hideSidebar: true },
            text_dateto : {label : "memo_all_text_dateto", displayType: "hidden", hideSidebar: true },
            text_timefrom : {label : "memo_all_text_timefrom", displayType: "hidden", hideSidebar: true },
            text_timeto : {label : "memo_all_text_timeto", displayType: "hidden", hideSidebar: true },
            paragraph_id : {label : "memo_all_paragraph_id", hideSidebar: false },
            sentence_id : {label : "memo_all_sentence_id", hideSidebar: false }
            },
            customAttributes : settings.memoCustomAttrs
        };

settings.corpusListing = new CorpusListing(settings.corpora);