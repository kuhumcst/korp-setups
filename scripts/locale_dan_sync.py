#!/usr/bin/env python3
"""Rebuild locale-dan.json so its key set equals upstream's locale-eng.json.

Usage: scripts/locale_dan_sync.py <upstream locale-eng.json> <config translations dir>

- Keys upstream has and we have: kept (our Danish text).
- Keys upstream dropped: removed from locale-dan.json. Our own custom UI keys
  (used by our patches) are moved to corpora-dan.json / corpora-eng.json,
  which the frontend merges into the same translation table.
- Keys upstream added: taken from NEW_DANISH below; the script fails if one
  is missing, so an upstream bump that adds keys fails loudly.
- A few keys changed meaning upstream (prefix/suffix/midfix are now the
  compound checkboxes, not attribute labels); they are overridden here.
"""
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

CUSTOM_KEYS = {
    # key: (dan, eng) - used by our kwic.ts patches
    "download_customkwic_csv": ("En konkordanslinje pr. række (CSV)", "One concordance line per row (CSV)"),
    "download_customkwic_tsv": ("En konkordanslinje pr. række (TSV)", "One concordance line per row (TSV)"),
    "download_all_kwic_csv": ("Alle konkordanslinjer (CSV)", "All concordance lines (CSV)"),
}

OVERRIDES = {
    # upstream reused these keys for the simple-search compound checkboxes
    "prefix": "først i ord",
    "midfix": "inde i ord",
    "suffix": "sidst i ord",
}

NEW_DANISH = {
    "lang_DA": "Dansk",
    "front_corpus_updates": "Korpusopdateringer",
    "front_corpus_updated": "blev opdateret",
    "example_queries": "Søgeeksempler",
    "fail_alt": "En tegnet ravn, der ligger på ryggen med kryds for øjnene",
    "fail_contact": "Har du spørgsmål, eller vil du rapportere en fejl, så kontakt Institut for Nordiske Studier og Sprogvidenskab.",
    "show_more_n": "Vis flere",
    "show_less_n": "Vis færre",
    "cqp_docs_guide": "vejledning (på svensk)",
    "cqp_docs_manual": "manual",
    "show_context": "Vis kontekst",
    "show_context_help": "Som standard vises søgeresultaterne som nøgleord i kontekst (KWIC). Med denne indstilling vises de i stedet med ombrudte linjer, som er lettere at læse. For nogle korpusser hentes der også mere kontekst, fx et helt afsnit.",
    "login_help": "En konto er kun nødvendig for at få adgang til beskyttede korpusser. Kontakt Institut for Nordiske Studier og Sprogvidenskab for at søge om adgang.",
    "toggle_select": "vælg",
    "modal_close": "Luk",
    "equal": "lig med",
    "not_equal": "ikke lig med",
    "subsumed_by": "omfattet af",
    "not_subsumed_by": "ikke omfattet af",
    "word_pic_global_filter": "Ordbilledet kan ikke kombineres med globale filtre. Fjern filtrene for at fortsætte.",
    "word_pic_description": "Ordbilledet viser ord, der ofte forekommer i syntaktiske relationer til søgeordet.",
    "word_pic_result_description": "Søgeordets ordklasse afgør, hvilke relationer der vises. Hver liste samler ord, der forekommer i de valgte korpusser i den givne relation til søgeordet.",
    "sort_by": "Beregn og sortér efter",
    "stat_frequency": "absolut frekvens",
    "stat_lmi": "LMI",
    "stat_lmi_help": "Lexicographer's Mutual Information, en variant af associationsmålet Mutual Information, der prioriterer typiske forekomster frem for sjældne",
    "map_no_data": "De valgte korpusser har ingen geografiske data.",
    "map_relative": "Relativ",
    "map_relative_help": "Gør markørernes størrelse relativ til stedets hyppighed i de valgte korpusser.",
    "is_possible": "er mulig",
    "is_not_possible": "er ikke mulig",
    "most_likely": "mest sandsynlig",
    "not_most_likely": "ikke mest sandsynlig",
    "stats_clipped": "hyppigste",
    "stats_clipped_help": "Det samlede antal rækker var større, men de mindst hyppige rækker blev udeladt af hensyn til ydelsen.",
    "num_results_relative": "Relativ frekvens",
    "relative_help": "Relativ frekvens viser antal træffere pr. million tokens i de valgte korpusser. Det er nyttigt, når man sammenligner søgninger i korpusser af forskellig størrelse.",
    "compare_help_description": "Sammenlign to søgninger for at rangere, hvilke værdier der skiller sig ud i hvert søgeresultat. Rangeringen bygger på en log-likelihood-beregning.",
    "compare_help_search": "Formulér først hver søgning i en af søgefanerne, og tryk på pilen ved siden af søgeknappen for at gemme den. Åbn derefter fanen Sammenlign, vælg de to søgninger, og vælg en attribut at sammenligne på.",
    # Swedish SUC tagset names, kept for key parity (not used by any CLARIN corpus)
    "pos_AB": "adverbium",
    "pos_DL": "tegnsætning",
    "pos_DT": "determinativ",
    "pos_E": "e",
    "pos_HA": "interrogativt/relativt adverbium",
    "pos_HD": "interrogativt/relativt determinativ",
    "pos_HP": "interrogativt/relativt pronomen",
    "pos_HS": "interrogativt/relativt possessiv",
    "pos_IE": "infinitivmærke",
    "pos_IN": "interjektion",
    "pos_JJ": "adjektiv",
    "pos_KN": "konjunktion",
    "pos_MAD": "tegnsætning",
    "pos_MID": "tegnsætning",
    "pos_MID|MAD|PAD": "tegnsætning",
    "pos_NN": "substantiv",
    "pos_PAD": "tegnsætning",
    "pos_PC": "participium",
    "pos_PL": "partikel",
    "pos_PM": "proprium",
    "pos_PN": "pronomen",
    "pos_PP": "præposition",
    "pos_PS": "possessiv",
    "pos_RG": "kardinaltal",
    "pos_RO": "ordinaltal",
    "pos_SN": "subjunktion",
    "pos_UO": "fremmedord",
    "pos_VB": "verbum",
    "corpselector_year": "Tokens i dateret materiale",
    "corpselector_undated": "Tokens i udateret materiale",
    "corpselector_all": "Tilgængelige",
    "corpselector_selected": "Valgte",
    "statstable_distribution": "Træffere pr. korpus",
    "csv_comma": "Kommaseparerede værdier (CSV)",
    "csv_semi": "Semikolonseparerede værdier (CSV)",
    "csv_tab": "Tabulatorseparerede værdier (TSV)",
    "select_attribute": "Vælg attribut",
    "order_error": "Fejl: Indstillingen \"i vilkårlig rækkefølge\" kræver flere tokens, ingen gentagelse, grænser eller jokertegn samt ét enkelt \"inden for\"-element.",
    "order_help": "Indstillingen \"i vilkårlig rækkefølge\" kan bruges ved søgninger med flere tokens uden gentagelse, grænser og jokertegn.",
    "access_partly_denied": "Du har ikke adgang til nogle af de korpusser, du har valgt",
    "access_partly_denied_continue": "For at fortsætte bliver de fjernet fra valget.",
    "access_denied": "Du har ikke adgang til nogen korpusser i denne tilstand.",
    "corpus_not_available": "Nogle af de valgte korpusser er ikke tilgængelige og er fjernet fra valget.",
    "go_to_start": "Gå til startsiden",
    "stats_no_supported_corpora": "Ingen af de valgte korpusser understøtter alle de valgte attributter.",
    "stats_unsupported_attr_help": "Denne attribut understøttes ikke i følgende korpusser:",
    "stats_unsupported_attr": "af det valgte materiale understøtter ikke attributten/attributterne",
    "stats_unsupported_attr_excluded": "og indgår derfor ikke i resultatet.",
    "free_order_chk": "i vilkårlig rækkefølge",
    "free_order_chk_help": "Søgeordene kan forekomme i vilkårlig rækkefølge og ikke nødvendigvis lige efter hinanden.",
    "prefix_help": "Tillad ord, der begynder med søgeordene.",
    "midfix_help": "Tillad ord, der indeholder søgeordene.",
    "suffix_help": "Tillad ord, der slutter med søgeordene.",
    "not_compound_middle": "ikke inde i ord",
    "not_prefix": "begynder ikke med",
    "not_suffix": "slutter ikke med",
}


def load(p: Path) -> "OrderedDict[str, str]":
    txt = p.read_text(encoding="utf-8")
    txt = re.sub(r",(\s*})", r"\1", txt)  # tolerate trailing commas
    return json.loads(txt, strict=False, object_pairs_hook=OrderedDict)


def main() -> int:
    upstream_eng = load(Path(sys.argv[1]))
    tdir = Path(sys.argv[2])
    dan_path = tdir / "locale-dan.json"
    old_dan = load(dan_path)

    new_dan = OrderedDict()
    missing = []
    for key in upstream_eng:
        if key in OVERRIDES:
            new_dan[key] = OVERRIDES[key]
        elif key in old_dan:
            new_dan[key] = old_dan[key]
        elif key in NEW_DANISH:
            new_dan[key] = NEW_DANISH[key]
        else:
            missing.append(key)
    if missing:
        print("No Danish text for upstream keys:", ", ".join(missing), file=sys.stderr)
        return 1

    dropped = [k for k in old_dan if k not in upstream_eng]
    dan_path.write_text(json.dumps(new_dan, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")

    # Custom keys live in corpora-*.json (merged into the same table by the frontend)
    for lang, idx in (("dan", 0), ("eng", 1)):
        p = tdir / f"corpora-{lang}.json"
        d = load(p)
        for k, texts in CUSTOM_KEYS.items():
            d[k] = texts[idx]
        p.write_text(json.dumps(d, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")

    print(f"locale-dan.json: {len(new_dan)} keys (= upstream), {len(dropped)} obsolete keys dropped, "
          f"{sum(1 for k in upstream_eng if k not in old_dan)} new keys added")
    print(f"custom keys moved to corpora-dan/eng.json: {', '.join(CUSTOM_KEYS)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
