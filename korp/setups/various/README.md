# Korp med testkorpus

## Kør Docker

Kør her:

```
docker-compose up -d --build
```

Så kører der en backend med CWB og en frontend med Korp.

Hvis man vil stoppe docker-backenden og -frontenden, gør man følgende:

```
docker container ls  # Find ud af containernes navne, fx various_backend_1 og various_frontend_1.
docker container stop various_backend_1 && docker container stop various_frontend_1  # Stop dem.
```

Scriptet start.sh i backenden kører tre indekseringsscripts:

* encode_testcorpus.sh (Indekserer et testkorpus bestående af nogle kapitler fra Danmarks grundlov)
* encode_MEMOtestcorpus
* encode_LANCHARTtestcorpus.

Dette vil kun virke hvis de relevante vrt-filer ligger i backend/corpora/annotated, hhv.: 

* DK.constitution.tabulator.vrt
* Memo-testkorpus-1-brill-korp-alle-filer-i-et-korpus.xml
* vrt_out.txt


## MeMo-korpusset

### Hele korpusset i en fil

MEMO-testkorpusset kan hentes med svn hvis man er på VPN (lægges i backend/corpora/annotated):

```
cd backend/corpora/annotated
svn export svn://norsdivsvn01fw.unicph.domain/MEMOcorpus/trunk/Testkorpus/Memo-testkorpus-1-brill-korp-alle-filer-i-et-korpus.xml .
```

### Korpusset som individuelle filer

Korpusset som individuelle filer (en fil pr. roman) hentes sådan:

```
cd backend/corpora/annotated
svn export svn://norsdivsvn01fw.unicph.domain/MEMOcorpus/trunk/Testkorpus/Brill-all
```


