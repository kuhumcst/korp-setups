# Korp med trusselsdata

Det følgende er en vejledning i at sætte Korp op i Docker med data fra trusselsprojektet. Løsningen er testet på Windows og Mac.

> **OBS**: Der er forskel på Windows og andre styresystemer (Mac og Linux). Det nedenstående er skrevet med udgangspunkt i Windows. Således er der fx i kommandoer som `cd infrastructure\korp` brugt backslash. På Mac og Linux bruges der i stedet almindelig skråstreg. (Tjek også om ";" i kommandoer virker i PowerShell!).

## Byg Korp i Docker

- På en Windowsmaskine skal Windows Subsystem for Linux være installeret, og det SKAL være version 2 (WSL 2). Sørg også for, uanset styresystem, at have installeret *Docker*, *Git*, *Subversion* (og på Windows evt. *TortoiseSVN*). Det er alt sammen gratis software. Søg på nettet for at finde vejledninger i at installere programmerne.
(Når Docker installeres på Windows, kommer der muligvis en besked om noget med "Docker Filesharing". Docker skal have adgang til filsystemet for at kunne oprette de filer serverne installeres i. Så man skal enten godkende Filesharing eller tage Filesharing ad notam, dvs. vælge "Don't show again").

- Hent Korp-koden fra Github: Opret en ny mappe (Windows: på C-drevet, fx `C:\MinKorp`; Mac: fx `/Users/<dit brugernavn>/MinKorp`). Åbn en terminal (Windows: PowerShell, skal køres som administrator; Mac: Terminal) og stil dig ned i den nye mappe vha. kommandoen `cd C:\MinKorp`. (Giver det problemer, så søg på nettet efter "switch directory PowerShell" eller lign.). Kør herefter følgende kommando (hvis begrebet "køre en kommando" ikke giver mening, så søg på nettet efter fx "how to run command in terminal"):
`git clone https://github.com/kuhumcst/infrastructure.git`
Koden downloades nu. I terminalen skal du derefter stille dig ned i mappen `korp` vha. kommandoen `cd infrastructure\korp`.

- Nu skal fundamentet for Docker-installationen bygges. Det skal kun gøres én gang, hvis alt ellers går vel. Kør følgende kommando. Det vil tage adskillige minutter (der kommer en masse output inkl. nogle advarselsbeskeder. De kan igoreres):
`docker-compose build`

- Hvis strømmen af output slutter med følgende besked, er alt gået godt.
`Successfully tagged korp_frontend_base:latest`

- Hvis alt ikke er gået godt, så prøv i første omgang at køre den samme kommando igen:
`docker-compose build`. Hvis det ikke hjælper, så spørg om hjælp :)

- Nu er Korp med frontend (brugerflade) og backend (database) bygget i en generisk version. Herefter skal dit specifikke Korp-setup bygges ovenpå. Stil dig først ned i dit projekts mappe. Hvis projektet fx er trusselsprojektet, så stil dig ned i `threats` vha. kommandoen `cd setups\threats`. Kør herefter følgende kommandoer (også her kommer der advarselsbeskeder der kan ignoreres). **OBS**: På dette trin er det nødvendigt at være på KU's netværk, evt. over VPN (for at kunne hente de ikke-fortrolige trusselskorpusser via Subversion).
`docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_threats.sh`

- Hvis alt er gået godt med at bygge Korp-setuppet, står der et sted i slutningen af outputtet:
`Creating threats_frontend_1 ... done`

- Hvis alt er gået godt med at indlæse trusselskorpusserne, står der helt til sidst:
`Done encoding THREATS_KAR`

- Hvad betyder ovenstående kommando?
    - `docker-compose up` er den primære kommando, der starter serverne bag Korp.
    - `-d` skjuler outputtet fra byggeprocessen og outputtet fra kørende servere så det ikke overtager terminalen.
    - `--build` får Docker til at bygge serveren, ikke bare starte den.
    - `docker-compose exec -d backend bash ...` kører en kommando i backend-serveren, her kommandoen `/opt/corpora/encodingscripts/encode_threats.sh`, som indlæser trusselskorpusserne i Korp-backenden (databasen). 

- Trusselssetuppet af Korp er nu bygget, og Korp kan tilgås på http://localhost:9111. Man kan se backenden (en liste af de korpusser der er tilgængelige i CWB) på http://localhost:1234.



## Stop systemet

Dockerserverne bag Korp kan stoppes med følgende kommando.

`docker-compose down`

Der vil så ikke længere være noget at se på http://localhost:9111 og http://localhost:1234.


## Start systemet

Dockerserverne kan startes igen med følgende kommando. (Husk at stå i mappen `C:\MinKorp\infrastructure\korp\setups`). Serverne skal ikke bygges fra bunden, men det vil alligevel tage et par minutter at starte Korp. Herefter vil der igen være liv i Korp (http://localhost:9111) og CWB-backenden (http://localhost:1234).

`docker-compose up -d`


## Genstart systemet

Man kan stoppe og starte i ét hug ved at kombinere kommandoerne:

`docker-compose down ; docker-compose up -d`


## Byg alt forfra

Hvis noget går i skuddermudder, så prøv at bygge hele Dockerinfrastrukturen forfra vha. følgende kommandoer.

- Fjern hele Dockerinfrastrukturen:
`docker-compose down ; docker image prune -af`

- Stil dig i `korp`-mappen:
`cd C:\MinKorp\infrastructure\korp`
 
- Byg den grundlæggende Korp-infrastruktur. Hvis noget fejler, så prøv samme kommando igen.
`docker-compose build`

- Stil dig ned i threats-mappen:
`cd setups\threats`

- Byg det specifikke Korp-setup:
`docker-compose up -d --build ; docker-compose exec backend bash /opt/corpora/encodingscripts/encode_threats.sh`

- Nu kan Korp igen tilgås på http://localhost:9111, og backenden på http://localhost:1234.



## Tilføj nye data/ændringer i backenden

Når Korp er bygget, kan nye korpusser, fx fortrolige korpusser, tilføjes som følger -- uden at stoppe serverne. Rettede korpusser kan tilføjes på samme måde.

1. Læg korpussets XML-filer i en mappe under "threats". Ligesom filerne fra Facebook ligger i `corpora\transformation\threats\Trusler-fra-Facebook\FAC-korpus`, skal de nye filer ligge i `corpora\transformation\threats\XXXXXX\YYYY-korpus`.
2. Kopier filen `parametre-EKSEMPEL.txt`. Udfyld med værdier der er aktuelle for det nye korpus. Gem filen i mappen `parametre` som `YYYY-parametre.txt` (a la `FAC-parametre.txt` -- "YYYY" skal passe til mappenavnet YYYY-korpus).
3. Stå i mappen `C:\MinKorp\infrastructure\korp\setups`, og kør kommandoen `docker-compose exec -d backend bash /opt/corpora/encodingscripts/encode_threats.sh` for at generere alle korpusfiler forfra og indlæse dem i CWB.
4.  Det nye korpus skal nu tilføjes i Korps konfigurationsfiler for at dukke op i Korp. Det foregår i frontenden. I mappen `C:\MinKorp\infrastructure\korp\setups\threats\app\frontend\modes` findes filen `default_mode.js`. Prøv at søge i denne fil efter `threats_fac`, som er Facebook-korpussets ID. Alle de steder hvor der står `threats_fac`, er der konfigureret noget for Facebookdataene. Tilsvarende konfigurationer skal oprettes for det nye korpus. Vi antager i det følgende at det nye korpus-ID er `threats_yyyy` (`threats_` efterfulgt af korpusnavnet `YYYY` (jf. ovenfor) -- alt med små bogstaver):
	- Korpusset skal tilføjes i listen `contents` -- indsæt `"threats_yyyy"` i den kommaseparerede liste.
	- Korpusset skal specificeres med ID, titel, beskrivelse og attributter. Kopier hele blokken der starter med `settings.corpora.threats_fac` og slutter med `truStructAttributes };`, og erstat `threats_fac` med `threats_yyyy` alle steder.
5. Til sidst skal Korp-setuppet bygges igen: `docker-compose down ; docker-compose up -d --build`. Efter få minutter er Korp klar igen, nu med det nye (eller rettede) korpus.


## Ændringer i frontenden

Følgende kommando stopper serverne og bygger dem op igen ovenpå det generiske Korp-setup, nu med evt. ændringer i frontenden. (Det går relativt hurtigt). Det kan fx være en anden benævnelse af en attribut, fjernelse af et korpus fra korpusvælgeren eller lign.

Lav dine ændringer, og kør herefter kommandoen fra mappen `C:\MinKorp\infrastructure\korp\setups`.

`docker-compose down ; docker-compose up -d --build`


