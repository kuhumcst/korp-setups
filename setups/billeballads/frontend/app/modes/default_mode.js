settings.primaryColor = "#E7D7C5";
settings.primaryLight = "#F3EBE2";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

$("#lemgram_list_item").remove();
//$("#showLineDiagram").remove();


settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ["duds"];

settings.corporafolders.duds = {
        title : "Ældre danske tekster",
        contents : [],
        description : "Ældre danske tekster: folkeviser mv"
};

settings.corporafolders.duds.dfk = {
    title : "Den ældste danske viseoverlevering",
    contents : ["dudsdfk_billall"]
};



// Custom attributes for this mode (medieval ballads)
// From https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md:
// customAttributes: creates fields in the sidebar that have no corresponding attribute in the backend. Useful for combining two different attributes. All settings concerning sidebar format for normal attributes apply in addition to:
//    customType: "struct" / "pos" - decides if the attribute should be grouped under word attributes or text attributes.
//    pattern: Same as pattern for normal attributes, but struct_attrs and pos_attrs also available. Example: '<p style="margin-left: 5px;"><%=struct_attrs.text_title - struct_attrs.text_description%></p>'
settings.gldaCustomAttrs = {
        source_neutral_lemma_forms : {
            label : "source_neutral_lemma",
            order : 0,
            customType : "pos",
            pattern : '<p style="margin-left: 15px;"><%=pos_attrs.word%></p><p style="margin-left: 15px;"><%=pos_attrs.neutral%></p><p style="margin-left: 15px;margin-bottom: 10px;"><%=pos_attrs.lemma%></p>'
        }
};

/* Parts of speech present in the DUDSDFK_BILLALL corpus.
Note: No intp! This apparently somehow disturbed the correctly displaying the "within" dropdown menu in Korp ...
7977	pron  [#11261-#19237]
7917	vb  [#36659-#44575]
6661	tgn  [#29058-#35718]
6595	sb  [#22244-#28838]
3742	adv  [#2748-#6489]
3006	præp  [#19238-#22243]
2748	adj  [#0-#2747]
1912	konj  [#7810-#9721]
1308	pers  [#9953-#11260]
1251	art  [#6490-#7740]
675	uvis  [#35984-#36658]
265	ukl  [#35719-#35983]
231	num  [#9722-#9952]
219	stn  [#28839-#29057]
55	intj  [#7755-#7809]
14	bn  [#7741-#7754]
*/

// Positional attributes for this mode (medieval ballads)
settings.gldaAttrs = {
    neutral : {
                label : "neutral",
                type : "set",
                opts : settings.defaultOptions,
                extendedTemplate : "<input ng-model='model' >",
                order : 1,
                hideSidebar: true
              },
    lemma : {
                label: "lemma",
                type: "set",
                opts: settings.defaultOptions,
                extendedTemplate: "<input ng-model='model' >",
                order: 2,
                hideSidebar: true
                }, 
    pos : {
                label : "pos",
                translationKey : "pos_",
                dataset : {
                    "adj" : "ADJ",
                    "adv" : "AB",
                    "art" : "UNIK",
                    "sb" : "NN",
                    "konj" : "konj",
                    "intj" : "intj",
                    "num" : "num",
                    "tgn" : "OTHER",
                    "præp" : "PREP",
                    "pron" : "PRON",
                    "stn|pers|bn" : "PROPN",
                    "uvis" : "uvis",
                    // "intp" : "intp",
                    "vb" : "vb",
                    "ukl" : "ukl",
                    },
                opts : liteOptions,
                // Changed from selectType [sg]
                extendedComponent: "datasetSelect",
                escape: false,
                order : 3
                },
    glosse : {
                label : "glosse",
                opts : settings.defaultOptions,
                order : 4
                }
};

// Structural attributes for this mode (medieval ballads)
// From https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md:
// type: Possible values:
// "set" - The attribute is formatted as "|value1|value2|". Include contains and not contains in opts. In the sidebar, the value will be split before formatted. When using compile / groupby on a "set" attribute in a statistics request, it will be added to split.
// "url" - The value will be rendered as a link to the URL and possibly truncated if too long.
// pattern: HTML snippet with placeholders for replacing values. Available is key (attribute name) and value. Also works for sets. Example: '<p style="margin-left: 5px;"><%=val.toLowerCase()%></p>'
settings.gldaStructAttrs = {
        text_title : {label : "title", order : 1},
        text_date : {label : "date", order : 2},
        p_id : {label : "strofeid", order : 3},
        sentence_type : {label : "stype", order : 4},
        text_url : {
            label : "view_ballad",
            pattern : '<a href="https://cst.dk/dighumlab/duds/DFK/Dorthe/html/<%=val%>" target="_blank"><%=val%></a>',
            order : 5
            }
};


// Individual corpus configurations
settings.corpora["dudsdfk_billall"] = {
    id : "DUDSDFK_BILLALL",
    title : "Jens Billes haandskrift (1557-1559)",
    description : "Her svarer en sætning til en linje (vers) i en vise, og et afsnit i teksten svarer til en strofe. Ved uklar datering bruges en fiktiv startdato.",
    within : {
                "sentence" : "sentence",
                "paragraph" : "p"
                },
    context : {
                  "1 sentence" : "1 sentence",
                  "1 p" : "1 paragraph"
              },
    attributes : settings.gldaAttrs,
    structAttributes : settings.gldaStructAttrs,
    customAttributes : settings.gldaCustomAttrs
};

settings.corpusListing = new CorpusListing(settings.corpora);
