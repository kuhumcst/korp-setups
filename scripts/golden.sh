#!/usr/bin/env bash
# golden.sh - record reference responses from a Korp backend for later diffing.
#
# Usage: scripts/golden.sh <backend-url> <output-dir>
#   e.g. scripts/golden.sh http://localhost:1234 fixtures/old
#
# For every CLARIN mode one representative corpus is queried with a fixed CQP
# expression. Three responses are stored per mode (query, count, corpus_info)
# plus one timespan response. Volatile fields (time, DEBUG) are stripped so
# two runs against equivalent backends produce identical files.
#
# KWIC rows are stored without their text: this repository is public and the
# corpora are not all. Each row keeps what a regression shows up in first
# (corpus, match positions, token count, attribute names), not the tokens.
#
# The endpoints and parameters are those of the Korp 8.x API, which both the
# pinned 2022 backend and v8.2.0 implement.

set -euo pipefail

BACKEND="${1:?backend url, e.g. http://localhost:1234}"
OUT="${2:?output directory}"
mkdir -p "$OUT"

# mode:corpus - one corpus per CLARIN mode, chosen to exist in every registry copy.
MODES=(
  "default:LSPCLIMATEDMU"
  "FT:FT_KORPUS"
  "da1800:LIT1800JPJNL"
  "medieval_ballads:DUDSDFK_BILLALL"
  "memo_all:MEMO_ALL"
  "memo_authornovels:MEMO_BANGH_TINE_1889"
  "memo_frakturcorr:MEMO_FRAKTUR_CORR_1880"
  "memo_frakturgold:MEMO_FRAKTUR_GOLD"
  "memo_yearcorpora:MEMO_1885"
  "saxo_danish:SAXODEL01"
  "threats:THREATS_ART"
)

# "og" (and) occurs in every Danish corpus, old and new spelling alike.
CQP='[word = "og"]'

strip_volatile() {
  python3 -c '
import json, sys
d = json.load(sys.stdin)
for k in ("time", "DEBUG"):
    d.pop(k, None)
for row in d.get("kwic", []):
    tokens = row.pop("tokens", [])
    row["tokens"] = {"count": len(tokens), "attrs": sorted(tokens[0]) if tokens else []}
    row["structs"] = sorted(row.get("structs", {}))
    for key in row.get("aligned", {}):
        row["aligned"][key] = {"count": len(row["aligned"][key])}
json.dump(d, sys.stdout, indent=1, sort_keys=True, ensure_ascii=False)
print()
'
}

fetch() {
  # fetch <name> <path-with-query>
  local name="$1" path="$2"
  if curl -sf --get "$BACKEND/$path" | strip_volatile > "$OUT/$name.json"; then
    echo "ok   $name"
  else
    echo "FAIL $name  ($BACKEND/$path)" >&2
    rm -f "$OUT/$name.json"
    return 1
  fi
}

fail=0
for entry in "${MODES[@]}"; do
  mode="${entry%%:*}"
  corpus="${entry##*:}"
  q="corpus=$corpus&cqp=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$CQP")"
  fetch "$mode.query"       "query?$q&start=0&end=9&default_context=1%20sentence&show=word&show_struct=&cache=false" || fail=1
  fetch "$mode.count"       "count?$q&group_by=word&cache=false" || fail=1
  fetch "$mode.corpus_info" "corpus_info?corpus=$corpus&cache=false" || fail=1
done
fetch "timespan.FT_KORPUS" "timespan?corpus=FT_KORPUS&granularity=y&cache=false" || fail=1

echo
echo "wrote $(ls "$OUT" | wc -l | tr -d ' ') files to $OUT"
exit $fail
