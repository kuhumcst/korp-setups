# Mappen transformation

Her lægges datafiler, bl.a. fra trusselsprojektet, sammen med programmer der kan transformere dem til det format der indlæses i CWB (Corpus Workbench).


## Filer fra trusselsprojektet hentes via Subversion

Mappen "transformation" indeholder ikke datafiler når den hentes fra Github.

Mappen "threats" med de relevante filer hentes automatisk når Korp bygges i Docker.

Bemærk: 

- Det er nødvendigt at være på KU's net (dvs. på KUA eller via VPN) for at filerne kan hentes, da de hentes fra en beskyttet server på NorS (vores Subversionserver).
- Subversion skal være installeret.
- Filerne hentes ikke hvis der allerede findes en mappe ved navn "threats".
