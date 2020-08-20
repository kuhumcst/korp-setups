# Mappen corpora

Læg dine korpusser her; corpora bliver mappet til /opt/host_corpora i Docker-imaget.

Der følger et lille testkorpus med denne installation bestående af tre tekster, nemlig de tre første kapitler af Danmarks grundlov.

## Indhold

- raw: Tekstversion af korpusser.
- annotated: Annoteret tekstversion af korpusser.
- data: Korpusser der er encodet som binære filer af toolet cwb-encode.
- registry: Her holdes der styr på de korpusser der er encodet så CWB kan finde dem.
- encodingscripts: Indeholder et fungerende bash-script der encoder det annoterede testkorpus annotated\DK.constitution.tabulator.vrt i CWB.

## Encoding af testkorpusset

Kør følgende:

```
cd /opt/host_corpora
encodingscripts/encode_testcorpus.sh
```

Se scriptet encode_testcorpus.sh for detaljer om hvordan annoterede filer processeres af cwb-encode.

## Om grundlovskorpusset

Grundlovskorpusset er klippet fra https://www.ft.dk/da/folkestyret/grundloven-og-folkestyret/grundloven-med-forklaringer.

Det er opmærket via https://clarin.dk/clarindk/toolchains-wizard.jsp > Lemmatiser (i løbende tekst, inkl. POS-tags). Formatet ord.pos.lem.TABULATOR er anvendt.

Herefter er det forsynet med <text>-mærker (et pr. kapitel), <paragraph>-mærker og <stk>-mærker (mindst et pr. paragraf).


Philip Diderichsen, august 2020