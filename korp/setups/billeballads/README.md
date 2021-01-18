# Jens Bille

Indlæsning af viserne i Jens Billes håndskrift og linkning fra Korp til html-visninger.


# Projektstruktur

I første omgang lægges projektet i setuppet `billeballads` under `infrastructure/korp/setups`.

```
billeballads
├── README.md
├── corpora
│   ├── data
│   └── registry
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── app
│   │   ├── config.js
│   │   ├── modes
│   │   │   ├── common.js
│   │   │   └── default_mode.js      # Omdøbt fra old_danish_mode.js
│   │   └── translations
│   │       ├── corpora-da.json
│   │       ├── corpora-en.json
│   │       └── corpora-sv.json
│   └── start.sh
└── processing
    ├── code
    │   ├── encodeBille.sh           # Indlæs cqp-filer i Korp
    │   └── linking.py               # Lav links i cqp-filer
    └── data
        ├── input                    # Rå data
        ├── output                   # Færdige filer med links
        └── resources                # Andre filer med nødvendig info
            └── linklist.json        # Mapping fra visenavne til URL'er
```


# Requirements

Udviklet i Python 3.6

Katalog over viserne: https://cst.dk/dighumlab/duds/DFK/Dorthe/html/JensBille.htm

Eksempler på viser:

- https://cst.dk/dighumlab/duds/DFK/Dorthe/html/BILL1.htm
- https://cst.dk/dighumlab/duds/DFK/Dorthe/html/BILL87.htm

Viser i vrt-format (CWB-format):

Her bruges kun filen `DUDSDFK_BILLall.cqp`, der er en samlet vrt-file med alle viserne. Den originale fil ligger sammen med viserne som individuelle filer (`DUDSDFK_BILL1.cqp`, `DUDSDFK_BILL2.cqp` osv.) i:

`nlpkorp01.nors.ku.dk:/opt/corpora/data2korp/DUDS/DUDSDFK_BILL`


# Kør processen


# Noter

P.t. i Korp: Kun to testviser ... 

