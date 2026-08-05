console.log('Kalaallisut mode file: Top of file');

settings.primaryColor = "#ccdaec";
settings.primaryLight = "#d9e9fd";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ['lanchart_nanortalikmobilitet'];

settings.corporafolders.kalaallisut = {
    title : "Kalaallisut",
    contents : ['c1_kal', 'c2_kal', 'c3_kal'],
    description : "Kalaallisut ..."
};

settings.corporafolders.lanchart = {
    title : "LANCHART-kal-korpusset",
    contents : ['lanchart_nanortalikmobilitet'],
    description : "LANCHART Kalaallisut-korpusset, delt op efter projekt."
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


//=============================================================================
// Maliinas korpus
//=============================================================================

var partiturHost = '';
// Local "lanchart" setup:
if (window.location.hostname == 'localhost' && window.location.port == '9111') var partiturHost = 'http://localhost:5005/';
// Local "lancharttest" setup:
if (window.location.hostname == 'localhost' && window.location.port == '19111') var partiturHost = 'http://localhost:15005/';
//console.log('partiturHost set to: ' + partiturHost);

settings.lanchartCustomAttrs = {
    file_cust : {
        label : "file_custom",
        order : 1,
        customType : "struct",
        pattern : '<%=struct_attrs.text_filename%> <p style="margin-left: 10px; margin-bottom: 5px">' +
                  '<span rel="localize[samtaler_dato]">Dato</span>: <%=struct_attrs.text_samtaler_dato || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[oldnew]">Gammel/ny</span>: <%=struct_attrs.text_oldnew || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[samtaler_samtaletype]">Samtaletype</span>: <%=struct_attrs.text_samtaler_samtaletype || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[samtaler_eksplorativ]">Eksplorativ</span>: <%=struct_attrs.text_samtaler_eksplorativ || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[samtaler_korrektur]">Korrektur</span>: <%=struct_attrs.text_samtaler_korrektur || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[samtaler_prioriteret]">Prioriteret</span>: <%=struct_attrs.text_samtaler_prioriteretekstra || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[samtaler_prioriteretekstra]">Prioriteret, ekstra</span>: <%=struct_attrs.text_samtaler_prioriteret || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[projekter_name]">Projekt</span>: <%=struct_attrs.text_projekter_name || "<small>__UNDEF__</small>"%>, ' +
                  '<span rel="localize[textduration]">Samtalelaengde</span>: <%=struct_attrs.text_textduration || "<small>__UNDEF__</small>"%>' +
                  '</p>'
    },
    basic_cust : {
        label : "basic_annotations_custom",
        order : 0,
        customType : "pos",
        // Start sættes til 2 sekunder før xmin hvis xmin er mere end 2 sekunder efter turnmin - ellers til turnmin.
        pattern : '"' + '<%=pos_attrs.word%>" ' +
                  '(<a href="' + partiturHost + 'partitur?label=<%=struct_attrs.corpus_id%>'+
                  '&start=<%=(Number(pos_attrs.xmin) - Number(pos_attrs.turnmin) >= 2) ? Number(pos_attrs.xmin) - 2 : pos_attrs.turnmin%>' +
                  '&end=<%=Number(pos_attrs.xmax) + 3%>' +
                  '&targetstart=<%=pos_attrs.xmin%>' +
                  '&targetend=<%=pos_attrs.xmax%>' +
                  '&file=<%=encodeURIComponent(struct_attrs.text_filename)%>' + 
                  '" target="_blank">' +
                  '<span rel="localize[show_partitur]">Afspil lyd ➚</span></a>)' +
                  '<div style="margin-top: 5px; margin-bottom: 5px"> ' + 

                  '<span rel="localize[real_ipa]">real_ipa</span>: <%=pos_attrs.real_ipa || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[ipa]">ipa</span>: <%=pos_attrs.ipa || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[ttt]">ttt</span>: <%=pos_attrs.ttt || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[redpos]">redpos</span>: <%=pos_attrs.redpos || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[pos]">pos</span>: <%=pos_attrs.pos || "<small>__UNDEF__</small>"%>' +


                  '</div>' + 
                  '<span rel="localize[speaker]">speaker</span>: ' +
                  '<span style="background: <%=pos_attrs.colorcombo_bg%>; ' +
                               'color: <%=pos_attrs.colorcombo_fg%>; ' +
                               'border: 2px solid; border-color: <%=pos_attrs.colorcombo_border%>; ' +
                               'border-radius: 2px; font-size: .85em; padding: 0px 5px; font-weight: bold;">' +
                               '<%=pos_attrs.speaker%></span>, ' +

                  '<span rel="localize[informanter_koen]">informanter_koen</span>: <%=pos_attrs.informanter_koen || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[informanter_foedselsaar]">informanter_foedselsaar</span>: <%=pos_attrs.informanter_foedselsaar || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[taleralder]">taleralder</span>: <%=pos_attrs.taleralder || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[informanter_generation]">informanter_generation</span>: <%=pos_attrs.informanter_generation || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[informanter_socialklasse]">informanter_socialklasse</span>: <%=pos_attrs.informanter_socialklasse || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[rolle]">rolle</span>: <%=pos_attrs.rolle || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[informanter_prioriteret]">informanter_prioriteret</span>: <%=pos_attrs.informanter_prioriteret || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[informanter_prioriteretekstra]">informanter_prioriteretekstra</span>: <%=pos_attrs.informanter_prioriteretekstra || "<small>__UNDEF__</small>"%>' +


                  '<div style="margin-bottom: 5px"></div>' + 

                  '<span rel="localize[text_enum]">text_enum</span>: <%=pos_attrs.text_enum || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[ordnummer]">ordnummer</span>: <%=pos_attrs.ordnummer || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[turn_enum]">turn_enum</span>: <%=pos_attrs.turn_enum || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[xmin]">xmin</span>: <%=pos_attrs.xmin || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[xmax]">xmax</span>: <%=pos_attrs.xmax || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[xlength]">xlength</span>: <%=pos_attrs.xlength || "<small>__UNDEF__</small>"%>' +


                  '<div style="margin-bottom: 5px"></div>' + 

                  '<span rel="localize[turnummer]">turnummer</span>: <%=pos_attrs.turnummer || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[talekilde]">talekilde</span>: <%=pos_attrs.talekilde || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[turnmin]">turnmin</span>: <%=pos_attrs.turnmin || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[turnmax]">turnmax</span>: <%=pos_attrs.turnmax || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[turnduration]">turnduration</span>: <%=pos_attrs.turnduration || "<small>__UNDEF__</small>"%>' +


                  '<div style="margin-bottom: 5px"></div>' + 

                  '<span rel="localize[aktivitetstype]">aktivitetstype</span>: ' +
                  '<%=pos_attrs.aktivitetstype || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[genre]">genre</span>: ' +
                  '<%=pos_attrs.genre || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[interaktionsstruktur]">interaktionsstruktur</span>: ' +
                  '<%=pos_attrs.interaktionsstruktur || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[makroxsproghandling]">makroxsproghandling</span>: ' +
                  '<%=pos_attrs.makroxsproghandling || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[samtaletype]">samtaletype</span>: ' +
                  '<%=pos_attrs.samtaletype || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[udsigelse]">udsigelse</span>: ' +
                  '<%=pos_attrs.udsigelse || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[iivxaigxkommentarer]">iivxaigxkommentarer</span>: ' +
                  '<%=pos_attrs.iivxaigxkommentarer || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[iivxsmuxkommentarer]">iivxsmuxkommentarer</span>: ' +
                  '<%=pos_attrs.iivxsmuxkommentarer || "<small>__UNDEF__</small>"%>, ' +

                  '<span rel="localize[iivxkommentarer]">iivxkommentarer</span>: ' +
                  '<%=pos_attrs.iivxkommentarer || "<small>__UNDEF__</small>"%>' +


                  '<div style="margin: 15px 0px 5px 0px"></div>' + 
                  '<div style="margin-bottom: 5px"></div>'
        }
};


console.log('Mode file: Common S-attrs');



console.log('Mode file: Custom S-attrs');

var lanchart_size = { label: "size",
    hideSidebar: true,
    order: 0 };

var lanchart_textmin = { label: "textmin",
    hideSidebar: true,
    order: 1 };

var lanchart_textmax = { label: "textmax",
    hideSidebar: true,
    order: 2 };

var lanchart_textduration = { label: "textduration",
    hideSidebar: true,
    order: 3 };

var lanchart_filename = { label: "filename",
    hideSidebar: true,
    order: 4 };

var lanchart_datefrom = { label: "datefrom",
    hideSidebar: true,
    order: 5 };

var lanchart_timefrom = { label: "timefrom",
    hideSidebar: true,
    order: 6 };

var lanchart_dateto = { label: "dateto",
    hideSidebar: true,
    order: 7 };

var lanchart_timeto = { label: "timeto",
    hideSidebar: true,
    order: 8 };

var lanchart_oldnew = { label: "oldnew",
    hideSidebar: true,
    order: 9 };

var lanchart_samtaler_dato = { label: "samtaler_dato",
    hideSidebar: true,
    order: 10 };

var lanchart_samtaler_projekt = { label: "samtaler_projekt",
    hideSidebar: true,
    order: 11 };

var lanchart_samtaler_samtaletype = { label: "samtaler_samtaletype",
    hideSidebar: true,
    order: 12 };

var lanchart_samtaler_eksplorativ = { label: "samtaler_eksplorativ",
    hideSidebar: true,
    order: 13 };

var lanchart_samtaler_korrektur = { label: "samtaler_korrektur",
    hideSidebar: true,
    order: 14 };

var lanchart_samtaler_prioriteret = { label: "samtaler_prioriteret",
    hideSidebar: true,
    order: 15 };

var lanchart_samtaler_prioriteretekstra = { label: "samtaler_prioriteretekstra",
    hideSidebar: true,
    order: 16 };

var lanchart_projekter_name = { label: "projekter_name",
    hideSidebar: true,
    order: 17 };

var lanchart_id = { label: "id",
    hideSidebar: true,
    order: 18 };

var lanchart_speaker = { label: "speaker",
    hideSidebar: true,
    order: 19 };

var lanchart_turnummer = { label: "turnummer",
    hideSidebar: true,
    order: 20 };

var lanchart_talekilde = { label: "talekilde",
    hideSidebar: true,
    order: 21 };

var lanchart_turnmin = { label: "turnmin",
    hideSidebar: true,
    order: 22 };

var lanchart_turnmax = { label: "turnmax",
    hideSidebar: true,
    order: 23 };

var lanchart_turnduration = { label: "turnduration",
    hideSidebar: true,
    order: 24 };


console.log('Mode file: Common P-attrs');

var lanchart_kkutxvariabel = { label: "kkutxvariabel",
    opts: settings.defaultOptions, 
    order: 1 };
var lanchart_toqxvariabel = { label: "toqxvariabel",
    opts: settings.defaultOptions, 
    order: 2 };
var lanchart_tugutxvariabel = { label: "tugutxvariabel",
    opts: settings.defaultOptions, 
    order: 3 };
var lanchart_xtixxvariabel = { label: "xtixxvariabel",
    opts: settings.defaultOptions, 
    order: 4 };
var lanchart_tixvariabel = { label: "tixvariabel",
    opts: settings.defaultOptions, 
    order: 5 };
var lanchart_vutxrputxvariabel = { label: "vutxrputxvariabel",
    opts: settings.defaultOptions, 
    order: 6 };
var lanchart_ernitaasaqxvariabel = { label: "ernitaasaqxvariabel",
    opts: settings.defaultOptions, 
    order: 7 };
var lanchart_ernitaasaq = { label: "ernitaasaq",
    opts: settings.defaultOptions, 
    order: 8 };
var lanchart_speaker = { label: "speaker",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 9 };
var lanchart_colorcombo_bg = { label: "colorcombo_bg",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 10 };
var lanchart_colorcombo_border = { label: "colorcombo_border",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 11 };
var lanchart_colorcombo_fg = { label: "colorcombo_fg",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 12 };
var lanchart_informanter_koen = { label: "informanter_koen",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 13 };
var lanchart_informanter_foedselsaar = { label: "informanter_foedselsaar",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 14 };
var lanchart_taleralder = { label: "taleralder",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 15 };
var lanchart_informanter_generation = { label: "informanter_generation",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 16 };
var lanchart_informanter_socialklasse = { label: "informanter_socialklasse",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 17 };
var lanchart_rolle = { label: "rolle",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 18 };
var lanchart_informanter_prioriteret = { label: "informanter_prioriteret",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 19 };
var lanchart_informanter_prioriteretekstra = { label: "informanter_prioriteretekstra",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 20 };
var lanchart_text_enum = { label: "text_enum",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 21 };
var lanchart_ordnummer = { label: "ordnummer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 22 };
var lanchart_turn_enum = { label: "turn_enum",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 23 };
var lanchart_xmin = { label: "xmin",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 24 };
var lanchart_xmax = { label: "xmax",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 25 };
var lanchart_xlength = { label: "xlength",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 26 };
var lanchart_turnummer = { label: "turnummer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 27 };
var lanchart_talekilde = { label: "talekilde",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 28 };
var lanchart_turnmin = { label: "turnmin",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 29 };
var lanchart_turnmax = { label: "turnmax",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 30 };
var lanchart_turnduration = { label: "turnduration",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 31 };
var lanchart_comments = { label: "comments",
    opts: settings.defaultOptions, 
    order: 32 };
var lanchart_events = { label: "events",
    opts: settings.defaultOptions, 
    order: 33 };
var lanchart_turn = { label: "turn",
    opts: settings.defaultOptions, 
    order: 34 };
var lanchart_sync = { label: "sync",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 35 };

console.log('Mode file: Individual corpus configs');


settings.corpora.lanchart_nanortalikmobilitet = {
    id : "lanchart_nanortalikmobilitet",
    title : "LANCHART_NANORTALIKMOBILITET",
    description : "Korpus af udskrifterne fra Nanortalik Mobilitet-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        kkutxvariabel : lanchart_kkutxvariabel,
        toqxvariabel : lanchart_toqxvariabel,
        tugutxvariabel : lanchart_tugutxvariabel,
        xtixxvariabel : lanchart_xtixxvariabel,
        tixvariabel : lanchart_tixvariabel,
        vutxrputxvariabel : lanchart_vutxrputxvariabel,
        ernitaasaqxvariabel : lanchart_ernitaasaqxvariabel,
        ernitaasaq : lanchart_ernitaasaq,
        speaker : lanchart_speaker,
        colorcombo_bg : lanchart_colorcombo_bg,
        colorcombo_border : lanchart_colorcombo_border,
        colorcombo_fg : lanchart_colorcombo_fg,
        informanter_koen : lanchart_informanter_koen,
        informanter_foedselsaar : lanchart_informanter_foedselsaar,
        taleralder : lanchart_taleralder,
        informanter_generation : lanchart_informanter_generation,
        informanter_socialklasse : lanchart_informanter_socialklasse,
        rolle : lanchart_rolle,
        informanter_prioriteret : lanchart_informanter_prioriteret,
        informanter_prioriteretekstra : lanchart_informanter_prioriteretekstra,
        text_enum : lanchart_text_enum,
        ordnummer : lanchart_ordnummer,
        turn_enum : lanchart_turn_enum,
        xmin : lanchart_xmin,
        xmax : lanchart_xmax,
        xlength : lanchart_xlength,
        turnummer : lanchart_turnummer,
        talekilde : lanchart_talekilde,
        turnmin : lanchart_turnmin,
        turnmax : lanchart_turnmax,
        turnduration : lanchart_turnduration,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        sync : lanchart_sync
    },
    structAttributes : {
        corpus_id : lanchart_id,
        text_size : lanchart_size,
        text_textmin : lanchart_textmin,
        text_textmax : lanchart_textmax,
        text_textduration : lanchart_textduration,
        text_filename : lanchart_filename,
        text_datefrom : lanchart_datefrom,
        text_timefrom : lanchart_timefrom,
        text_dateto : lanchart_dateto,
        text_timeto : lanchart_timeto,
        text_oldnew : lanchart_oldnew,
        text_samtaler_dato : lanchart_samtaler_dato,
        text_samtaler_projekt : lanchart_samtaler_projekt,
        text_samtaler_samtaletype : lanchart_samtaler_samtaletype,
        text_samtaler_eksplorativ : lanchart_samtaler_eksplorativ,
        text_samtaler_korrektur : lanchart_samtaler_korrektur,
        text_samtaler_prioriteret : lanchart_samtaler_prioriteret,
        text_samtaler_prioriteretekstra : lanchart_samtaler_prioriteretekstra,
        text_projekter_name : lanchart_projekter_name
    },
    customAttributes : settings.lanchartCustomAttrs
    };




settings.corpusListing = new CorpusListing(settings.corpora);
