# LANCHART-setuppet

Korp-setup til LANCHART-dataene.

Philip Diderichsen, februar 2020

## OBS

- Issue med tomme opmærkninger. cwb-encode ændrer tomme opmærkninger til `__UNDEF__`. Man kan således ikke umiddelbart skelne mellem tomme og ikke-tomme intervaller.
- Issue med at "kompilere baseret på" IPA og TtT. Er tegnene i de tiers for mærkelige? (Der er også problemer med det andre steder, fx i Jens Billes visebog).


## Projektstruktur

OBS: Alt i "corpora" genereres af koden i repoet https://bitbucket.org/philip_diderichsen/parse_textgrids.

```
lanchart/
├── corpora                        # Korpusdata og -scripts (git-ignores)
│   ├── data                       # Encodede korpusdata
│   │   ├── lanchart_amager
│   │   ├── ...
│   │   └── lanchart_vollsmose
│   ├── encodingscripts
│   │   └── encode_all_lanchart_corpora.sh  # Script til at encode korpusdata i CWB
│   ├── registry                   # CWB-registry 
│   │   ├── lanchart_amager
│   │   ├── ...
│   │   └── lanchart_vollsmose
│   ├── trenddiagramdata           # Data til tidslinjegrafen
│   │   ├── datetime.tsv
│   │   └── date.tsv
│   └── vrt                        # Annoterede korpusfiler
│       ├── lanchart_amager.vrt
│       ├── ...
│       └── lanchart_vollsmose.vrt
├── docker-compose.yml             # Docker-compose-fil til at bygge Docker-setuppet
├── frontend
│   ├── app
│   │   ├── config.js
│   │   ├── modes
│   │   │   ├── common.js
│   │   │   └── default_mode.js    # Korp-konfiguration af LANCHART-korpusset
│   │   └── translations           # Oversættelser af labels og variable
│   ├── Dockerfile                 # Frontend-serverens Docker-fil
│   └── start.sh                   # Script til at starte Korp-instansen
├── partitur                       # Dockerized Flask-app til partiturvisning
│   ├── Dockerfile
│   └── start.sh
└── README.md

```

## Kør LANCHART-setuppet i Docker

Husk at stoppe evt. kørende docker-containere på port 1234 og port 9111. (Brug `docker-compose down` i den relevante setup-mappe).

Det grundlæggende Korp-docker-image skal være bygget og tilgængeligt før det nedenstående vil virke. Se `docker-compose.yml` i `infrastructure/korp`.

Byg det specifikke Korp-setup i lanchart-mappen. Husk env-variablen `DB_PATH` med Partitur-appens db-sti. (Partitur-appen afhænger af: <https://bitbucket.org/philip_diderichsen/parse_textgrids> (kode der genererer den SQLite-db med korpusdata som `DB_PATH` peger på); <https://bitbucket.org/philip_diderichsen/lanchart_partitur> (kode til at bygge partitur-appen. Vil blive klonet ind i containeren partitur).

Kør herefter encodingscriptet `encode_all_lanchart_corpora.sh`, hvilket indlæser diverse LANCHART-vrt-filer i CWB i Docker-backend-containeren.

```
cd setups/lanchart
DB_PATH=/norsdivdata/parse_textgrids_output/output docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_all_lanchart_corpora.sh
```

OBS: Da variablen `DB_PATH` ikke bruges i containeren, kan der komme en advarsel (`WARNING: The DB_PATH variable is not set. Defaulting to a blank string.`"). Det kan ignoreres.

OBS: Anden envvar-synteks i Windows PowerShell:

```
cd docker-partitur
$env:DB_PATH='C:\custom_software\parse_textgrids\output' ; docker-compose up -d --build
```


Nu kan LANCHART-korpusset tilgås i Korp på http://localhost:9111, og backenden på http://localhost:1234.

Med det korrekte Apache-setup på norsdivweb01fl kan det tilgås på https://lanchartkorp.ku.dk, og backenden på https://lanchartkorp.ku.dk/backend.


## Korp-konfiguration

I `frontend` konfigureres korpusserne i Korp-frontenden.

- I `config.js` specificeres de korpusfaner der skal være, i settings.modeConfig. Og settings.korpBackendURL sættes til https://lanchartkorp.ku.dk/backend (eller localhost hvis der udvikles lokalt).
- I `common.js` har jeg fjernet en del ting der ikke virkede relevante.
- I `default_mode.js` specificeres diverse attributter til LANCHART-korpusset.

Husk at validere diverse javascript-filer for at undgå at se underlige fejl i javascript-konsollen. En særlig gotcha er at variable nu bruger camelcase i stedet for snakecase, fx `settings.preselectedCorpora` i stedet for `settings.preselected_corpora`.

Husk ift. håndholdt styling af attributter i højrepanelet: The S-attrs used here should be kept under structAttributes in the corpora. Avoid displaying them twice by setting hideSidebar: true in the attribute definitions.



## Mappen corpora

Mappen corpora bliver mappet til /opt/corpora i Docker-imaget. Læg encodingklare VRT-filer i corpora/vrt.

