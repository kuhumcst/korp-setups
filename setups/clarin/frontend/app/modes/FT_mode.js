settings.primaryColor = "whitesmoke";
settings.primaryLight = "whitesmoke";
settings.autocomplete = false;
settings.lemgramSelect = false;
settings.wordpicture = false;



settings.corpora = {};
settings.corporafolders = {};

settings.preselectedCorpora = ["ft_korpus"];

//settings.corporafolders.ft_korpus = {
//        title : "The Danish Parliament Corpus 2009 - 2017",
//		contents : ["ft_korpus"],
//        description : "The Danish Parliament Corpus 2009 - 2017, v2, w. subject area annotation contains transcripts of parliamentary speeches of the Danish Parliament, Folketinget, session 20091 to 20161 (6/10 2009 – 7/9 2017) downloaded from the Danish Parliaments ftp server: ftp://oda.ft.dk."
//};

settings.corpora.ft_korpus = {
    id : "FT_KORPUS",
    title : "Folketingstidende",
    description : "Taler fra folketingssalen 2009 - 2017",
    //within : settings.defaultWithin,
    //context : settings.defaultContext,
    within : { "sentence" : "sentence" }, //settings.ftWithin,
    context : { "1 sentence" : "1 sentence" }, //settings.ftContext,
    attributes : {},
    structAttributes : {
		text_agendaTitle : {label : "FTagendaTitle", order : 1},
		text_subject1 : {label : "FTsubject1", order : 2},
		text_subject2 : {label : "FTsubject2", order : 3},
		text_name: {label : "FTname", order : 4},
		text_party : {label : "FTparty", order : 5},
		text_role : {label : "FTrole", order : 6},
		text_MPtitle : {label : "FTMPtitle", order : 7},
		text_gender : {label : "FTgender", order : 8},
		text_age : {label : "FTage", order : 9},
		text_birth : {label : "FTbirth", order : 10},
		text_date : {label : "FTdate", order : 11},
		text_timeFrom : {label : "FTtimeFrom", order : 12},
		text_timeTo : {label : "FTtimeTo", order : 13},
		text_duration : {label : "FTduration", order : 14},
		p_idp : {label : "FTparagraph_id", order : 15},
        sentence_id : {label : "FTsentence_id", order : 16},
		text_caseNo : {label : "FTcaseNo", order : 17},
		text_caseType : {label : "FTcaseType", order : 18},
		text_agendaItemNo : {label : "FTagendaItemNo", order : 19},
		text_title : {label : "FTtitle", order : 20}
    }
};


settings.corpusListing = new CorpusListing(settings.corpora);
