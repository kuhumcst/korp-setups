# CLARIN corpus configuration (served by the backend)

This directory is mounted read-only at `/opt/corpus_config` in the backend
container (see `docker-compose.yml`) and served to the Korp frontend by
korp-backend's `/corpus_config?mode=<mode>` endpoint. The format is
documented in the upstream backend README, section "Corpus Configuration for
the Korp Frontend", and attribute options in the upstream frontend
`doc/frontend_devel.md`, section "Attribute settings".

```
modes/<mode>.yaml                    11 modes: label, order, folders, preselected corpora
corpora/<id>.yaml                    109 corpora: title, description, modes+folder, within,
                                     context, attribute lists, custom sidebar attributes
attributes/positional/<name>.yaml    attribute presets shared by two or more corpora
attributes/structural/<name>.yaml    (a definition used by one corpus only is inlined there)
```

Preset names: `<attr>` is the definition most corpora use; `<attr>__<mode>`
is a variant that first appeared in that mode (different label or order).

## Origin

Generated on 2026-09-15 by `scripts/modejs2yaml.js` from the pre-2026
JavaScript mode files in `frontend/app/modes/` and `frontend/app/config.js`.
These YAML files are now the source of truth: edit them directly. The
generator is kept for the other setups (lanchart, threats, ...) and for
reference; re-running it overwrites this directory.

The old JS mode files were deleted once the new frontend replaced the
2022 image; they remain in git history before the migration commit.

## What could not be expressed in YAML

Decisions taken during conversion; see `doc/upgrade-plan.md` for context.

- `settings.primaryColor` / `primaryLight` per mode: no equivalent in the
  current frontend. Dropped for now (plan step 4.6 decides whether to
  reintroduce per-mode colours via CSS).
- `settings.lemgramSelect = false`: no equivalent; the lemgram UI follows
  `autocomplete: false`, which every mode sets.
- `$("#lemgram_list_item").remove()` and `console.log` calls: dropped.
- `translationKey: "pos_"` on POS attributes: no `pos_*` entries existed in
  any translation file, so values were shown untranslated before as well.
  Dropped; add a `translation:` map to `attributes/positional/pos*.yaml` if
  translated POS labels are wanted.
- `msd` attribute: the old inline `extendedTemplate` + `extendedController`
  only opened the MSD tag table in a modal. Dropped; the tag table is linked
  from the sidebar via `sidebar_info_url` instead (plan step 4.2).
- MeMo custom attributes (`author_cust`, `book_cust`): the lodash `pattern`
  templates are kept. They contained `" + qtch + "` concatenations that only
  worked because the old loader made `qtch` a global; the generator resolved
  them to literal quotes. They also use `<span rel="localize[...]">` for
  labels, a deprecated mechanism; check in the new sidebar (plan 3.4 step 7)
  and switch to `translation`/labels if they no longer localise.
- Inline functions: `stats_stringify: function(values){return values.join(" ")}`
  (48 attributes) became `stats_stringify: "joinWithSpace"`, defined in
  `../frontend/config/custom/statistics.js`; the `prefix` attribute's
  lemgram `stringify` became `stringify: "prefix"` in
  `../frontend/config/custom/stringify.js`, ported to the current `Lemgram`
  class.
- `within` lists are ordered sentence < paragraph < text as the backend
  documentation requires, regardless of the order in the old object.

## Checking a change

```bash
# from the repo root, with the CLARIN backend running
for m in $(ls setups/clarin/corpus_config/modes | sed 's/.yaml//'); do
  curl -s "http://localhost:1234/corpus_config?mode=$m" | python3 -c '
import json,sys; d=json.load(sys.stdin); m=sys.argv[1]
print(m, "ERROR" if "ERROR" in d else len(d["corpora"]), d.get("warnings", "ok"))' $m
done
```

Every line should end in `ok`. A warning names a preset or folder that does
not exist. The backend caches nothing when `MEMCACHED_SERVER` is unset, so
edits are visible on the next request without a restart.
