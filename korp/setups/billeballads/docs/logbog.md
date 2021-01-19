# Logbog over arbejdet med Jens Billes visebog

Philip Diderichsen, primo 2021



## Gjort

- Indsat links fra https://cst.dk/dighumlab/duds/DFK/Dorthe/html/JensBille.htm i `DUDSDFK_BILLall.cqp`.
- Indekseret `DUDSDFK_BILLall.cqp` i CWB i Docker.
- Konfigureret Korp-frontenden til at vise linkene i højreboksen. (Base-url tilføjes i default_mode.js).
- Rettet kategorier i udvidet søgning til noget mere forståeligt.
- Lagt kildeform, neutral form og lemmaform ind i en samlet visning i højreboksen.


## Bugs

- Forsøgt at få  `within` til at fungere, men uden held. Det virkede forbigående, men jeg har ikke kunnet få det til at fungere sidenhen.
- Ordklasser i højreboksen vises kun korrekt som det oversatte label i få tilfælde (Interjektion, Uden ordklasse, Uvis ordklasse, Verbum). Resten vises som den rå form fra opmærkningen. Dette på trods af at alle oversættelser vises korrekt i menuen i udvidet søgning.
- "stn|pers|bn" : "PROPN", dvs. gruppering af stn, pers og bn i en samlet ordklasse i frontenden, virker i menuen i udvidet søgning (hvor de får samlekategorien "Sted-/Person-/Broknavn"), men ikke i højreboksen. I højreboksen vises den rå kategori fra opmærkningen -- hhv. stn, pers og bn.