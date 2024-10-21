console.log('Mode file: Top of file');

settings.primaryColor = "#ccdaec";
settings.primaryLight = "#d9e9fd";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;

settings.corpora = {};
settings.corporafolders = {};
settings.preselectedCorpora = ['lanchart_amager', 'lanchart_amda', 'lanchart_argda', 'lanchart_bornholm', 'lanchart_bylderup', 'lanchart_bysoc', 'lanchart_canda', 'lanchart_clarin', 'lanchart_familie', 'lanchart_hirtshals', 'lanchart_koege', 'lanchart_mettemortensen', 'lanchart_modsjael', 'lanchart_munkebjerg', 'lanchart_naestved', 'lanchart_odder', 'lanchart_oksboel', 'lanchart_tinglev', 'lanchart_vinderup', 'lanchart_vissenbjerg', 'lanchart_vollsmose', 'lanchart_aabenraaaalborg'];

settings.corporafolders.lanchart = {
    title : "LANCHART-korpusset",
    contents : ['lanchart_amager', 'lanchart_amda', 'lanchart_argda', 'lanchart_bornholm', 'lanchart_bylderup', 'lanchart_bysoc', 'lanchart_canda', 'lanchart_clarin', 'lanchart_familie', 'lanchart_hirtshals', 'lanchart_koege', 'lanchart_mettemortensen', 'lanchart_modsjael', 'lanchart_munkebjerg', 'lanchart_naestved', 'lanchart_odder', 'lanchart_oksboel', 'lanchart_tinglev', 'lanchart_vinderup', 'lanchart_vissenbjerg', 'lanchart_vollsmose', 'lanchart_aabenraaaalborg'],
    description : "LANCHART-korpusset, delt op efter projekt."
};


// From https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md:
// customAttributes: creates fields in the sidebar that have no corresponding attribute in the backend.
// Useful for combining two different attributes. All settings concerning sidebar format for normal attributes apply in addition to:
//    customType: "struct" / "pos" - decides if the attribute should be grouped under word attributes or text attributes.
//    pattern: Same as pattern for normal attributes, but struct_attrs and pos_attrs also available. 
// Example: '<p style="margin-left: 5px;"><%=struct_attrs.text_title - struct_attrs.text_description%></p>'

// PD: The S-attrs used here should be kept under structAttributes in the corpora.
// Avoid displaying them twice by setting hideSidebar: true in the attribute definitions.

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

var lanchart_real_ipa = { label: "real_ipa",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 1 };
var lanchart_ipa = { label: "ipa",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 2 };
var lanchart_ttt = { label: "ttt",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 3 };
var lanchart_redpos = { label: "redpos",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 4 };
var lanchart_pos = { label: "pos",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 5 };
var lanchart_speaker = { label: "speaker",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 6 };
var lanchart_colorcombo_bg = { label: "colorcombo_bg",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 7 };
var lanchart_colorcombo_border = { label: "colorcombo_border",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 8 };
var lanchart_colorcombo_fg = { label: "colorcombo_fg",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 9 };
var lanchart_informanter_koen = { label: "informanter_koen",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 10 };
var lanchart_informanter_foedselsaar = { label: "informanter_foedselsaar",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 11 };
var lanchart_taleralder = { label: "taleralder",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 12 };
var lanchart_informanter_generation = { label: "informanter_generation",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 13 };
var lanchart_informanter_socialklasse = { label: "informanter_socialklasse",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 14 };
var lanchart_rolle = { label: "rolle",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 15 };
var lanchart_informanter_prioriteret = { label: "informanter_prioriteret",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 16 };
var lanchart_informanter_prioriteretekstra = { label: "informanter_prioriteretekstra",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 17 };
var lanchart_text_enum = { label: "text_enum",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 18 };
var lanchart_ordnummer = { label: "ordnummer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 19 };
var lanchart_turn_enum = { label: "turn_enum",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 20 };
var lanchart_xmin = { label: "xmin",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 21 };
var lanchart_xmax = { label: "xmax",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 22 };
var lanchart_xlength = { label: "xlength",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 23 };
var lanchart_turnummer = { label: "turnummer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 24 };
var lanchart_talekilde = { label: "talekilde",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 25 };
var lanchart_turnmin = { label: "turnmin",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 26 };
var lanchart_turnmax = { label: "turnmax",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 27 };
var lanchart_turnduration = { label: "turnduration",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 28 };
var lanchart_aktivitetstype = { label: "aktivitetstype",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 29 };
var lanchart_genre = { label: "genre",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 30 };
var lanchart_interaktionsstruktur = { label: "interaktionsstruktur",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 31 };
var lanchart_makroxsproghandling = { label: "makroxsproghandling",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 32 };
var lanchart_samtaletype = { label: "samtaletype",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 33 };
var lanchart_udsigelse = { label: "udsigelse",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 34 };
var lanchart_iivxaigxkommentarer = { label: "iivxaigxkommentarer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 35 };
var lanchart_iivxsmuxkommentarer = { label: "iivxsmuxkommentarer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 36 };
var lanchart_iivxsmulxkommentarer = { label: "iivxsmulxkommentarer",
    opts: settings.defaultOptions, 
    order: 37 };
var lanchart_iivxkommentarer = { label: "iivxkommentarer",
    opts: settings.defaultOptions, hideSidebar: true,
    order: 38 };
var lanchart_ajmarkering = { label: "ajmarkering",
    opts: settings.defaultOptions, 
    order: 39 };
var lanchart_ammarkering = { label: "ammarkering",
    opts: settings.defaultOptions, 
    order: 40 };
var lanchart_anrmarkering = { label: "anrmarkering",
    opts: settings.defaultOptions, 
    order: 41 };
var lanchart_anmarkering = { label: "anmarkering",
    opts: settings.defaultOptions, 
    order: 42 };
var lanchart_engmarkering = { label: "engmarkering",
    opts: settings.defaultOptions, 
    order: 43 };
var lanchart_rumarkering = { label: "rumarkering",
    opts: settings.defaultOptions, 
    order: 44 };
var lanchart_wmarkering = { label: "wmarkering",
    opts: settings.defaultOptions, 
    order: 45 };
var lanchart_dschwadmarkering = { label: "dschwadmarkering",
    opts: settings.defaultOptions, 
    order: 46 };
var lanchart_xschwadmarkering = { label: "xschwadmarkering",
    opts: settings.defaultOptions, 
    order: 47 };
var lanchart_phonetic = { label: "phonetic",
    opts: settings.defaultOptions, 
    order: 48 };
var lanchart_emphasis = { label: "emphasis",
    opts: settings.defaultOptions, 
    order: 49 };
var lanchart_at = { label: "at",
    opts: settings.defaultOptions, 
    order: 50 };
var lanchart_atxtabxadj = { label: "atxtabxadj",
    opts: settings.defaultOptions, 
    order: 51 };
var lanchart_atxtabxekspl = { label: "atxtabxekspl",
    opts: settings.defaultOptions, 
    order: 52 };
var lanchart_atxtabxeksplxkomm = { label: "atxtabxeksplxkomm",
    opts: settings.defaultOptions, 
    order: 53 };
var lanchart_atxtabxkunnehuske = { label: "atxtabxkunnehuske",
    opts: settings.defaultOptions, 
    order: 54 };
var lanchart_atxtabxmene = { label: "atxtabxmene",
    opts: settings.defaultOptions, 
    order: 55 };
var lanchart_atxtabxmenexkomm = { label: "atxtabxmenexkomm",
    opts: settings.defaultOptions, 
    order: 56 };
var lanchart_atxtabxnogetmed = { label: "atxtabxnogetmed",
    opts: settings.defaultOptions, 
    order: 57 };
var lanchart_atxtabxsige = { label: "atxtabxsige",
    opts: settings.defaultOptions, 
    order: 58 };
var lanchart_atxtabxsigexkomm = { label: "atxtabxsigexkomm",
    opts: settings.defaultOptions, 
    order: 59 };
var lanchart_atxtabxtro = { label: "atxtabxtro",
    opts: settings.defaultOptions, 
    order: 60 };
var lanchart_atxtabxtroxkomm = { label: "atxtabxtroxkomm",
    opts: settings.defaultOptions, 
    order: 61 };
var lanchart_atxtabxvide = { label: "atxtabxvide",
    opts: settings.defaultOptions, 
    order: 62 };
var lanchart_atxtabxvidexkomm = { label: "atxtabxvidexkomm",
    opts: settings.defaultOptions, 
    order: 63 };
var lanchart_languagexrevised = { label: "languagexrevised",
    opts: settings.defaultOptions, 
    order: 64 };
var lanchart_languagexstated = { label: "languagexstated",
    opts: settings.defaultOptions, 
    order: 65 };
var lanchart_syntax = { label: "syntax",
    opts: settings.defaultOptions, 
    order: 66 };
var lanchart_commentsxglobal = { label: "commentsxglobal",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 67 };
var lanchart_globalxturn = { label: "globalxturn",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 68 };
var lanchart_globalxsync = { label: "globalxsync",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 69 };
var lanchart_kontekstxfonetik = { label: "kontekstxfonetik",
    opts: settings.defaultOptions, 
    order: 70 };
var lanchart_variantxfonetik = { label: "variantxfonetik",
    opts: settings.defaultOptions, 
    order: 71 };
var lanchart_variantxfonetikxkontekstxrealiseret = { label: "variantxfonetikxkontekstxrealiseret",
    opts: settings.defaultOptions, 
    order: 72 };
var lanchart_variantxfonetikxkontekstxforventet = { label: "variantxfonetikxkontekstxforventet",
    opts: settings.defaultOptions, 
    order: 73 };
var lanchart_variantxfonetikxr = { label: "variantxfonetikxr",
    opts: settings.defaultOptions, 
    order: 74 };
var lanchart_ledsaet = { label: "ledsaet",
    opts: settings.defaultOptions, 
    order: 75 };
var lanchart_kl = { label: "kl",
    opts: settings.defaultOptions, 
    order: 76 };
var lanchart_kl1 = { label: "kl1",
    opts: settings.defaultOptions, 
    order: 77 };
var lanchart_leksisxogxfraser = { label: "leksisxogxfraser",
    opts: settings.defaultOptions, 
    order: 78 };
var lanchart_ordmarkering = { label: "ordmarkering",
    opts: settings.defaultOptions, 
    order: 79 };
var lanchart_ordmarkering_32 = { label: "ordmarkering_32",
    opts: settings.defaultOptions, 
    order: 80 };
var lanchart_blodt_d = { label: "blodt_d",
    opts: settings.defaultOptions, 
    order: 81 };
var lanchart_blodt_d_32 = { label: "blodt_d_32",
    opts: settings.defaultOptions, 
    order: 82 };
var lanchart_skriftens_or = { label: "skriftens_or",
    opts: settings.defaultOptions, 
    order: 83 };
var lanchart_endelser = { label: "endelser",
    opts: settings.defaultOptions, 
    order: 84 };
var lanchart_endelser_32 = { label: "endelser_32",
    opts: settings.defaultOptions, 
    order: 85 };
var lanchart_ikke = { label: "ikke",
    opts: settings.defaultOptions, 
    order: 86 };
var lanchart_jeg = { label: "jeg",
    opts: settings.defaultOptions, 
    order: 87 };
var lanchart_v = { label: "v",
    opts: settings.defaultOptions, 
    order: 88 };
var lanchart_k = { label: "k",
    opts: settings.defaultOptions, 
    order: 89 };
var lanchart_eevokalisme = { label: "eevokalisme",
    opts: settings.defaultOptions, 
    order: 90 };
var lanchart_oovokalisme = { label: "oovokalisme",
    opts: settings.defaultOptions, 
    order: 91 };
var lanchart_artikel = { label: "artikel",
    opts: settings.defaultOptions, 
    order: 92 };
var lanchart_et = { label: "et",
    opts: settings.defaultOptions, 
    order: 93 };
var lanchart_ede = { label: "ede",
    opts: settings.defaultOptions, 
    order: 94 };
var lanchart_blxdtxd = { label: "blxdtxd",
    opts: settings.defaultOptions, 
    order: 95 };
var lanchart_stxdafv = { label: "stxdafv",
    opts: settings.defaultOptions, 
    order: 96 };
var lanchart_fynskxint = { label: "fynskxint",
    opts: settings.defaultOptions, 
    order: 97 };
var lanchart_palatalisering = { label: "palatalisering",
    opts: settings.defaultOptions, 
    order: 98 };
var lanchart_leksis = { label: "leksis",
    opts: settings.defaultOptions, 
    order: 99 };
var lanchart_v2xxv3 = { label: "v2xxv3",
    opts: settings.defaultOptions, 
    order: 100 };
var lanchart_grammxxkxn = { label: "grammxxkxn",
    opts: settings.defaultOptions, 
    order: 101 };
var lanchart_prxp = { label: "prxp",
    opts: settings.defaultOptions, 
    order: 102 };
var lanchart_mglxvokalkontrast = { label: "mglxvokalkontrast",
    opts: settings.defaultOptions, 
    order: 103 };
var lanchart_fortsxtterint = { label: "fortsxtterint",
    opts: settings.defaultOptions, 
    order: 104 };
var lanchart_ustemtxr = { label: "ustemtxr",
    opts: settings.defaultOptions, 
    order: 105 };
var lanchart_aabaal_prxposition = { label: "aabaal_prxposition",
    opts: settings.defaultOptions, 
    order: 106 };
var lanchart_aabaal_enendelser = { label: "aabaal_enendelser",
    opts: settings.defaultOptions, 
    order: 107 };
var lanchart_aabaal_endelser = { label: "aabaal_endelser",
    opts: settings.defaultOptions, 
    order: 108 };
var lanchart_aabaal_or = { label: "aabaal_or",
    opts: settings.defaultOptions, 
    order: 109 };
var lanchart_aabaal_ordmarkering = { label: "aabaal_ordmarkering",
    opts: settings.defaultOptions, 
    order: 110 };
var lanchart_aux = { label: "aux",
    opts: settings.defaultOptions, 
    order: 111 };
var lanchart_case = { label: "case",
    opts: settings.defaultOptions, 
    order: 112 };
var lanchart_comments = { label: "comments",
    opts: settings.defaultOptions, 
    order: 113 };
var lanchart_epistsxtn = { label: "epistsxtn",
    opts: settings.defaultOptions, 
    order: 114 };
var lanchart_semvar = { label: "semvar",
    opts: settings.defaultOptions, 
    order: 115 };
var lanchart_generisk = { label: "generisk",
    opts: settings.defaultOptions, 
    order: 116 };
var lanchart_gex = { label: "gex",
    opts: settings.defaultOptions, 
    order: 117 };
var lanchart_giddy = { label: "giddy",
    opts: settings.defaultOptions, 
    order: 118 };
var lanchart_globalxevents = { label: "globalxevents",
    opts: settings.defaultOptions, 
    order: 119 };
var lanchart_events = { label: "events",
    opts: settings.defaultOptions, 
    order: 120 };
var lanchart_gramma_ii = { label: "gramma_ii",
    opts: settings.defaultOptions, 
    order: 121 };
var lanchart_grammatik = { label: "grammatik",
    opts: settings.defaultOptions, 
    order: 122 };
var lanchart_kommentarer = { label: "kommentarer",
    opts: settings.defaultOptions, 
    order: 123 };
var lanchart_ordstil = { label: "ordstil",
    opts: settings.defaultOptions, 
    order: 124 };
var lanchart_part = { label: "part",
    opts: settings.defaultOptions, 
    order: 125 };
var lanchart_sh = { label: "sh",
    opts: settings.defaultOptions, 
    order: 126 };
var lanchart_trxdk = { label: "trxdk",
    opts: settings.defaultOptions, 
    order: 127 };
var lanchart_turn = { label: "turn",
    opts: settings.defaultOptions, 
    order: 128 };
var lanchart_uncertainxtranscription = { label: "uncertainxtranscription",
    opts: settings.defaultOptions, 
    order: 129 };
var lanchart_variantxleksikalsk = { label: "variantxleksikalsk",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 130 };
var lanchart_sync = { label: "sync",
    opts: settings.defaultOptions, displayType: "hidden",
    order: 131 };

console.log('Mode file: Individual corpus configs');


settings.corpora.lanchart_amager = {
    id : "lanchart_amager",
    title : "LANCHART_AMAGER",
    description : "Korpus af udskrifterne fra Amager-projektet: Amager3: Optagelser fra 2009-2011 | Amager4: Optagelser fra 2011-2013.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        phonetic : lanchart_phonetic,
        aux : lanchart_aux,
        comments : lanchart_comments,
        epistsxtn : lanchart_epistsxtn,
        semvar : lanchart_semvar,
        generisk : lanchart_generisk,
        gex : lanchart_gex,
        giddy : lanchart_giddy,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        trxdk : lanchart_trxdk,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_amda = {
    id : "lanchart_amda",
    title : "LANCHART_AMDA",
    description : "Korpus af udskrifterne fra Amerikadansk-projektet: AmDa-kbl: Danske Stemmer: Optagelser med danske emigranter i Amerika. Kbl er interviewerne, Iver Kjær (XIK) og Mogens Baumann Larsen (XBL). Optagelserne er primært fra 1970&#x27;erne. | AmDa-tk: Danske Stemmer: Samtaler med Tore Kristiansen og danske udvandere i Solvang, Californien. Optaget i 1990.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        languagexrevised : lanchart_languagexrevised,
        languagexstated : lanchart_languagexstated,
        syntax : lanchart_syntax,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_argda = {
    id : "lanchart_argda",
    title : "LANCHART_ARGDA",
    description : "Korpus af udskrifterne fra Argentinadansk-projektet: ArgDa: Danske Stemmer: Optagelser lavet i 2014/2015 med dansktalende bosat i Argentina.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        languagexrevised : lanchart_languagexrevised,
        languagexstated : lanchart_languagexstated,
        syntax : lanchart_syntax,
        commentsxglobal : lanchart_commentsxglobal,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_bornholm = {
    id : "lanchart_bornholm",
    title : "LANCHART_BORNHOLM",
    description : "Korpus af udskrifterne fra Bornholm-projektet: Bornholm: Optagelser Bornholm 2014-15. Under Periferiprojektet.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_bylderup = {
    id : "lanchart_bylderup",
    title : "LANCHART_BYLDERUP",
    description : "Korpus af udskrifterne fra Bylderup-projektet: Bylderup3: Optagelser med 9. klasses-elever i Bylderup. Optaget i 2014.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        globalxturn : lanchart_globalxturn,
        globalxsync : lanchart_globalxsync,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_bysoc = {
    id : "lanchart_bysoc",
    title : "LANCHART_BYSOC",
    description : "Korpus af udskrifterne fra BySoc-projektet: BySoc0:  | BySoc1: BySoc1gl er en københavnerundersøgelse med informanter mellem 25 og 40 år, da de blev optaget i 1987-89. Bysoc1ny er genoptagelser af 24 af disse oprindelige informanter 2005-06. | BySoc2: 19 informanter født mellem 1962 og 1973 (5 AK kvinder, 4 AK mænd, 5 MK kvinder og 5 MK mænd - alle mellem 14 og 14 år). ¶ Informanterne er optaget i 1987/88 og genoptaget i 2006/07. | BySoc3: ",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        iivxsmulxkommentarer : lanchart_iivxsmulxkommentarer,
        iivxkommentarer : lanchart_iivxkommentarer,
        ajmarkering : lanchart_ajmarkering,
        ammarkering : lanchart_ammarkering,
        anrmarkering : lanchart_anrmarkering,
        anmarkering : lanchart_anmarkering,
        engmarkering : lanchart_engmarkering,
        rumarkering : lanchart_rumarkering,
        wmarkering : lanchart_wmarkering,
        dschwadmarkering : lanchart_dschwadmarkering,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        at : lanchart_at,
        atxtabxadj : lanchart_atxtabxadj,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        atxtabxkunnehuske : lanchart_atxtabxkunnehuske,
        atxtabxmene : lanchart_atxtabxmene,
        atxtabxmenexkomm : lanchart_atxtabxmenexkomm,
        atxtabxnogetmed : lanchart_atxtabxnogetmed,
        atxtabxsige : lanchart_atxtabxsige,
        atxtabxsigexkomm : lanchart_atxtabxsigexkomm,
        atxtabxtro : lanchart_atxtabxtro,
        atxtabxtroxkomm : lanchart_atxtabxtroxkomm,
        atxtabxvide : lanchart_atxtabxvide,
        atxtabxvidexkomm : lanchart_atxtabxvidexkomm,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        leksisxogxfraser : lanchart_leksisxogxfraser,
        aux : lanchart_aux,
        case : lanchart_case,
        comments : lanchart_comments,
        epistsxtn : lanchart_epistsxtn,
        semvar : lanchart_semvar,
        generisk : lanchart_generisk,
        gex : lanchart_gex,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        kommentarer : lanchart_kommentarer,
        ordstil : lanchart_ordstil,
        part : lanchart_part,
        sh : lanchart_sh,
        uncertainxtranscription : lanchart_uncertainxtranscription,
        variantxleksikalsk : lanchart_variantxleksikalsk
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


settings.corpora.lanchart_canda = {
    id : "lanchart_canda",
    title : "LANCHART_CANDA",
    description : "Korpus af udskrifterne fra Canadadansk-projektet: CanDa-ch: Danske Stemmer: Optagelser fra sidst i 1990&#x27;erne i New Denmark, New Brunswick, Canada.  ¶ Optagelser fra Dr. Christian Hale, professor emeritus i Scandinavian Studies. | CanDa: Danske Stemmer: Optagelser med dansktalende i Canada foretaget af Iver Kjær (XIK) og Mogens Baumann Larsen (XBL) i 1970&#x27;erne og 1980&#x27;erne. Alle informanter er generation 0 i DGCSS&#x27; generationsforståelse.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        languagexrevised : lanchart_languagexrevised,
        languagexstated : lanchart_languagexstated,
        syntax : lanchart_syntax,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_clarin = {
    id : "lanchart_clarin",
    title : "LANCHART_CLARIN",
    description : "Korpus af udskrifterne fra Clarin-projektet: CLARIN: = Clarin3. Der findes videooptagelser af alle samtaler.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        iivxsmulxkommentarer : lanchart_iivxsmulxkommentarer,
        ajmarkering : lanchart_ajmarkering,
        ammarkering : lanchart_ammarkering,
        anrmarkering : lanchart_anrmarkering,
        anmarkering : lanchart_anmarkering,
        engmarkering : lanchart_engmarkering,
        rumarkering : lanchart_rumarkering,
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        generisk : lanchart_generisk,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_familie = {
    id : "lanchart_familie",
    title : "LANCHART_FAMILIE",
    description : "Korpus af udskrifterne fra Familie-projektet: Familie1: Et familieprojekt med Lykkeskov-familien fra Vinderup.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_hirtshals = {
    id : "lanchart_hirtshals",
    title : "LANCHART_HIRTSHALS",
    description : "Korpus af udskrifterne fra Hirtshals-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_koege = {
    id : "lanchart_koege",
    title : "LANCHART_KOEGE",
    description : "Korpus af udskrifterne fra Køge-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxkommentarer : lanchart_iivxkommentarer,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        leksisxogxfraser : lanchart_leksisxogxfraser,
        comments : lanchart_comments,
        events : lanchart_events,
        grammatik : lanchart_grammatik,
        trxdk : lanchart_trxdk,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_mettemortensen = {
    id : "lanchart_mettemortensen",
    title : "LANCHART_METTEMORTENSEN",
    description : "Korpus af udskrifterne fra Mette Mortensen-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        ammarkering : lanchart_ammarkering,
        anmarkering : lanchart_anmarkering,
        phonetic : lanchart_phonetic,
        aux : lanchart_aux,
        comments : lanchart_comments,
        generisk : lanchart_generisk,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_modsjael = {
    id : "lanchart_modsjael",
    title : "LANCHART_MODSJAEL",
    description : "Korpus af udskrifterne fra Moderne Sjællandsk-projektet: ModSjæl2: Undersøgelse af Moderne Sjællandsk.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        globalxturn : lanchart_globalxturn,
        globalxsync : lanchart_globalxsync,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        leksisxogxfraser : lanchart_leksisxogxfraser,
        comments : lanchart_comments,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        grammatik : lanchart_grammatik,
        sh : lanchart_sh,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_munkebjerg = {
    id : "lanchart_munkebjerg",
    title : "LANCHART_MUNKEBJERG",
    description : "Korpus af udskrifterne fra Munkebjerg-projektet: Munkebjerg3: Optagelser med 9.klasses-elever på Munkebjergskolen i Odense. Optaget i 2014.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_naestved = {
    id : "lanchart_naestved",
    title : "LANCHART_NAESTVED",
    description : "Korpus af udskrifterne fra Næstved-projektet: Næstved1: Tore Kristiansens Næstved-projekt, hvor de gamle optagelser, Næstved1gl, er lavet 1986-89. Informanterne fordeler sig på tre grupper:  ¶ a. Børnegruppen: 36 3.klasses-elever, der blev geninterviewet, da de gik i 9.klasse (nu Næstved25). ¶ b. Ungdomsgruppen: 39 unge fra 8 forskellige undomsuddannelsesinstitutioner, der blev interviewet én gang i 1986 (nu Næstved2). ¶ c. Voksengruppen: 48 voksne, der blev interviewet én gang i 1989 (nu Næstved1). ¶ I Næstved1ny er 34/48 vokseninformanter, 20/36 børneinformanter og 19/39 undomsinformanter geninterviewet.  ¶ Der er lavet en fokusgruppe på 24 af de oprindelige voksne, hvor der dog er suppleret med 5 nye informanter for at have en ligelig fordeling mellem alder, køn og social baggrund. | Næstved25: Tore Kristiansens Næstved-projekt, hvor de gamle optagelser, Næstved1gl, er lavet 1986-89. Informanterne fordeler sig på tre grupper:  ¶ a. Børnegruppen: 36 3.klasses-elever, der blev geninterviewet, da de gik i 9.klasse (nu Næstved25). ¶ b. Ungdomsgruppen: 39 unge fra 8 forskellige undomsuddannelsesinstitutioner, der blev interviewet én gang i 1986 (nu Næstved2). ¶ c. Voksengruppen: 48 voksne, der blev interviewet én gang i 1989 (nu Næstved1). ¶ I Næstved1ny er 34/48 vokseninformanter, 20/36 børneinformanter og 19/39 undomsinformanter geninterviewet.  ¶ Der er lavet en fokusgruppe på 24 af de oprindelige voksne, hvor der dog er suppleret med 5 nye informanter for at have en ligelig fordeling mellem alder, køn og social baggrund. | Næstved2: Tore Kristiansens Næstved-projekt, hvor de gamle optagelser, Næstved1gl, er lavet 1986-89. Informanterne fordeler sig på tre grupper:  ¶ a. Børnegruppen: 36 3.klasses-elever, der blev geninterviewet, da de gik i 9.klasse (nu Næstved25). ¶ b. Ungdomsgruppen: 39 unge fra 8 forskellige undomsuddannelsesinstitutioner, der blev interviewet én gang i 1986 (nu Næstved2). ¶ c. Voksengruppen: 48 voksne, der blev interviewet én gang i 1989 (nu Næstved1). ¶ I Næstved1ny er 34/48 vokseninformanter, 20/36 børneinformanter og 19/39 undomsinformanter geninterviewet.  ¶ Der er lavet en fokusgruppe på 24 af de oprindelige voksne, hvor der dog er suppleret med 5 nye informanter for at have en ligelig fordeling mellem alder, køn og social baggrund. | Næstved3: Optagelser med 9.klasses-elever fra fire skoler i Næstved og omegn. Optagelserne fra 2007 kaldes &quot;Næstved3gl&quot;, da informanterne er interviewet første gang her. ¶ Interviewere er Astrid Ag (XAG), Rikke Lange (XRL) og Andreas Stæhr (XAS).",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        iivxkommentarer : lanchart_iivxkommentarer,
        ajmarkering : lanchart_ajmarkering,
        ammarkering : lanchart_ammarkering,
        anrmarkering : lanchart_anrmarkering,
        anmarkering : lanchart_anmarkering,
        engmarkering : lanchart_engmarkering,
        rumarkering : lanchart_rumarkering,
        wmarkering : lanchart_wmarkering,
        dschwadmarkering : lanchart_dschwadmarkering,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        kontekstxfonetik : lanchart_kontekstxfonetik,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        leksisxogxfraser : lanchart_leksisxogxfraser,
        aux : lanchart_aux,
        case : lanchart_case,
        comments : lanchart_comments,
        generisk : lanchart_generisk,
        gex : lanchart_gex,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        kommentarer : lanchart_kommentarer,
        sh : lanchart_sh,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_odder = {
    id : "lanchart_odder",
    title : "LANCHART_ODDER",
    description : "Korpus af udskrifterne fra Odder-projektet: Odder0:  | Odder1:  | Odder2: 24 informanter født mellem 78 og 81 optaget i 2006. | Odder3: 33 informanter fra 9. klasse og gymnasiet, født mellem 1987 og 1990 og optaget i 2006.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        iivxsmulxkommentarer : lanchart_iivxsmulxkommentarer,
        iivxkommentarer : lanchart_iivxkommentarer,
        ajmarkering : lanchart_ajmarkering,
        ammarkering : lanchart_ammarkering,
        anrmarkering : lanchart_anrmarkering,
        anmarkering : lanchart_anmarkering,
        engmarkering : lanchart_engmarkering,
        rumarkering : lanchart_rumarkering,
        wmarkering : lanchart_wmarkering,
        dschwadmarkering : lanchart_dschwadmarkering,
        xschwadmarkering : lanchart_xschwadmarkering,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        kl1 : lanchart_kl1,
        leksisxogxfraser : lanchart_leksisxogxfraser,
        ordmarkering : lanchart_ordmarkering,
        ordmarkering_32 : lanchart_ordmarkering_32,
        blodt_d : lanchart_blodt_d,
        blodt_d_32 : lanchart_blodt_d_32,
        skriftens_or : lanchart_skriftens_or,
        endelser : lanchart_endelser,
        endelser_32 : lanchart_endelser_32,
        aux : lanchart_aux,
        case : lanchart_case,
        comments : lanchart_comments,
        generisk : lanchart_generisk,
        gex : lanchart_gex,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        kommentarer : lanchart_kommentarer,
        part : lanchart_part,
        sh : lanchart_sh,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_oksboel = {
    id : "lanchart_oksboel",
    title : "LANCHART_OKSBOEL",
    description : "Korpus af udskrifterne fra Oksbøl-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_tinglev = {
    id : "lanchart_tinglev",
    title : "LANCHART_TINGLEV",
    description : "Korpus af udskrifterne fra Tinglev-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        comments : lanchart_comments,
        events : lanchart_events,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_vinderup = {
    id : "lanchart_vinderup",
    title : "LANCHART_VINDERUP",
    description : "Korpus af udskrifterne fra Vinderup-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        aktivitetstype : lanchart_aktivitetstype,
        genre : lanchart_genre,
        interaktionsstruktur : lanchart_interaktionsstruktur,
        makroxsproghandling : lanchart_makroxsproghandling,
        samtaletype : lanchart_samtaletype,
        udsigelse : lanchart_udsigelse,
        iivxaigxkommentarer : lanchart_iivxaigxkommentarer,
        iivxsmuxkommentarer : lanchart_iivxsmuxkommentarer,
        ajmarkering : lanchart_ajmarkering,
        ammarkering : lanchart_ammarkering,
        anrmarkering : lanchart_anrmarkering,
        anmarkering : lanchart_anmarkering,
        engmarkering : lanchart_engmarkering,
        rumarkering : lanchart_rumarkering,
        wmarkering : lanchart_wmarkering,
        dschwadmarkering : lanchart_dschwadmarkering,
        xschwadmarkering : lanchart_xschwadmarkering,
        phonetic : lanchart_phonetic,
        emphasis : lanchart_emphasis,
        at : lanchart_at,
        atxtabxekspl : lanchart_atxtabxekspl,
        atxtabxeksplxkomm : lanchart_atxtabxeksplxkomm,
        variantxfonetik : lanchart_variantxfonetik,
        variantxfonetikxkontekstxrealiseret : lanchart_variantxfonetikxkontekstxrealiseret,
        variantxfonetikxkontekstxforventet : lanchart_variantxfonetikxkontekstxforventet,
        variantxfonetikxr : lanchart_variantxfonetikxr,
        ledsaet : lanchart_ledsaet,
        kl : lanchart_kl,
        endelser : lanchart_endelser,
        ikke : lanchart_ikke,
        jeg : lanchart_jeg,
        v : lanchart_v,
        k : lanchart_k,
        eevokalisme : lanchart_eevokalisme,
        oovokalisme : lanchart_oovokalisme,
        artikel : lanchart_artikel,
        aux : lanchart_aux,
        comments : lanchart_comments,
        epistsxtn : lanchart_epistsxtn,
        generisk : lanchart_generisk,
        gex : lanchart_gex,
        globalxevents : lanchart_globalxevents,
        events : lanchart_events,
        gramma_ii : lanchart_gramma_ii,
        grammatik : lanchart_grammatik,
        ordstil : lanchart_ordstil,
        part : lanchart_part,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_vissenbjerg = {
    id : "lanchart_vissenbjerg",
    title : "LANCHART_VISSENBJERG",
    description : "Korpus af udskrifterne fra Vissenbjerg-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        aux : lanchart_aux,
        comments : lanchart_comments,
        events : lanchart_events,
        uncertainxtranscription : lanchart_uncertainxtranscription
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


settings.corpora.lanchart_vollsmose = {
    id : "lanchart_vollsmose",
    title : "LANCHART_VOLLSMOSE",
    description : "Korpus af udskrifterne fra Vollsmose-projektet: Vollsmose3: Optagelser med 9. klasses-elever på Abildgårdskolen i Vollsmose. Optaget i 2014 og 2015.",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        et : lanchart_et,
        ede : lanchart_ede,
        blxdtxd : lanchart_blxdtxd,
        stxdafv : lanchart_stxdafv,
        fynskxint : lanchart_fynskxint,
        palatalisering : lanchart_palatalisering,
        leksis : lanchart_leksis,
        v2xxv3 : lanchart_v2xxv3,
        grammxxkxn : lanchart_grammxxkxn,
        prxp : lanchart_prxp,
        mglxvokalkontrast : lanchart_mglxvokalkontrast,
        fortsxtterint : lanchart_fortsxtterint,
        ustemtxr : lanchart_ustemtxr,
        comments : lanchart_comments,
        events : lanchart_events,
        kommentarer : lanchart_kommentarer,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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


settings.corpora.lanchart_aabenraaaalborg = {
    id : "lanchart_aabenraaaalborg",
    title : "LANCHART_AABENRAAAALBORG",
    description : "Korpus af udskrifterne fra Aabenraa-Aalborg-projektet",
    within :  {"text": "text", "sentence": "sentence"},
    context : {"3 sentence": "3 sentence"}, //defaultContext,
    attributes : {
        real_ipa : lanchart_real_ipa,
        ipa : lanchart_ipa,
        ttt : lanchart_ttt,
        redpos : lanchart_redpos,
        pos : lanchart_pos,
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
        phonetic : lanchart_phonetic,
        aabaal_prxposition : lanchart_aabaal_prxposition,
        aabaal_enendelser : lanchart_aabaal_enendelser,
        aabaal_endelser : lanchart_aabaal_endelser,
        aabaal_or : lanchart_aabaal_or,
        aabaal_ordmarkering : lanchart_aabaal_ordmarkering,
        comments : lanchart_comments,
        events : lanchart_events,
        turn : lanchart_turn,
        uncertainxtranscription : lanchart_uncertainxtranscription,
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
