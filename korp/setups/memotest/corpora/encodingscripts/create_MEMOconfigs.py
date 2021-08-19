# -*- coding: UTF-8 -*-
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("corpusname")
args = parser.parse_args()

corpusname = args.corpusname
nameparts = corpusname.split('_')
year = nameparts[-1]
novelname = nameparts[-2]
author = nameparts[-3] if len(nameparts) > 2 else 'diverse'

corpus_id = corpusname.lower()
corpus_title = "{}: {} ({})".format(author, novelname, year)
corpus_description = "Romanen {} af {} fra {}.".format(novelname, author, year)

corpconfig = """
settings.corpora.{id} = {{
    id : "{id}",
    title : "{title}",
    description : "{desc}",
    within : {{ "sentence": "sentence" }},
    context : defaultContext,
    attributes : memocorpAttrs,
    structAttributes : {{
        corpus_id : {{label : "Korpus-id"}},
        text_title : {{label : "Titel"}},
        text_author : {{label : "Forfatter"}},
        text_pseudonym : {{label : "Pseudonym"}},
        text_date : {{label : "Dato"}},
        text_datefrom : {{label : "Datofra"}},
        text_dateto : {{label : "Datotil"}},
        text_timefrom : {{label : "Tidfra"}},
        text_timeto : {{label : "Tidtil"}},
        text_gender : {{label : "Køn"}},
        text_source : {{label : "Kilde"}},
        text_nationality : {{label : "Nationalitet"}},
        text_subtitle : {{label : "Undertitel"}},
        text_pages : {{label : "Sider"}},
        text_illustrations : {{label : "Illustrationer"}},
        text_typeface : {{label : "Skriftsnit"}},
        text_publisher : {{label : "Udgiver"}},
        text_price : {{label : "Pris"}},
        sentence_id : {{label : "Sætning nr."}}
    }}
}};
""".format(id=corpus_id, title=corpus_title, desc=corpus_description)

print(corpconfig)



