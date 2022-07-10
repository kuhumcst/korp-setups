# Korp med trusselsdata

Philip Diderichsen, november 2021

Processer data fra trusselsprojektet og læg dem ind i Korp -- lokalt på privat maskine og offentligt i Clarins Korp.

OBS!
På Windows skal fx Git Bash eller Cygwin være installeret med Perl for at kunne processere korpusdataene med Dorte Haltrups Perl-scripts. Desuden skal Windows Subsystem for Linux være installeret, og det SKAL være version 2 (WSL 2). Sørg også for, uanset styresystem, at have installeret Docker, Git, Subversion (og på Windows evt. TortoiseSVN).


## 1. Processer trusselskorpusser (trusselsadmin)

1. Hent eller opdater `svn://norsdivsvn01fw.unicph.domain/threats/` (svn checkout/svn update)
2. Opret mappen `threats/korpusdata/` og læg mapper med XML-data i `threats/korpusdata/xml/` jf. nedenstående filtræ. (NB: Mappen SKAL hedde `korpusdata/` da denne ignoreres af Subversion vha. svn:global-ignores. På den måde 'opdages' følsomme data ikke af Subversion).
3. Lav en kopi af filen `parametre-EKSEMPEL.txt` for hvert korpus, og læg filerne i `threats/parametre/`. Udfyld med værdier der passer til det enkelte korpus. Gem filerne med navne som `FAC-parametre.txt` ("XXX-parametre" skal passe til mappenavnet XXX-korpus). (NB: Indholdet af `parametre/` ignoreres vha. svn:global-ignores-mønsteret *-parametre.txt. Det samme gælder `filer.txt` og `parameterfiler.txt` i `programmer/`).
4. Opret mappen `threats/korpusdata/vrt/`.
5. Åbn en terminal (Git Bash eller Cygwin på Windows) (Perl skal være installeret); skift til `threats/programmer/`
6. Kør: `perl RUN-korp.pl`. Transformerede VRT-filer til CorpusWorkbench ligger nu i `korpusdata/vrt/`
7. Opret mappen `threats/korpusdata/vrt_rettet/`.
8. Kør Davids nummereringstagger (som passende kan placeres i fx `C:\Program Files\Davids nummereringstagger\`). Outputtet sendes til mappen `korpusdata/vrt_rettet/`.
9. Søg og erstat evt. yderligere fejl vha. Notepad++.

```
korpusdata/
    ├── vrt
    │   ├── THREATS_ART.vrt
    │   ├── THREATS_KAR.vrt
    │   ...
    ├── vrt_rettet
    │   ├── THREATS_ART.vrt
    │   ├── THREATS_KAR.vrt
    │   ...
    └── xml
        ├── Trusler-fra-Karnov
        │   ├── KAR-korpus
        │   │   ├── KAR-001.xml
        │   │   ├── ...
        │   │   └── KAR-047.xml
        │   └── KAR-korpus.zip
        ├── Trusselsbeskeder-fra-artikler
        │   ├── ART-korpus
        │   │   ├── ART-001.xml
        │   │   ├── ...
        │   │   └── ART-078.xml
        │   └── ART-korpus.zip
        ...
```


## 2 Byg fundamentet for Korp i Docker (trusselsadmin)

OBS: Når Docker installeres på Windows, kommer der muligvis en besked om noget med "Docker Filesharing". Docker skal have adgang til filsystemet for at kunne oprette de filer serverne installeres i. Så man skal enten godkende Filesharing eller tage Filesharing ad notam, dvs. vælge "Don't show again".

### 2.1 Forbered installation

1. Hent Korp-koden fra Github: Opret en ny mappe (Windows: på C-drevet, fx `C:\MinKorp`; Mac: fx `/Users/<dit brugernavn>/MinKorp`). Åbn en terminal (Windows: PowerShell, skal køres som administrator (eller Git Bash); Mac: Terminal) og stil dig ned i den nye mappe vha. kommandoen `cd C:\MinKorp`. 
2. Kør: `git clone https://github.com/kuhumcst/korp-setups.git`
3. (Dette er kun midlertidigt ..) Kør: `git checkout shadowmaster`.

### 2.2 Byg Docker-fundament 

Nu skal fundamentet for Docker-installationen bygges. Det tager flere minutter, men skal kun gøres én gang.

1. Skift til `korp-setups/`. Kør: `cd korp-setups`.
2.  Kør: `docker-compose build`

Hvis strømmen af output slutter med følgende besked, er alt gået godt.
`Successfully tagged korp_frontend_base:latest`. 
Hvis alt ikke er gået godt, så prøv i første omgang at køre den samme kommando igen: `docker-compose build`. Hvis det ikke hjælper, så spørg om hjælp :)


## 3. Byg Korp med alle trusselskorpusser på privat/beskyttet maskine (trusselsadmin)

Når Korp-fundamentet med frontend (brugerflade) og backend (database) er bygget i en generisk version, skal det specifikke Korp-setup med data fra trusselsprojektet bygges ovenpå.

### 3.1 Byg threats-setuppet og indlæs korpusdata i backenden

De genererede VRT-filer skal kopieres til den relevante mappe i threats-setuppet. Herefter bygges trusselsprojektets Korp-setup, og VRT-filerne indlæses i CWB i backenden af dette. Trusselskorpusserne skal herefter specificeres i Korps konfigurationsfiler i frontenden, og til sidst skal threats-setuppet bygges igen for at få ændringerne i frontenden ind i Docker.


1. Kopier VRT-filerne genereret vha. Dorte Haltrups Perl-scripts fra `korpusdata/vrt_rettet/` til `C:\MinKorp\korp-setups\setups\threats\corpora\vrt`.
2. Skift til `threats`. Kør: `cd C:\MinKorp\korp-setups\setups\threats`
3. Hvis der er tilføjet eller fjernet opmærkningskategorier (fx numincorpus osv.), så opdater `encode_threats.sh` (i `setups/threats/corpora/encodingscripts/`)
3. Byg threats-setuppet af Korp og indlæs VRT-filer. Kør: `docker-compose down ; docker-compose up -d --build ; docker-compose exec -d backend bash /opt/corpora/encodingscripts/encode_threats.sh`.

Hvis alt er gået godt med at bygge Korp-setuppet, står der et sted i slutningen af outputtet:
`Creating threats_frontend_1 ... done`. Hvis alt er gået godt med at indlæse trusselskorpusserne, står der helt til sidst: `Done encoding THREATS_KAR`.

> Hvad betyder ovenstående kommandoer?
        - `docker-compose down` stopper evt. kørende Docker-containere.
        - `docker-compose up` er den primære kommando, der starter serverne bag Korp.
    - `-d` skjuler outputtet fra byggeprocessen og outputtet fra kørende servere så det ikke overtager terminalen.
    - `--build` får Docker til at bygge serveren, ikke bare starte den.
    - `docker-compose exec -d backend bash ...` kører en kommando i backend-serveren, her kommandoen `/opt/corpora/encodingscripts/encode_threats.sh`, som indlæser trusselskorpusserne i Korp-backenden (databasen). 

### 3.2 Konfigurer korpusser i frontenden

De nye korpusser skal nu tilføjes i Korps konfigurationsfiler for at dukke op i Korp. Det foregår i frontenden. I mappen `C:\MinKorp\korp-setups\setups\threats\frontend\app\modes` findes filen `default_mode.js`. Søg i denne fil efter fx `threats_fac`, som er Facebook-korpussets ID. Alle de steder hvor der står `threats_fac`, er der konfigureret noget for Facebookdataene. Tilsvarende konfigurationer skal oprettes for de nye korpusser. Et nyt korpus-ID kunne fx være `threats_yyyy` (`threats_` efterfulgt af korpusnavnet `YYYY` (jf. ovenfor) -- alt med små bogstaver):
- Korpusset skal tilføjes i listen `contents` -- indsæt `"threats_yyyy"` i den kommaseparerede liste.
- Korpusset skal specificeres med ID, titel, beskrivelse og attributter. Kopier hele blokken der starter med `settings.corpora.threats_fac` og slutter med `truStructAttributes };`, og erstat `threats_fac` med `threats_yyyy` alle steder.
- Det samme skal gøres for alle nye korpusser.
- Korpusser der er fjernet, skal også slettes fra `default_mode.js`.

Til sidst skal Korp-setuppet bygges igen: `docker-compose down ; docker-compose up -d --build`. Efter få minutter er Korp klar igen, nu med de nye (eller rettede) korpusser.

- Korp: http://localhost:9111
- Backend: http://localhost:1234.


## 4. Send offentlige trusselskorpusser til indlæsning i Clarin (trusselsadmin)

Truslerne er for en stor dels vedkommende stærkt personfølsomme og skal derfor ikke lægges offentligt ud. Enkelte korpusser kan dog lægges ud offentligt. Disse committes til et Subversion-repositorie til formålet (`svn://norsdivsvn01fw.unicph.domain/threats_public_data/`) og kan herefter lægges i Clarins offentligt tilgængelige Korp af Clarins  korpusadministratorer.

1. svn checkout eller svn update `threats_public_data/` (working copy af `svn://norsdivsvn01fw.unicph.domain/threats_public_data/`) på lokal maskine.
2. Kopier de offentlige XML-data (Trusler-fra-Karnov, Trusselsbeskeder-fra-artikler osv.) til `threats_public_data/xml/`
3. Kopier de offentlige VRT-data fra `korpusdata/vrt` til `threats_public_data/vrt/` og fra `korpusdata/vrt_rettet` til `threats_public_data/vrt_rettet`.
4. Kopier de offentlige data fra `setups/threats/corpora/data` til `threats_public_data/data/`
5. Kopier de offentlige registry-data fra setups/threats/corpora/registry til `threats_public_data/registry/`
6. Kopier `default_mode.js` til `threats_public_data/modes/`
7. Hvis det er ændret, så kopier encodingscriptet `encode_threats.sh` til `threats_public_data/encodingscripts/`
8. svn add alle nye, ikke-versionerede filer.
9. Skub dataene til `svn://norsdivsvn01fw.unicph.domain/threats_public_data/` vha. svn commit.


## 5. Integrer de offentlige threats-data i Clarin-setuppet (Clarin-admin)

Når threats-setuppet fungerer korrekt lokalt og de offentlige korpusser er committet til `svn://norsdivsvn01fw.unicph.domain/threats_public_data/`, kan de lægges ud i Korp på Clarin-serveren som følger. Start med at verificere at alt virker på lokal maskine; skub herefter data til serveren.

### 5.1 Lokal maskine

1. svn-opdater `threats_public_data/` og git pull `.../korp-setups/` på lokal maskine.
2. Kopier `threats_public_data/data/`, `threats_public_data/registry/`, `threats_public_data/encodingscripts/` og `threats_public_data/vrt/` til `.../setups/threats/corpora/` på lokal maskine.
3. Kopier `threats_public_data/modes/default_mode.js` til `.../setups/threats/frontend/app/modes/default_mode.js` på lokal maskine.
4. Fjern alt andet end de offentlige korpusser fra `default_mode.js`.
5. Skift til `setups/threats/`.
6. Byg threats-setuppet på ny: `sudo docker-compose down ; sudo docker-compose up -d --build`.

Hvis alt virker, så git commit de forskellige ændringer i `.../korp-setups/setups/threats/` og git push.

### 5.2 Clarin-server

Skub herefter dataene op på serveren.

1. Kopier `.../setups/threats/frontend/app/modes/default_mode.js` til `.../setups/clarin/frontend/app/modes/threats_mode.js` på lokal maskine.
2. git commit den ændrede `threats_mode.js` og git push.
3. sudo git pull `/opt/corpora/korp-setups/` på serveren.
4. Kopier korpusdata fra `korp/setups/threats/corpora/data/` på lokal maskine til serveren: `scp -r threats_art threats_jeb threats_jtb threats_kar nlpkorp01.nors.ku.dk:/opt/corpora/data/`
5. Kopier registry-indgange fra `korp/setups/threats/corpora/registry/` på lokal maskine til serveren: `scp threats_art threats_jeb threats_jtb threats_kar nlpkorp01.nors.ku.dk:/opt/corpora/registry/`
6. Log ind på serveren, og skift til `korp-setups/setups/clarin/`.
7. Byg clarin-setuppet på ny: `sudo docker-compose down ; sudo docker-compose up -d --build`.

## 6. Kommandoer

### 6.1 Start systemet

Dockerserverne kan startes igen med følgende kommando. (Husk at stå i mappen `C:\MinKorp\korp-setups\setups`). Serverne skal ikke bygges fra bunden, men det vil alligevel tage et par minutter at starte Korp. Herefter vil der igen være liv i Korp (http://localhost:9111) og CWB-backenden (http://localhost:1234).

`docker-compose up -d`

### 6.2 Stop systemet

Dockerserverne bag Korp kan stoppes med følgende kommando.

`docker-compose down`

Der vil så ikke længere være noget at se på http://localhost:9111 og http://localhost:1234.


### 6.3 Genstart systemet

Man kan stoppe og starte i ét hug ved at kombinere kommandoerne:

`docker-compose down ; docker-compose up -d`


### 6.4 Byg alt forfra

Hvis noget går i skuddermudder, så prøv at bygge hele Dockerinfrastrukturen forfra: Fjern hele Dockerinfrastrukturen, skift til `korp/`-mappen og byg den op igen. Byg herefter det specifikke threats-setup af Korp. Kommandoer:

1. Fjern infrastruktur: `docker-compose down ; docker image prune -af`
2. Skift til `korp-setups/`: `cd C:\MinKorp\korp-setups`
3. Byg grundlæggende infrastruktur op igen: `docker-compose build`
4. Skift til `threats/`: `cd setups\threats`
5. Byg threats-setup: `docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_threats.sh`

Nu kan Korp igen tilgås på http://localhost:9111, og backenden på http://localhost:1234.


### 6.5 Ændringer i frontenden

Følgende kommando stopper serverne og bygger dem op igen ovenpå det generiske Korp-setup, nu med evt. ændringer i frontenden. (Det går relativt hurtigt). Det kan fx være en anden benævnelse af en attribut, fjernelse af et korpus fra korpusvælgeren eller lign.

Lav dine ændringer, og kør herefter kommandoen fra mappen `C:\MinKorp\korp-setups\setups`.

`docker-compose down ; docker-compose up -d --build`







