# LANCHART-setuppet

Philip Diderichsen, december 2021

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
│   │   └── encode_all_lanchart_corpora.sh  # Script til at encode korpusdata i CWB
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



## TODO

- Issue med tomme opmærkninger. cwb-encode ændrer tomme opmærkninger til `__UNDEF__`. Man kan således ikke umiddelbart skelne mellem tomme og ikke-tomme intervaller.
- Issue med at "kompilere baseret på" IPA og TtT. Er tegnene i de tiers for mærkelige? (Der er også problemer med det andre steder, fx i Jens Billes visebog).



## Kør LANCHART-setuppet i Docker

Husk at stoppe evt. kørende docker-containere på port 1234 (backend), 9111 (frontend) og 5005 (partitur). (Brug `docker-compose down` i den relevante setups/lanchart/-mappe).


### 1. Byg grundlæggende Docker-images

```
cd korp-setups
docker-compose build
```


### 2. Generer korpusdata

Korpusdataene skal lægges i lanchart/corpora/.

Git clone <bitbucket.org/philip_diderichsen/parse_textgrids> og følg README'en. Der skal bl.a. installeres diverse dependencies i et Python virtual environment, skabes adgang til LANCHART-korpusdataene via Subversion og konfigureres diverse filstier på den givne maskine.



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

Byg det specifikke Korp-setup i lanchart-mappen. Herunder bygges Partitur-appen (koden hentes automatisk fra <bitbucket.org/philip_diderichsen/lanchart_partitur>).

Husk env-variablen `DB_PATH` med Partitur-appens db-sti.

Kør i samme ombæring encodingscriptet `encode_all_lanchart_corpora.sh`, hvilket indlæser diverse LANCHART-vrt-filer i CWB i Docker-backend-containeren.

```
cd setups/lanchart
DB_PATH=./corpora/sqlitedb docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_all_lanchart_corpora.sh
```

OBS: Da variablen `DB_PATH` ikke bruges i containeren, kan der komme en advarsel (`WARNING: The DB_PATH variable is not set. Defaulting to a blank string.`"). Det kan ignoreres.

OBS: Anden envvar-syntaks i Windows PowerShell:

```
cd docker-partitur
$env:DB_PATH='C:\custom_software\parse_textgrids\output' ; docker-compose up -d --build
```


Efter lidt opstarttid kan LANCHART-korpusset tilgås i Korp på <localhost:9111>, backenden på <localhost:1234> og Partitur-appen på <localhost:5005>.

NB: Partitur tilgås via links fra hvert token i Korp. Disse links er hardcodet i config.js til at pege på lanchartpartitur.ku.dk. De vil derfor ikke virke lokalt. (For at se om Partitur virker lokalt, kan man tage querystrengen fra en given lanchartpartitur.ku.dk-adresse og sætte den på localhost:5005.)


#### 3.3 Apache-konfiguration

Med det korrekte Apache-setup på norsdivweb01fl kan Korp tilgås på <lanchartkorp.ku.dk>,  backenden på <lanchartkorp.ku.dk/backend> og Partitur på <lanchartpartitur.ku.dk>.





## Mappen corpora

Mappen corpora bliver mappet til /opt/corpora i Docker-imaget. Læg encodingklare VRT-filer i corpora/vrt.

