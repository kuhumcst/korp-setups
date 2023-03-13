# LANCHART-setuppet

Philip Diderichsen, marts 2023

Følgende gælder primært for setuppet "setups/lanchart". Det samme gælder dog for setuppet "setups/lancharttest", bortset fra at Korp lokalt kører på port 19111, backenden på 11234 og partituret på 15005. Og på serveren kører det på lanchartpartitur.ku.dk i stedet for lanchartkorp.ku.dk.

Korp-setup til LANCHART-dataene. Korp med talesprogsdata fra Sprogforandringscentret (LANCHART-korpusset) bygges kort fortalt i tre trin:

1. Byg grundlæggende Docker-images til Korps backend og frontend.
2. Generer korpusdata vha. <bitbucket.org/philip_diderichsen/parse_textgrids>.
3. Byg og kør det specifikke lanchart-Docker-setup af Korp og indlæs korpusdataene heri.

På serveren norsdivweb01fl.unicph.domain køres 2 og 3 via cron hver nat hvis der er ændringer i dataene. Sprogforandringscentrets Korp er tilgængelig på <lanchartkorp.ku.dk> (bag login).



## Projektstruktur

OBS: Alt i corpora/ genereres af koden i <bitbucket.org/philip_diderichsen/parse_textgrids>.

```
lanchart/
├── corpora                        # Korpusdata og -scripts (git-ignores)
│   ├── data                       # Encodede korpusdata
│   │   ├── lanchart_amager
│   │   ├── ...
│   │   └── lanchart_vollsmose
│   ├── encodingscripts
│   │   ├── encode_all_lanchart_corpora.sh  # Script til at encode korpusdata i CWB
│   │   └── write_trenddiagram_data.sh      # Script til at skrive trenddata
│   ├── registry                   # CWB-registry 
│   │   ├── lanchart_amager
│   │   ├── ...
│   │   └── lanchart_vollsmose
│   ├── sqlitedb
│   │   └── corpora.db
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

Husk at stoppe evt. kørende docker-containere på port 1234 (backend), 9111 (frontend) og 5005 (partitur). (Brug `docker-compose down` i den relevante setups/lanchart/-mappe).


### 1. Byg grundlæggende Docker-images

```
cd korp-setups
docker-compose build
```

Byg helt fra bunden:

```
cd korp-setups
docker-compose build --no-cache
```



### 2. Generer korpusdata

Korpusdataene skal lægges i lanchart/corpora/.

Git clone <bitbucket.org/philip_diderichsen/parse_textgrids> og følg README'en. Der skal bl.a. installeres diverse dependencies i et Python virtual environment, skabes adgang til LANCHART-korpusdataene via Subversion og konfigureres diverse filstier på den givne maskine. Koden genererer vrt-filer såvel som encodingscripts og Korp-konfigurationsscripts.



### 3. Byg og kør det specifikke lanchart-Docker-setup

#### 3.1 Korp-konfiguration

Korpusserne skal konfigureres i lanchart/frontend/ for at blive vist korrekt i Korp-frontenden.

- I `config.js`:
  - Specificer de korpusfaner der skal være, i settings.modeConfig.
  - Sæt settings.korpBackendURL til "https://lanchartkorp.ku.dk/backend" (eller "http://127.0.0.1:1234" hvis der udvikles lokalt).

I `default_mode.js` specificeres diverse attributter til LANCHART-korpusset. Disse genereres automatisk af <bitbucket.org/philip_diderichsen/parse_textgrids>, så her skal ikke gøres noget.

Når der arbejdes med diverse javascript-konfigurationsfiler, så valider dem gerne for at undgå at se underlige fejl i konsollen. En særlig gotcha er at variable nu bruger camelcase i stedet for snakecase, fx `settings.preselectedCorpora` i stedet for `settings.preselected_corpora`.

Husk ift. håndholdt styling af attributter i højrepanelet: The S-attrs used here should be kept under structAttributes in the corpora. Avoid displaying them twice by setting hideSidebar: true in the attribute definitions.


#### 3.2 Byg lanchart-setuppet i Docker

```
cd setups/lanchart
DB_PATH=./corpora/sqlitedb AUDIO_DIR=/mnt/KORPUS/Lydoptagelser docker-compose up -d --build
docker-compose exec backend bash /opt/corpora/encodingscripts/encode_all_lanchart_corpora.sh
docker-compose exec backend bash /opt/corpora/encodingscripts/write_trenddiagram_data.sh
```

Byg det specifikke Korp-setup i lanchart-mappen. Herunder bygges Partitur-appen (koden hentes automatisk fra <bitbucket.org/philip_diderichsen/lanchart_partitur>).

Husk env-variablerme `DB_PATH` med Partitur-appens db-sti og `AUDIO_DIR` med stien til korpussets lydfiler.

Kør så encodingscriptet `encode_all_lanchart_corpora.sh`, hvilket indlæser diverse LANCHART-vrt-filer i CWB i Docker-backend-containeren og `write_trenddiagram_data.sh`, der indlæser data til trenddiagrammet i Korp.

OBS: Da variablen `DB_PATH` ikke bruges i containeren, kan der komme en advarsel (`WARNING: The DB_PATH variable is not set. Defaulting to a blank string.`"). Det kan ignoreres.

OBS: Anden envvar-syntaks i Windows PowerShell:

```
cd docker-partitur
$env:DB_PATH='C:\custom_software\parse_textgrids\output' $env:AUDIO_DIR='C:\lydfiler' ; docker-compose up -d --build
```


Efter lidt opstarttid kan LANCHART-korpusset tilgås i Korp på <localhost:9111>, backenden på <localhost:1234> og Partitur-appen på <localhost:5005>.



#### 3.3 Apache-konfiguration

Med det korrekte Apache-setup på norsdivweb01fl kan Korp tilgås på <lanchartkorp.ku.dk>,  backenden på <lanchartkorp.ku.dk/backend> og Partitur på <lanchartkorp.ku.dk/partitur>.





## Mappen corpora

Mappen corpora bliver mappet til /opt/corpora i Docker-imaget. Læg encodingklare VRT-filer i corpora/vrt.

