# Memotest

Indlæsning af romanerne i testkorpusset i Measuring Modernity-projektet (MeMo).


# Projektstruktur

Projektet lægges i setuppet `memotest` under `infrastructure/korp/setups`.

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





# Kør memotest-setuppet i Docker

Husk at stoppe evt. kørende docker-containere på port 1234 og port 9111. (Brug `docker-compose down` i den relevante setup-mappe).

Byg det specifikke Korp-setup i memotest-mappen. Herunder køres to encodingscripts `encode_MEMO_individual_files.sh` og `encode_MEMO_yearcorpora.sh`, der indlæser korpusser fra `corpora/annotated` i CWB i Docker-backend-containeren.

```
cd setups/memotest
docker-compose down ; docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_MEMO_individual_files.sh ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_MEMO_yearcorpora.sh ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_MEMO_fraktur_gold.sh
```

Nu kan romanerne tilgås i Korp på http://localhost:9111, og backenden på http://localhost:1234.



# Noter


