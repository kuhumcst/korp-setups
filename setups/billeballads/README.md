# Billeballads

Indlæsning i Korp af viserne i Jens Billes håndskrift og linkning fra Korp til html-visninger.



# Projektstruktur

Projektet udvikles i setuppet `billeballads` under `infrastructure/korp/setups`.

Sidenhen integreres det i clarin-setuppet. Setuppet `billeballads` bevares som dokumentation.

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
    │   └── linking.py               # Lav links i vrt-filer
    └── data
        ├── input                    # Oprindelige vrt-data
        └── resources                # Andre filer med nødvendig info
            └── linklist.json        # Mapping fra visenavne til URL'er
```



# Requirements

Udviklet i Python 3.6

Katalog over de vise-visninger der skal linkes til: https://cst.dk/dighumlab/duds/DFK/Dorthe/html/JensBille.htm

Eksempler på vise-visninger:

- https://cst.dk/dighumlab/duds/DFK/Dorthe/html/BILL1.htm
- https://cst.dk/dighumlab/duds/DFK/Dorthe/html/BILL87.htm

Viser i vrt-format (CWB-format):

Her bruges kun filen `DUDSDFK_BILLall.cqp`, der er en samlet vrt-file med alle viserne. Den originale fil ligger sammen med viserne som individuelle filer (`DUDSDFK_BILL1.cqp`, `DUDSDFK_BILL2.cqp` osv.) i:

`nlpkorp01.nors.ku.dk:/opt/corpora/data2korp/DUDS/DUDSDFK_BILL`



# Tilføj links til visedataene

Inputfilen `DUDSDFK_BILLall.cqp` i `processing/data` transformeres ved at køre pythonscriptet `linking.py`. Resultatet lander i `corpora/vrt`. (Filstier er p.t. hardcodet i `linking.py`).

```
cd billeballads/processing/code
python3 linking.py
```



# Test billeballads-setuppet i Docker

Husk at stoppe evt. kørende docker-containere på port 1234 og port 9111. (Brug `docker-compose down` i den relevante setup-mappe).

Det specifikke setup afhænger af det generelle Korp-setup, som typisk allerede vil være bygget. Hvis ikke, bygges det sådan:

```
cd korp-setups
docker-compose build
```

Byg det specifikke Korp-setup i billeballads-mappen. Herunder køres encodingscriptet `encodeBille.sh`, der indlæser `corpora/vrt/DUDSDFK_BILLall.cqp` i CWB i Docker-backend-containeren.

```
cd korp-setups/setups/billeballads
docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encodeBille.sh
```

Nu kan viserne tilgås i Korp på http://localhost:9111, og backenden på http://localhost:1234.



# Integrer billeballads-setuppet i clarin-setuppet

I produktion lægges Jens Bille-korpusset som en del af clarin-setuppet, som ikke grises til med rå data og processeringsscripts. Gør følgende for at integrere billeballads-setuppet i clarin-setuppet.

1. Generer korpusset ved at køre billeballads-setuppet i Docker som beskrevet ovenfor.
2. Kopier encodet korpus til backenden på Clarin-serveren (nlpkorp01fl): `cp -r billeballads/corpora/data/dudsdfk_billall /opt/corpora/data/ ; cp billeballads/corpora/registry/dudsdfk_billall /opt/corpora/registry/`
3. Lav en ny mode-fil til korpusset/korpustypen under `setups/clarin/frontend/app/modes` (eller nøjes med at redigere en eksisterende). Jeg oprettede den nye mode-fil `medieval_ballads_mode.js`.
4. Rediger settings.modeConfig i `setups/clarin/frontend/app/config.js`. (`localekey: "medieval_ballads", mode: "medieval_ballads"`).
5. Rediger oversættelsesfilerne (`setups/clarin/frontend/app/translations/corpora-da.json` osv.) så alle nye labels har en oversættelse.
6. Byg Clarin-containeren på ny i Docker: `cd setups/clarin ; docker-compose down ; docker-copose up -d --build`.




