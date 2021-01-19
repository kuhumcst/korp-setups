# Jens Bille

Indlæsning af viserne i Jens Billes håndskrift og linkning fra Korp til html-visninger.


# Projektstruktur

I første omgang lægges projektet i setuppet `billeballads` under `infrastructure/korp/setups`.

```
billeballads
├── README.md
├── corpora
│   ├── data                         # Encodede CWB-data
│   ├── encodingscripts              # Script til at indlæse vrt-filer i Korp
│   ├── registry                     # CWB-registry
│   └── vrt                          # Færdige filer med links (output fra "processing")
├── docker-compose.yml
├── docs                             # Ønsker og instrukser fra Dorthe D.; min logbog.
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
    │   ├── encodeBille.sh
    │   └── linking.py               # Lav links i vrt-filer
    └── data
        ├── input                    # Oprindelige vrt-data
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

- Husk at stoppe evt. kørende docker-containere på port 1234 og port 9111. (Brug `docker-compose down` i den relevante setup-mappe).

- Stil dig ned i billeballads-mappen:
`cd setups/billeballads`

- Byg det specifikke Korp-setup:
`docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encodeBille.sh`

- Nu kan viserne tilgås i Korp på http://localhost:9111, og backenden på http://localhost:1234.



# Noter

P.t. i Korp: Kun to testviser ... 

