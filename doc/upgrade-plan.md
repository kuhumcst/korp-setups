# Rebasing korp-setups on current upstream Korp

Plan for moving the base images and the CLARIN setup from the 2022 upstream
pins to the current stable Språkbanken releases. Written 2026-09-15 from a
read of this repository and of the upstream `korp-frontend`, `korp-backend`,
`korp-frontend-sb` and `korp-config` repositories.

Every step below ends with a **Verify** block: a command or observation with
an expected result. A phase is done when all of its verify blocks pass.

---

## 1. Summary

| | Now (pinned) | Target |
|---|---|---|
| korp-frontend | commit `d3a0951` (2022-01-18, between v9.1.0 and v9.2.0, on `dev`) | tag **v9.15.1** (2026-09-04, `master`) |
| korp-backend | commit `65e7591` (2022-05-20, pre-8.1.0, first commit with `/corpus_config`) | tag **v8.2.0** (2024-05-16, `master`) |
| Node | 12 on Ubuntu focal | 24 (`.nvmrc`), engine `>=20` |
| Python | 3.10 (jammy) | 3.10 is fine for 8.2.0 (8.3.0 requires >=3.10; 9.0 will require >=3.11) |
| CWB | SVN trunk r1557 | unchanged; backend requires >=3.4.12 |
| Corpus/mode config | JS mode files in the frontend image | YAML directory served by the backend (`/corpus_config`) |
| Frontend settings | `config.js` (camelCase, executed) | `config.yml` (snake_case, data) |
| Frontend customisation | overwrite files inside upstream `app/` | upstream-supported config dir: `config.yml`, `modes/*_mode.js`, `custom/*.js`, `translations/`, `img/` |

**The core change is architectural, not a version bump.** Our 2022 approach
copies patched files over upstream's `app/` directory. Upstream has since
deleted or rewritten every file we patch (Pug templates gone, JS controllers
became TypeScript components, corpus config moved to the backend). Rebasing
means re-expressing our customisations through the extension points upstream
now supports, and keeping any remaining real source patches as explicit
`.patch` files so the next rebase is a mechanical `git apply` that fails
loudly instead of silently.

Why 8.2.0 and not the newer backend branches:

- Frontend 9.15.1 calls the 8.x routes (`/query`, `/count`, `/corpus_config`,
  `/attr_values`, `/timespan`, `/relations`, ...). Verified by grepping the
  frontend source.
- Backend `dev` (8.3.0, Feb 2026) is untagged and only adds HTTP cache headers,
  tests, and a Python >=3.10 requirement. Re-evaluate when it is tagged.
- Backend `fastapi` branch (9.0.0.dev0, Sept 2026) is a Flask to FastAPI
  rewrite with renamed routes (`/query` becomes `/concordance`,
  `/corpus_config` becomes `/corpora/config`, etc.) and `.env` configuration.
  No released frontend speaks that API yet. Section 9 covers how to stay
  ready for it.
- Our pinned backend predates the `/struct_values` to `/attr_values` rename
  (2023-01-09). Frontend 9.15.1 requires `/attr_values`, so **the backend must
  be upgraded before or together with the frontend**, never after.

---

## 2. Inventory of what we customised, and where it goes

### 2.1 Base frontend image (`frontend/`)

| Our file | What it does (diff vs pinned upstream) | Upstream today | Migration path |
|---|---|---|---|
| `Dockerfile` | Ubuntu focal, Node 12, clone at pin, copy `app/` over upstream, `yarn`, mkdocs | Node >=20, webpack 5, TypeScript. `yarn start:dist` no longer exists | New image on `node:24-bookworm`; checkout tag; `yarn` only. Serve `dist/` with nginx |
| `app/includes/header.pug` (+11 −19) | Danish/English switch instead of Swedish; removes the Språkbanken burger menu; adds `/userguide` link; NorS logo instead of SB and SWE-CLARIN | File gone. Header is `app/scripts/components/app-header.ts`; burger menu links are hardcoded | `languages` + `default_language` in `config.yml`; `logo.organization` HTML; user-guide link inside that HTML or a small patch; burger menu hidden by CSS or patched |
| `app/markup/msdtags.html` (rewritten) | Danish MSD tag reference page | File gone. Attributes have `sidebar_info_url` | Ship page as a static file; point `sidebar_info_url` at it |
| `app/modes/common.js` (694 lines, ours) | Old shared attribute definitions (`liteOptions`, `attrs.*`, `sattrs.*`, `settings.commonStructTypes`, `settings.posset`) | Gone; Språkbanken keeps these as YAML presets in `korp-config` | Becomes `attributes/positional/*.yaml`, `attributes/structural/*.yaml` and `common_struct_types` in `config.yml` |
| `app/scripts/kwic_download.js` (+280 −7) | "One concordance line per row" CSV with one column per match token plus per-token annotations, `;` delimiter, UTF-8 BOM | `app/scripts/kwic/kwic_download.ts` (TypeScript). Still `,` delimiter, no BOM, no per-token columns | Decide keep or drop. If keep: port to TS as a patch, then PR upstream |
| `app/scripts/result_controllers.js` (+27 −2) | Adds "All concordance lines (CSV)" option that opens the exporter with a URL scraped from the `#json-link` element | File gone; options live in `components/kwic/kwic.ts`. The JSON link is now a button that downloads the stored response (9.11), so `#json-link` no longer carries the query | Patch `kwic.ts` to add the option and build the URL from `$ctrl.params` |
| `app/translations/locale-en.json` (+31 −18) | Adds UI keys (`user_guide`, `danish`, `download_custom_*`) and attribute labels (`word`, `lemma`, `pos`, `msd`, ...) | Attribute labels belong in `corpora-eng.json` or presets | Split: UI keys to `locale-eng.json` overrides only if still needed; labels to presets |
| `app/translations/locale-da.json` (341 keys) | Danish UI translation | Language codes are three-letter (`dan`). 242 of our keys still exist upstream, 99 are obsolete, 96 upstream keys have no Danish yet | Rename to `locale-dan.json`, prune, translate the 96 |
| `app/translations/angular-locale_da.js` | Angular locale for dates and numbers | Loaded as `translations/angular-locale_{{lang}}.js` | Rename to `angular-locale_dan.js` |
| `exec/sync.sh` | Copies translations and modes into `dist/` | webpack copies these itself | Delete |

### 2.2 CLARIN setup (`setups/clarin/`)

| Our file | Content | Migration path |
|---|---|---|
| `frontend/app/config.js` | ~50 `settings.*` assignments incl. `modeConfig` (11 modes), download formats, word-picture config, `korpBackendURL` | `config.yml`, see Appendix A for the key-by-key mapping. Mode list moves to backend `modes/*.yaml` |
| `frontend/app/modes/*_mode.js` (11 files, 3300 lines, 111 corpora) | `settings.corpora`, `settings.corporafolders`, `preselectedCorpora`, per-mode colours, attribute objects, `customAttributes` with lodash `pattern` templates, inline `stats_stringify` functions, jQuery DOM hacks | Generated YAML: `modes/<mode>.yaml` (11), `corpora/<id>.yaml` (111), attribute presets. Inline functions become named entries in `custom/statistics.js`. Per-mode colour needs a tiny `<mode>_mode.js` or CSS. jQuery hacks dropped |
| `frontend/app/translations/corpora-{da,en,sv}.json` | Mode labels, attribute labels, value translations | `corpora-dan.json`, `corpora-eng.json`; drop Swedish |
| `frontend/Dockerfile` + `mkdocs_yml_extension.txt` | Copies app overlay, builds mkdocs user guide into `dist/userguide`, `yarn build`, `yarn start:dist` | Same idea: `run_config.json` pointing at our config dir, `yarn build`, nginx serving `dist/` and `/userguide` |
| `docker-compose.yml` | backend, frontend, doc, exporter, backend-v6, fcs-prep, fcs | Add a `corpus_config` volume for the backend. FCS stack is untouched by this migration |
| `docker/backend-v6/*`, `docker/fcs/*` | Ancient backend for the CLARIN FCS endpoint | Out of scope, keeps working as a separate container |
| `corpora/encodingscripts/encode-ft-corpus.sh` | cwb-encode recipe | Unchanged |

### 2.3 Base backend image (`backend/`)

| Item | Now | 8.2.0 |
|---|---|---|
| Entry point | `python3 korp.py` | `python3 run.py` (or gunicorn) |
| Config | `config.py` copied over the repo's | `instance/config.py` overrides the shipped `config.py` |
| Config keys | `MEMCACHED_SERVERS` list, `MEMCACHED_POOL_SIZE`, `AUTH_SERVER`, `AUTH_SECRET`, `PROTECTED_FILE` | `MEMCACHED_SERVER` (single), auth via `PLUGINS`, new `CORPUS_CONFIG_DIR`, `CACHE_MAX_QUERY_DATA`, `LAB_MODE` |
| Werkzeug pin hack | `pip install Werkzeug==2.2.2` after requirements | `requirements.txt` pins `Flask~=2.2.3`; drop the hack, verify it still resolves |
| MySQL | Runs inside the backend container via `service mysql start` | Unchanged for this migration (see section 8 for the optional split) |
| Time data | `db_setup.sql` seeds `timedata` tables | Same tables, unchanged |

### 2.4 Exporter (`exporter/`)

Talks to the backend's `/query` endpoint, which is unchanged in 8.2.0. Its
only coupling to the frontend is the URL-building hack in
`result_controllers.js`. Nothing else in the exporter changes.

---

## 3. Upstream changes that hit us (frontend, 9.1 to 9.15)

From `CHANGELOG.md`, only the items that affect our customisations:

- **9.4.0**: all Pug removed; controllers and directives became components;
  Babel removed; webpack 5; auth pluggable.
- **9.5.x**: `run_config.json` optional; content hash on `bundle.js`;
  `ENVIRONMENT` replaces `NODE_ENV`; "in order" inverted to "in free order".
- **9.6.0**: frontpage with description, news, corpus updates, example
  searches; globals removed (`settings`, `CorpusListing`, `util`, ...);
  localisation functions renamed (`getLocaleString` to `loc`);
  `translateAttribute` to `locAttribute`.
- **9.7.x**: TypeScript typings everywhere; jStorage and Raphael replaced;
  `stringify(key, x)` removed; `noImplicitAny` on; `.env` support.
- **9.8.0**: `corpus_config_url` replaced by `get_corpus_ids`;
  `structService` and `lexicons` replaced by plain async functions;
  backend errors shown in UI.
- **9.9.0**: display options (hits per page, group by) moved into the result
  tabs and re-trigger the search automatically; `settings.time_data` replaced
  by `getTimeData()`.
- **9.10.0**: `store` service replaces most `$rootScope` state; `escaper`
  directive removed; site logos via `logo` setting.
- **9.11.0**: `CorpusListing` renamed `CorpusSet`; `searches` service removed;
  JSON button downloads the stored response; Prettier everywhere.
- **9.12.0**: `preselected_corpora: []` now selects none (leave unset to
  select all).
- **9.13.0**: backend-based KWIC download code removed
  (`enableBackendKwicDownload`, `downloadFormats`, `downloadCgiScript` are
  dead); SlickGrid 5.
- **9.14.x**: dependency-tree attribute names configurable; corpus config
  `pivot` flag removed; protection read from corpus info, not config.

Frontend extension points that exist today (all under the config dir):

- `config.yml` (required), loaded into `settings`.
- `modes/<mode>_mode.js`: optional code per mode; `import settings from "@/settings"`.
- `modes/*.html`: copied verbatim to `dist/modes/` (we can use this for
  `msdtags.html`).
- `custom/components.js`, `custom/extended.js`, `custom/sidebar.js`,
  `custom/statistics.js`, `custom/stringify.js`: loaded with `require` if
  present.
- `translations/corpora-<lang>.json`, `translations/locale-<lang>.json`,
  `translations/angular-locale_<lang>.js` with **three-letter** codes.
  `iso_languages` maps old `da` links to `dan` automatically.
- `img/*`: copied with a content hash; referenced from `logo.*` HTML as
  `img/<file>`.

Things with **no** extension point (need a patch or a workaround):

- The header burger menu and its Språkbanken links (`app-header.ts`).
- Extra KWIC download options and the KWIC CSV format (`kwic.ts`,
  `kwic_download.ts`).
- Per-mode primary colour (only a Sass variable now).

---

## 4. Strategy decisions

Recommendations, with the alternative noted. These are the user's calls.

1. **Backend target: v8.2.0.** Alternative: `dev` 8.3.0 for HTTP cache
   headers. Both are Flask and API-compatible; switching later is a one-line
   change in the Dockerfile.
2. **Stop overlaying upstream `app/`.** Use `run_config.json` and a config
   dir at `setups/clarin/frontend/config/`. Keep only genuine source patches
   in `frontend/patches/*.patch`, applied with `git apply --3way` in the base
   Dockerfile. Every patch gets a one-line header explaining why it exists
   and whether it has been proposed upstream.
3. **Generate the YAML corpus config from the existing JS mode files** with a
   throwaway converter script, then treat the YAML as the source of truth and
   delete the JS. Hand-writing 111 corpus files invites typos; generating
   them makes the counts verifiable.
4. **Header customisation without patches first.** `languages` and `logo`
   settings cover the language switch and the NorS logo. The user-guide link
   goes into the `logo.organization` HTML. The burger menu is hidden with a
   CSS rule imported from `default_mode.js`. Fall back to a patch (and an
   upstream PR making the menu configurable) only if the CSS route proves
   ugly.
5. **Exporter hook: small patch to `kwic.ts`** adding the "All concordance
   lines" option built from `$ctrl.params`. Follow-up (optional): make the
   exporter derive `show`/`show_struct` from `/corpus_config` itself so the
   frontend only needs to pass `corpus`, `cqp`, `within`, `context`.
6. **Custom KWIC CSV format: keep, as a patch, then PR upstream.** The
   per-token match columns are a generic feature Språkbanken may accept.
   Alternative: drop it and use upstream's format plus the exporter for
   bulk downloads. Decide after trying upstream's 9.15 export (Phase 4,
   step 4.3).
7. **MySQL stays inside the backend container for this migration.**
   Splitting it into a `mariadb` service is worthwhile but is a separate
   change (section 8).
8. **CLARIN first, other setups after**, reusing the base images and the
   converter. Lanchart has a `custom/sidebar.js` that already matches the
   new `custom/` convention.

---

## 5. Phase 0: Baseline and fixtures (before touching anything)

Goal: prove the current stack runs locally against the downloaded corpora,
and record reference outputs so later phases can be diffed against them.

**0.1 Mount the corpora where the registry expects them.** CWB registry
files contain absolute paths (`HOME /opt/corpora/data/<corpus>`), so the
container must see the data at `/opt/corpora`. The host location is free:
the CLARIN compose file reads it from `CORPORA_DIR` (default `/opt/corpora`,
the production path) and a git-ignored `setups/clarin/.env` sets it locally,
for example `CORPORA_DIR=/Users/rqf595/Code/corpora`. The registry files are
never rewritten.

Status 2026-09-15: done on this machine. 158 registry entries, all with
`HOME /opt/corpora/data/...`.

Verify:
```bash
grep -h '^HOME' /opt/corpora/registry/* | sort -u | head
```
Expected: every line starts with `/opt/corpora/data/`.

**0.2 Check registry coverage against what the CLARIN modes reference.**
The 11 mode files reference 111 corpus ids (list in Appendix C).

Verify:
```bash
cd setups/clarin/frontend/app/modes
grep -h -o -E '^\s*id\s*:\s*"[A-Za-z0-9_]+"' *.js | sed -E 's/.*"(.*)"/\1/' | tr 'A-Z' 'a-z' | sort -u > /tmp/ids.txt
ls /opt/corpora/registry | sort > /tmp/registry.txt
comm -23 /tmp/ids.txt /tmp/registry.txt
```
Expected: empty output, or a known list of corpora that are intentionally
absent locally (write that list down; it is the exclusion list for later
verify steps).

Status 2026-09-15: passed with empty output, so the exclusion list is
empty. The registry also holds 47 corpora no CLARIN mode references (old
LSP and Saxo variants, threats variants, extra Pontoppidan novels, test
corpora) and three entries without data directories (`lspbyggeri`,
`lspeconumicseos`, `lspieconumicseos`); none of them matter for CLARIN.

**0.3 Build and run the current CLARIN setup.** Point `korpBackendURL` in
`setups/clarin/frontend/app/config.js` at `http://127.0.0.1:1234` for local
use (the file already has the commented line; revert before deploying).

Findings 2026-09-15, both fixed in the base Dockerfiles so the baseline can
be reproduced at all:

- The 2022 frontend base image no longer builds: NodeSource has withdrawn
  the signing key of its Node 12 apt repository, so `setup_12.x` fails at
  `apt-get update`. `frontend/Dockerfile` now installs Node 12.22.12 from the
  official tarball instead (amd64 and arm64).
- The 2022 backend image builds but `korp.py` dies at start in
  `gevent.monkey.patch_all()` with `DistributionNotFound: zope.event`.
  gevent 21.12 pulls the newest zope.event 6.2 and zope.interface 8.6, whose
  `zope_event-*.dist-info` metadata the old `pkg_resources` in jammy's
  setuptools 59 cannot map back to the name `zope.event`.
  `backend/Dockerfile` now pins `zope.event==4.5.0` and
  `zope.interface==5.4.0`.

Both are symptoms of the same thing: unpinned transitive dependencies drift
under a pinned application. The new images (Phase 1 and 3) should pin
everything they install, or build from lock files.

Verify:
```bash
cd setups/clarin && docker-compose up -d --build backend frontend doc
curl -s 'http://localhost:1234/info' | python3 -m json.tool | head
curl -s 'http://localhost:1234/corpus_info?corpus=FT_KORPUS' | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["corpora"]["FT_KORPUS"]["info"]["Size"])'
```
Expected: `/info` returns a `version` field; `corpus_info` prints a token
count. Then open `http://localhost:9111/` and `http://localhost:9111/?mode=memo_all`
in a browser and run one search each.

Status 2026-09-15: passed. Backend reports version 8.1.0, CQP 3.4.27, 158
corpora; `corpus_info` gives FT_KORPUS 46,975,328 tokens but no `.info`
values (no `Sentences`, `Updated`, `FirstDate`, `LastDate`); frontend and
user guide answer 200; a search for "klima" in the default mode gives 227
hits and "kjærlighed" in `memo_all` gives 362, both with the sidebar
rendering (including the MeMo author and book blocks) and no console
errors. Note the compose project builds its own `clarin-backend` image from
`../../backend`, so after changing the base Dockerfile use
`docker compose up -d --build backend` inside `setups/clarin`, not only the
root `docker compose build`.

**0.4 Record golden responses.** Write `scripts/golden.sh` (new) that, for
each mode, runs one fixed query against the backend and stores the JSON with
volatile fields removed (`time`, `DEBUG`). Suggested set: one `/query`, one
`/count` and one `/corpus_info` per mode, plus `/timespan?corpus=FT_KORPUS`.

Verify:
```bash
scripts/golden.sh http://localhost:1234 fixtures/old
ls fixtures/old | wc -l
```
Expected: 3 files per mode plus timespan, all valid JSON, committed to git.

The KWIC rows in the `query` fixtures are stored without their tokens
(corpus, match positions, token count and attribute names only): the
repository is public and the corpora are not all. The golden script
redacts on the way in, so a diff still catches a changed hit list, match
position or attribute set; only a change confined to token text would
pass, which the count and corpus_info fixtures do not cover either.

Status 2026-09-15: passed, 34 files in `fixtures/old`. Hits for `[word = "og"]`
per mode: FT 973,163; da1800 508; default 23,359; medieval_ballads 5;
memo_all 1,761,407; memo_authornovels 2,057; memo_frakturcorr 4,457;
memo_frakturgold 457; memo_yearcorpora 14,342; saxo_danish 500; threats 42.
The FT_KORPUS timespan is empty because `db_setup.sql` seeds time data only
for a few LSP and Saxo corpora; the trend diagram for FT therefore shows no
data in the local baseline, and the same is expected after Phase 1.

---

## 6. Phase 1: Backend base image to v8.2.0

Goal: same corpora, same MySQL, new backend. No frontend changes yet; the old
frontend will be broken against it (that is expected and temporary).

**1.1 New `backend/Dockerfile`.** Changes from today:

- `git checkout v8.2.0` instead of the 2022 commit.
- Remove the `Werkzeug==2.2.2` downgrade line.
- Copy our config to `/opt/korp-backend/instance/config.py` (not over the
  shipped `config.py`).
- `CMD service mysql start && python3 run.py`.
- Add `CORPUS_CONFIG_DIR = "/opt/corpus_config"` and create the directory.
- Install with `pip3 install -r requirements.txt -c constraints.txt`, where
  `backend/constraints.txt` pins the transitive packages to versions
  contemporary with the tag (Werkzeug 2.3, greenlet 2, zope.event 4,
  zope.interface 5). Resolved unconstrained on 2026-09-15, upstream's
  requirements pulled Werkzeug 3.1.8 (breaks Flask 2.2), greenlet 3.5.6
  (ABI-incompatible with gevent 22) and zope.interface 8.6 (metadata
  unreadable by `pkg_resources`, so `gevent.monkey.patch_all()` fails).
- Two build-time smoke tests, so a broken dependency set fails the image
  build rather than the container: import gevent and call `patch_all()`;
  call `create_app()` and assert `CWB_REGISTRY` has our value, which proves
  the instance config was loaded.
- `KORP_BACKEND_REF` build argument (default `v8.2.0`) so another tag or
  commit can be tried without editing the file.
- `backend/requirements-overrides.txt`, installed after the requirements,
  replaces upstream's exact pin `mysqlclient==1.3.13` with 2.1.1. The 2018
  C extension fails on Python 3.10 with `SystemError: PY_SSIZE_T_CLEAN macro
  must be defined for '#' formats`, so every database-backed endpoint
  (`/timespan`, `/relations`, `/lemgram_count`) returned an error. The
  golden diff of step 1.4 is what caught this: 33 of 34 fixtures were
  identical and the FT timespan carried the error. A constraints file
  cannot override an `==` pin, hence the second install step, guarded by a
  build-time import check.

**1.2 New `backend/config.py`** (becomes `instance/config.py`). Start from
upstream's `config.py` at v8.2.0 and set: `CQP_EXECUTABLE`,
`CWB_SCAN_EXECUTABLE`, `CWB_REGISTRY = "/opt/corpora/registry"`,
`LC_COLLATE = "da_DK.UTF-8"`, `DBHOST/DBPORT/DBNAME/DBUSER/DBPASSWORD` as
today, `MAX_KWIC_ROWS = 0`, `CACHE_MAX_STATS = 5000`,
`CORPUS_CONFIG_DIR = "/opt/corpus_config"`. Delete the removed keys
(`AUTH_*`, `PROTECTED_FILE`, `MEMCACHED_SERVERS`, `MEMCACHED_POOL_SIZE`).
Leave `MEMCACHED_SERVER = None` and `CACHE_DIR = ""` unless memcached is
added to the compose file.

Verify (config keys are all recognised):
```bash
diff <(grep -o -E '^[A-Z_]+ =' backend/config.py | sort) \
     <(git -C /path/to/korp-backend show v8.2.0:config.py | grep -o -E '^[A-Z_]+ =' | sort)
```
Expected: no lines only on the left (every key we set exists upstream).

Status 2026-09-15: passed. Note that the instance config is read from
`/opt/korp-backend/instance/config.py` (Flask's instance path for the
`korp` package), and the Dockerfile asserts at build time that it was
picked up.

**1.3 Build and start against the same corpora.**

Verify:
```bash
docker-compose build backend && docker-compose up -d backend
curl -s http://localhost:1234/info | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])'
docker-compose exec backend cqp -v 2>&1 | head -1
```
Expected: version `8.2.5` (the `__version__` string inside the v8.2.0
tag; upstream forgot to align it) and CQP >= 3.4.12 (r1557 is 3.4.27).

Status 2026-09-15: passed (8.2.5, 158 corpora, CQP 3.4.27). The compose
service image is `clarin-backend`; rebuild it with
`docker compose build backend` inside `setups/clarin`.

**1.4 Golden diff.**
```bash
scripts/golden.sh http://localhost:1234 fixtures/new-backend
diff -r fixtures/old fixtures/new-backend
```
Expected: no differences in `/query` and `/corpus_info` fixtures. `/count`
may differ in `relative` totals because 8.2.0 fixed a caching bug there;
inspect and accept those explicitly.

Status 2026-09-15: passed, all 34 fixtures byte-identical (the `/count`
fixtures included, since caching is off in both images). The first attempt
had 33 identical and the FT timespan returning the mysqlclient
`PY_SSIZE_T_CLEAN` error described in 1.1; fixed by the override file.
`/timespan?corpus=LSPCLIMATEDMU` returns the seeded 2005 row. Note that
`/lemgram_count` answers `Table 'korp.lemgram_index' doesn't exist`: that
table has never existed in `db_setup.sql` and lemgram search is disabled
in every CLARIN mode, so it is not a regression.

**1.5 Endpoints the new frontend needs.**
```bash
curl -s 'http://localhost:1234/attr_values?corpus=FT_KORPUS&attr=text_party' | head -c 300
curl -s 'http://localhost:1234/corpus_config?mode=default' | head -c 300
```
Expected: `attr_values` returns values; `corpus_config` returns an error
about a missing mode `default` (there is no YAML yet). That error is the
signal for Phase 2.

Status 2026-09-15: passed (18 party values; `The mode 'default' does not
exist.`).

**1.6 Old frontend against the new backend (bonus).** The 2022 CLARIN
frontend, still pointed at the local backend, was exercised after the
upgrade: the same "klima" search returns 227 hits with KWIC and sidebar,
no console errors, all requests 200 (`corpus_info`, `timespan`, `query`,
`count`). The old frontend only misses `/struct_values`, which the CLARIN
configuration does not use (no attribute filters). So a production
rollout can upgrade the backend first and keep the old frontend running
while Phases 2 to 4 are finished, which halves the blast radius of the
cut-over. Phase 5 should use that order.

---

## 7. Phase 2: Corpus configuration as YAML

Goal: `setups/clarin/corpus_config/` with `modes/`, `corpora/` and
`attributes/`, generated from the JS mode files, mounted into the backend.

**2.1 Write the converter** (`scripts/modejs2yaml.js`, Node). It evaluates
the old files in a sandbox and serialises the result:

1. Create a stub environment: `settings = {}` seeded with `defaultOptions`
   and `defaultWithin` from `config.js`; `CorpusListing = class {}`;
   `$ = () => ({ remove() {} })`; `window = {}`.
2. Evaluate `frontend/app/modes/common.js` (base image) to obtain
   `liteOptions`, `setOptions`, `attrs`, `sattrs`, `settings.commonStructTypes`.
3. For each `<mode>_mode.js`: reset `settings.corpora`,
   `settings.corporafolders`, `settings.preselectedCorpora`; evaluate;
   collect.
4. Emit `modes/<mode>.yaml` with `label` (from the `modeConfig` localekey
   looked up in `corpora-da.json` and `corpora-en.json`), `order` (position
   in `modeConfig`), `folders` (from `corporafolders`, recursively, with
   `title`/`description`), `preselected_corpora`.
5. Emit `corpora/<id lowercased>.yaml` with `id`, `title`, `description`,
   `mode: [{name, folder}]` (a corpus that appears in several mode files gets
   several entries), `within` and `context` converted from `{key: value}`
   objects to `[{label, value}]` lists, `pos_attributes`,
   `struct_attributes`, `custom_attributes`, `reading_mode` where the old
   config implied it.
6. Deduplicate attribute definitions by content hash into
   `attributes/positional/<name>.yaml` and `attributes/structural/<name>.yaml`
   (same rule the backend uses), and reference them by name from the corpus
   files. Apply the key renames in Appendix B while emitting.
7. Inline `stats_stringify: function ...` values are replaced by a string
   key, and the function body is written once into
   `frontend/config/custom/statistics.js`.
8. Anything the converter cannot express (jQuery calls, `console.log`,
   `settings.primaryColor`) is printed as a warning with file and line, so
   the residue is reviewed by hand.

Verify (counts):
```bash
node scripts/modejs2yaml.js setups/clarin/frontend/app setups/clarin/corpus_config
ls setups/clarin/corpus_config/modes | wc -l      # expected 11
ls setups/clarin/corpus_config/corpora | wc -l    # expected 109
for m in setups/clarin/corpus_config/modes/*.yaml; do n=$(basename $m .yaml); \
  c=$(grep -l "name: $n\$" setups/clarin/corpus_config/corpora/*.yaml | wc -l); echo "$n $c"; done
```
Expected per-mode corpus counts equal to the old files: default 24,
FT 1, da1800 1, medieval_ballads 1, memo_all 1, memo_authornovels 9,
memo_frakturcorr 21, memo_frakturgold 1, memo_yearcorpora 30,
saxo_danish 16, threats 4; 109 corpora in total. (An earlier version of
this plan said 25, 2, 2 and 111: that grep also counted three corpora that
are commented out in the old files, `lspbyggeri3c`, `lit1800jpjnl` and a
second `memo_all` block.)

Verify (well-formed YAML and required keys):
```bash
python3 - <<'EOF'
import yaml, glob, sys
bad = 0
for f in glob.glob("setups/clarin/corpus_config/corpora/*.yaml"):
    d = yaml.safe_load(open(f))
    for k in ("id", "title", "description", "mode"):
        if k not in d: print(f, "missing", k); bad += 1
    if d["id"] != f.split("/")[-1][:-5]: print(f, "id mismatch"); bad += 1
for f in glob.glob("setups/clarin/corpus_config/modes/*.yaml"):
    d = yaml.safe_load(open(f))
    if "label" not in d: print(f, "missing label"); bad += 1
sys.exit(bad)
EOF
```
Expected: exit 0.

Status 2026-09-15: passed. `scripts/modejs2yaml.js` (Node, no
dependencies) evaluates `config.js`, `common.js` and the 11 mode files in a
sandbox and writes 11 mode files, 109 corpus files and 90 presets (29
positional, 61 structural; definitions used by a single corpus are inlined
in that corpus file instead of becoming presets). Two inline functions
became `custom/statistics.js` (`joinWithSpace`, 48 uses) and
`custom/stringify.js` (`prefix`, ported to the current `Lemgram` class).
PyYAML inside the backend container parses all 210 files and finds every
required key. `setups/clarin/corpus_config/README.md` records the layout
and the conversion decisions.

**2.2 Mount and serve.** Add to the CLARIN compose backend service:
`- ./corpus_config:/opt/corpus_config:ro`.

Verify (backend accepts it, no warnings, all corpora resolvable):
```bash
for m in default FT da1800 medieval_ballads memo_all memo_authornovels memo_frakturcorr memo_frakturgold memo_yearcorpora saxo_danish threats; do
  curl -s "http://localhost:1234/corpus_config?mode=$m" | python3 -c '
import json,sys; d=json.load(sys.stdin); m=sys.argv[1]
print(m, len(d["corpora"]), "corpora;", "WARNINGS:" if d.get("warnings") else "ok", d.get("warnings", ""))' $m
done
```
Expected: counts as above and `ok` on every line. A warning names a preset
or folder that does not exist; fix the converter, not the YAML.

Verify (ids exist in CWB):
```bash
curl -s 'http://localhost:1234/corpus_config?mode=memo_yearcorpora' | python3 -c 'import json,sys; print(",".join(json.load(sys.stdin)["corpora"]))' \
 | xargs -I{} curl -s 'http://localhost:1234/corpus_info?corpus={}' | grep -c '"ERROR"'
```
Expected: `0`, or exactly the number of corpora on the Phase 0 exclusion list.

Status 2026-09-15: passed. All 11 modes answer without warnings with the
expected counts (default 24, FT 1, da1800 1, medieval_ballads 1, memo_all 1,
memo_authornovels 9, memo_frakturcorr 21, memo_frakturgold 1,
memo_yearcorpora 30, saxo_danish 16, threats 4); the 109 distinct ids all
resolve in `corpus_info`; the mode list keeps the old `modeConfig` order.

**2.3 Hand-review the residue** printed by the converter. Expected residue:
`settings.primaryColor`/`primaryLight` (11 modes), `$("#lemgram_list_item").remove()`
(MeMo), `console.log` (threats). Record the decision for each in the
converter output or in `setups/clarin/README.md`.

Status 2026-09-15: done; the decisions are in
`setups/clarin/corpus_config/README.md`. Beyond the expected items the
converter surfaced three more: the POS `translationKey: "pos_"` never had
matching translations, so dropping it changes nothing; the `msd` attribute
carried an inline Angular template and controller (the MSD info modal),
dropped in favour of `sidebar_info_url` (step 4.2); and the MeMo custom
attribute patterns embedded a `qtch` variable that only worked as an
accidental global under the old script loader, which the converter
resolved to literal quotes. The `rel="localize[...]"` spans in those
patterns remain a Phase 3.4 check. The old JS mode files stay in the repo
until Phase 3 replaces the frontend image that is built from them.

---

## 8. Phase 3: Frontend base image and the CLARIN config dir

Goal: upstream v9.15.1 built with our config dir, served by nginx, loading
all 11 modes against the Phase 2 backend. Code-level customisations are
Phase 4; this phase is configuration only.

**3.1 New `frontend/Dockerfile`.**

- `FROM node:24-bookworm AS build`; clone `korp-frontend`, `git checkout v9.15.1`, `yarn`.
- Apply patches: `for p in /patches/*.patch; do git apply --3way "$p"; done`
  (directory may be empty in this phase).
- Install mkdocs with `pip` (or use a separate `python:3` stage).
- No entrypoint, as today; setup images extend it.

Verify (image builds, deps resolve):
```bash
docker-compose build frontend && docker run --rm korp_frontend_base node --version
```
Expected: `v24.x`.

**3.2 CLARIN config dir** at `setups/clarin/frontend/config/`:

```
config.yml
modes/            (only *_mode.js needing code, plus msdtags.html)
custom/           (statistics.js from the converter; clarin.css)
translations/     corpora-dan.json  corpora-eng.json  locale-dan.json  angular-locale_dan.js
img/              nors_logo.svg (download the KU branding image instead of hot-linking it)
```

`config.yml` is produced from `config.js` using Appendix A. Minimum content:

```yaml
korp_backend_url: http://localhost:1234      # overridden at build time for production
languages:
  - value: dan
    label: Dansk
  - value: eng
    label: English
default_language: dan
visible_modes: 5
autocomplete: false
word_picture: false
map_enabled: false
enable_frontend_kwic_download: true
hits_per_page_values: [25, 50, 75, 100, 500, 1000]
hits_per_page_default: 25
default_overview_context: 1 sentence
default_reading_context: 1 paragraph
default_within:
  sentence: sentence
default_options:
  is: "="
  is_not: "!="
  starts_with: "^="
  contains: "_="
  ends_with: "&="
  matches: "*="
  matches_not: "!*="
reduce_word_attribute_selector: intersection
reduce_struct_attribute_selector: intersection
cqp_prio: [deprel, pos, msd, suffix, prefix, grundform, lemgram, saldo, word]
group_statistics: []
logo:
  organization: |
    <a class="hidden lg:flex items-end" href="https://nors.ku.dk" target="_blank">
      <span>Institut for Nordiske Studier og Sprogvidenskab</span>
      <img src="img/nors_logo.svg" class="h-20 ml-2" />
    </a>
    <a class="ml-4" href="userguide/" target="_blank">Brugervejledning</a>
common_struct_types:            # from common.js settings.commonStructTypes, if still wanted
  date_interval:
    label: { dan: tidsinterval, eng: time interval }
    hide_sidebar: true
    hide_compare: true
    hide_statistics: true
    opts: false
    extended_component: dateInterval
```

**3.3 CLARIN frontend Dockerfile.** Extends the base: copy `config/` to
`/opt/korp-config`, write `run_config.json` with
`{"configDir": "/opt/korp-config"}`, substitute `korp_backend_url` from a
build arg, build the user guide, `yarn build`, then a final
`FROM nginx:alpine` stage copying `dist/` to `/usr/share/nginx/html` and the
mkdocs site to `/usr/share/nginx/html/userguide`, listening on 9111 so the
compose port mapping stays.

As built 2026-09-15 (`setups/clarin/frontend/Dockerfile`):

- `config.yml` carries the placeholder `__KORP_BACKEND_URL__`; the build
  replaces it from the `KORP_BACKEND_URL` build argument (production
  default in `docker-compose.yml`, `http://localhost:1234` in the local
  `.env`) and greps for the result, so a typo fails the build.
- The build asserts that `dist/translations/locale-dan.*` and
  `dist/modes/msdtags.html` exist, which proves the config directory was
  used.
- The user guide is built in a separate `python:3.12-slim` stage. It is
  copied from `doc/userguides`, which the Dockerfile can reach because the
  compose build context is the repository root (`context: ../..`, with a
  root `.dockerignore`). That replaces the `korp_docs` image and the `doc`
  service, and removes the build race where the frontend image was built
  before the docs image existed. A first version used Compose's
  `additional_contexts` for this, which needs the v2 plugin; Alf turned
  out to run the v1 `docker-compose` binary only (checked 2026-09-15), so
  the file was changed to the root context and got its `version` key
  back, which v1 requires and v2 ignores. Validated and built with both.
- `nginx:1.27-alpine` serves `dist/` and `userguide/` on 9111 with long
  cache headers for the hashed bundles and no-cache for `index.html`.
- The base image (`frontend/Dockerfile`) is `node:24-bookworm`, checks out
  `KORP_FRONTEND_REF` (default `v9.15.1`), applies `frontend/patches/*.patch`
  with `git apply --check` first, and installs with `--frozen-lockfile`.

Verify (build):
```bash
cd setups/clarin && docker-compose build frontend
```
Expected: exit 0. TypeScript errors here mean a patch no longer applies or
a `custom/*.js` file imports a renamed module; fix before continuing.

Verify (serving):
```bash
docker-compose up -d frontend
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9111/
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9111/userguide/
curl -s http://localhost:9111/ | grep -o 'index\.[0-9a-f]*\.js'
```
Expected: `200`, `200`, one hashed bundle name.

Verify (translations are picked up; three-letter naming):
```bash
curl -s http://localhost:9111/ | grep -o 'translations/[a-z-]*dan[^"]*' | sort -u
```
Expected: `locale-dan.<hash>.json`, `corpora-dan.<hash>.json`,
`angular-locale_dan.<hash>.js` referenced (or fetched at runtime; check the
browser network tab shows 200 for all three and none for `locale-da`).

**3.4 Browser checks, every mode.** In a browser with the console open, for
each of the 11 modes:

1. Page loads with zero console errors.
2. The mode switcher shows 5 modes and a "More" dropdown with the other 6,
   labelled in Danish; switching to English relabels them.
3. Corpus chooser shows the folder tree from the mode YAML and the
   preselected corpora are ticked.
4. Simple search for a common word returns hits; the KWIC sidebar opens on
   click and lists word attributes then text attributes in the configured
   order with Danish labels.
5. Extended search: the POS attribute offers a dropdown with the dataset
   values (translated where `translation` maps exist).
6. Statistics tab: "group by" lists the attributes not marked
   `hide_statistics`; a row click opens an example KWIC.
7. MeMo modes: the custom author block renders in the sidebar (custom
   attribute with `pattern`); reading mode link appears if `reading_mode`
   is set and the corpus has the `_head`/`_tail` attributes (check with
   `cwb-describe-corpus`; if absent, reading mode stays off for now).
8. Trend diagram button is enabled for corpora with time data (FT, LSP)
   and the `/timespan` request succeeds.

Record the result as a table (mode x check) in the PR description.

Status 2026-09-15: 3.1 to 3.3 passed (base image Node 24.21 with
korp-frontend v9.15.1 and an empty patch set; CLARIN image builds with
webpack size warnings only; `/`, `/userguide/`, every `dan`/`eng`
translation file and `modes/msdtags.html` answer 200; the local backend URL
is baked in). 3.4 results, all against the YAML from Phase 2:

| Mode | Loads | Hits | Notes |
|---|---|---|---|
| default | yes | 227 for "klima" | same as old frontend; sidebar labels Danish; POS dataset widget; statistics table |
| FT | yes | 818 for "klima" | 20 struct attributes with Danish labels |
| memo_all | yes | 362 for "kjærlighed" | Forfatter and Bog custom blocks render with localised labels, so the `rel="localize[...]"` spans still work |
| medieval_ballads | yes | 5 for "og" | matches golden; `view_ballad` link pattern and the custom word block render |
| memo_yearcorpora | yes | 531,769 | 30 of 30 preselected; translated struct labels |
| threats | yes | 446 | 4 corpora preselected |
| saxo_danish | yes | 10,822 | |
| memo_frakturcorr | yes | 154,878 | 21 of 21 |
| memo_authornovels | yes | 15,913 | |
| memo_frakturgold | yes | 457 | matches golden |
| da1800 | yes | 2,924 | active mode promoted into the visible mode list |

Also checked: English relabels the modes and UI; the corpus chooser shows
the LSP folder tree with six subfolders, the preselection and the time
graph from `/timespan`; extended search lists all attributes with Danish
labels and the `within` choice is ordered sentence < paragraph < text.
Reading mode is not configured for any corpus (as before), so step 7's
`_head`/`_tail` question is moot until someone wants it.

Carried into Phase 4: the 96 missing Danish keys show as raw keys in the
UI (`free_order_chk`, `midfix`, `show_context`, `num_results_relative`);
the upstream MENU button is visible; two mode labels (`memo_fraktur_corrected`,
`memo_fraktur_goldstandard`) are untranslated keys long enough to wrap the
header at narrow widths. Carried into Phase 5: a browser that cached the
old `index.html` shows a blank page after cut-over because it requests the
old `bundle.js`; the new nginx marks `index.html` no-cache, but the old
server did not, so expect a few reloads or a short cache purge.

---

## 9. Phase 4: Code-level customisations

Each item is independent; do them in the order below because the earlier
ones are cheaper and the later ones need a decision.

**4.1 Danish UI translation.** Rename `locale-da.json` to `locale-dan.json`,
drop the 99 keys upstream no longer uses, translate the 96 new keys. Same
for `locale-en.json`: keep only overrides that still exist upstream
(`user_guide` and `danish` are no longer needed once the header is
configured).

Verify (key parity):
```bash
python3 - <<'EOF'
import json, sys
up = json.load(open("korp-frontend/app/translations/locale-eng.json"))
da = json.load(open("setups/clarin/frontend/config/translations/locale-dan.json"))
missing = sorted(set(up) - set(da)); stale = sorted(set(da) - set(up))
print("missing:", len(missing), missing[:10]); print("stale:", len(stale), stale[:10])
sys.exit(1 if missing or stale else 0)
EOF
```
Expected: `missing: 0`, `stale: 0`. Put this check in the frontend
Dockerfile so a future upstream bump fails the build when new keys appear.

As built 2026-09-15: `scripts/locale_dan_sync.py` rebuilds `locale-dan.json`
to exactly upstream's key set (338 keys): 242 carried over, 99 obsolete
dropped, 96 translated in the script's `NEW_DANISH` table (review the
Danish there; `fail_contact` and `login_help` now point to the institute
instead of Språkbanken's mailbox). Three keys changed meaning upstream and
are overridden: `prefix`/`midfix`/`suffix` are now the compound checkboxes
("først i ord", "inde i ord", "sidst i ord"), not attribute labels. Our own
UI keys (`download_customkwic_csv/tsv`, `download_all_kwic_csv`) moved to
`corpora-dan.json`/`corpora-eng.json`, which the frontend merges into the
same table, so `locale-dan.json` can stay identical in shape to upstream.
The CLARIN Dockerfile runs the parity check before `yarn build`. The eight
mode labels that were untranslated keys now have Danish and English labels
in `modes/*.yaml` (review: Middelalderballader, MeMo pr. år, Trusler,
Saxo, MeMo: korrigeret fraktur, MeMo pr. forfatter, MeMo:
frakturguldstandard, Dansk 1800-tal).

**4.2 MSD tag reference page.** Copy `msdtags.html` into
`config/modes/msdtags.html` (webpack copies `modes/*html` to `dist/modes/`),
and set `sidebar_info_url: modes/msdtags.html` on the `msd` attribute preset
in the backend YAML.

Verify: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9111/modes/msdtags.html`
is `200`, and the sidebar shows the info icon next to MSD that opens it.

As built 2026-09-15: `sidebar_info_url: modes/msdtags.html` on the two msd
presets (`msd`, `msd__threats`), which every corpus with an msd attribute
references.

**4.3 KWIC CSV export.** Try upstream's export on a MeMo search first:
`Download hit page as > One sentence per row (CSV)`. Compare with a file
produced by the old stack for the same query. If the missing pieces (one
column per match token, per-token annotations, `;`, BOM) are still
required, port `transformDataToCustomKWIC` to TypeScript in
`app/scripts/kwic/kwic_download.ts` as `frontend/patches/0001-kwic-per-token-csv.patch`,
adding a `customkwic` data type and the two menu options in
`components/kwic/kwic.ts`. Then open an upstream PR against `dev`.

Verify: `git apply --check frontend/patches/0001-*.patch` succeeds against
`v9.15.1`; the download of a two-token query yields headers
`match1,match2,...` and a BOM (`head -c 3 file | xxd` is `efbbbf`).

As built 2026-09-15: kept, as `frontend/patches/0001-kwic-per-token-csv.patch`
(202 lines). The port lives in a new file
`app/scripts/kwic/kwic_download_clarin.ts`; the upstream files get only
three `export` keywords in `kwic_download.ts` and two menu options plus one
branch in `kwic.ts`, so the patch has little surface to conflict with on
the next bump. Two more options in the menu: "En konkordanslinje pr. række
(CSV)" and "(TSV)". `tsc --noEmit` passes with both patches applied.

**4.4 Exporter hook.** Patch `components/kwic/kwic.ts`
(`frontend/patches/0002-exporter-download-all.patch`) to add
`{ value: "exporter/csv", label: "download_all_kwic_csv" }` whose `init`
builds the exporter URL from `$ctrl.params` (already the exact `/query`
parameter object) plus `hits_display=$ctrl.hits`, using the current origin
with the same `9111` to `4000` port rewrite for local use. Remove the
dependency on `#json-link`.

Verify: with the exporter container running, choosing the option opens
`http://localhost:14000/download/csv?...&cqp=...` in a new tab and the
progress bar completes for a small query; the exporter log shows
`Fetching data from URL: http://backend:1234/query?...`.

As built 2026-09-15: `frontend/patches/0002-exporter-download-all.patch`
(86 lines) adds `app/scripts/kwic/kwic_exporter_clarin.ts`, an
`exporter_url` setting (typed in `app-settings.types.ts`) and the option
"Alle konkordanslinjer (CSV)", shown only when the setting is set. The URL
is built from `$ctrl.params` plus `hits_display`, no DOM scraping.
`config.yml` gets `exporter_url` from the `KORP_EXPORTER_URL` build
argument: production default `download/csv` (relative to the page, so
`https://alf.hum.ku.dk/korp/download/csv` as before), local `.env`
`http://localhost:14000/download/csv`.

Status 2026-09-15 for 4.1 to 4.4: all verified in the browser against the
rebuilt image. The parity check passes at build time (338 keys); the
simple-search options read "først i ord / inde i ord / sidst i ord / i
vilkårlig rækkefølge", "Vis kontekst" and "Relativ frekvens" replaced the
raw keys. The sidebar carries the MSD info link to `modes/msdtags.html`.
The download menu has eight entries; the custom CSV of the "klima" search
starts with the bytes `ef bb bf`, is semicolon-separated and has the
header `corpus;match_position;left context;match;right_context;text_title;word;pos;msd;lemma`.
"Alle konkordanslinjer (CSV)" opened the exporter page with the query
(227 rows), and its download completed ("Færdig, 100%") after three
`/query` fetches from `http://backend:1234`. One repair on the way: the
exporter image no longer built on this arm64 machine because gevent 23.7
has no Python 3.8 wheel for it and its source build needs Cython 3.0 but
fails on 3.1; `exporter/Dockerfile` now upgrades pip and pins the build
Cython. On x86_64 production a wheel is used and the pin is idle.

**4.5 Header details.** With `languages`, `logo.organization` and the
user-guide link in place, hide the upstream burger menu with a rule in
`custom/clarin.css` (`#top_bar div[uib-dropdown] { display: none }`; the "More" modes menu is an `li[uib-dropdown]` and must stay) imported
from `modes/default_mode.js` via `import "custom/clarin.css"`. If a mode
file is needed for every mode just for this, prefer a patch that makes the
menu configurable and propose it upstream.

Verify: no Språkbanken menu visible; language switch shows Dansk and
English; `#?lang=da` in an old bookmark is rewritten to `lang=dan` and the
UI is Danish.

As built 2026-09-15: no patch and no per-mode file. `custom/components.js`
is required by upstream for every mode, so it imports `custom/clarin.css`
(which hides `#top_bar div[uib-dropdown]`) and tags `<body data-korp-mode>`.

**4.6 Per-mode colours.** Old `settings.primaryColor` per mode has no
equivalent. Either drop it, or keep a two-line `<mode>_mode.js` per mode
that sets a CSS variable used by `custom/clarin.css`.

Verify: visual, mode by mode.

As built 2026-09-15: what the per-mode `primaryColor` actually did in
the 2022 frontend, from its source at `d3a0951`:

- `selector_widget.js` wrote `settings.primaryColor` as an inline
  `background-color` on every corpus row (`.boxdiv`) in the corpus
  chooser. This was the only visible use.
- `result_controllers.js` computed a `_color` per KWIC row from the same
  settings, but no template rendered it: dead code.
- KWIC row stripes and the hit-distribution bar used `$primaryColor` from
  `styles.scss`, a Sass variable compiled to upstream's blue at build time
  and unaffected by the setting.

So in the old site the default mode had pink corpus rows in the chooser
and blue KWIC rows. Upstream 9.15 dropped the setting and now hardcodes
the same blue as an inline style on the chooser rows (`tree.ts`).
`custom/clarin.css` reproduces the old look with
`body[data-korp-mode="..."] .corpus-chooser .boxdiv` rules marked
`!important`, which is what it takes to beat an inline style (pink for
default, Saxo and da1800; whitesmoke for MeMo and FT; beige for the
ballads; grey for threats). Nothing else is recoloured. The first two
versions of this CSS painted the KWIC rows and then the hit bar instead;
both caught by the user's questions and corrected, see 4.7.

Status 2026-09-15 for 4.5 and 4.6: verified. `#top_bar div[uib-dropdown]`
computes to `display: none` while the "More" modes menu stays visible;
in the default mode KWIC rows compute to upstream's `rgb(221, 233, 255)`
/ `rgb(242, 247, 255)`, the hit-distribution cells to `rgb(221, 233, 255)`,
and the four corpus rows of an expanded chooser folder to
`rgb(247, 209, 228)`.

**4.7 Fidelity audit.** After the row-colour slip, every decision of
Phases 2 to 4 was re-checked against what the 2022 frontend actually did
(its source at `d3a0951`, the Phase 0 screenshots, and CST's patched
translation files). Found and corrected on 2026-09-15:

- Colours (above): the per-mode colour belongs to the corpus-chooser
  rows only. The KWIC rows and hit bar were always upstream's blue, which
  upstream hardcodes in `styles.scss`; CST never patched colours in code,
  it only set the per-mode values in the mode files.
- Eight English strings CST had customised were silently back to upstream
  wording because the patched `locale-en.json` no longer exists. Restored
  through `corpora-eng.json`, which loads after `locale-eng.json` and
  wins: `before_token`, `after_token`, `boundary_unit`, `within_paragraph`
  ("paragraph"), `within_text` ("text"), `compare_distinctive`
  ("Statistically overrepresented in"), `word` ("Token"),
  `compound_middle`. Not restored: CST's `prefix`/`suffix` ("Prefix",
  "Suffix"), because upstream now uses those keys for the "starts with" /
  "ends with" checkboxes.
- The word attribute label: `word_label` is now Ordform / Token, as the
  old locale files had it.
- Language switch labels: "Dansk | Engelsk" in the Danish UI, "Danish |
  English" in the English UI, as before; the user-guide link says "User
  guide (in Danish)" in English, as before.

Deviations that remain, each deliberate and open for the team to reverse:

- The download menu has eight entries in upstream's order, including
  upstream's own "One sentence per row (CSV/TSV)" pair. The old menu had
  those two commented out and listed ours first. Hiding them means
  touching two more upstream lines in patch 0001.
- The old header showed a "Log ind" link (`basic_auth`). It never worked
  here: the backend had no `AUTH_SERVER` and no corpus is `limited_access`.
  Not configured in `config.yml`; add `auth_module: basic_auth` to get the
  link back.
- The frontpage now shows a two-sentence description with a user-guide
  link; the old frontpage was empty. Text in `config.yml`, `description`.
- Eight mode labels that were raw keys in the old menu now have real
  Danish and English names (listed under 4.1); the raw keys were never
  intended.
- `map_enabled` is `false`, where the old `settings.enableMap` was `true`.
  No corpus has geo attributes, so the only visible effect would be a
  permanently disabled "Show map" button in the statistics tab.
- `within` lists are ordered sentence < paragraph < text, as the backend
  documentation requires; the old MeMo dropdown listed text first.

Behaviour changes that come from upstream, not from this migration, and
that users will notice: the "in order" checkbox became "in free order"
with inverted meaning (9.5.2); extended-search attributes are sorted
alphabetically (9.13); statistics load when the tab is opened instead of
with every search (9.9); the JSON button downloads the stored response
(9.11); Enter in the simple search box works again (9.7.2).

---

## 10. Phase 5: Compose, proxy and cut-over

**5.1 Compose.** In `setups/clarin/docker-compose.yml`: backend gains the
`corpus_config` volume; frontend build gets `args: KORP_BACKEND_URL=...`;
everything else unchanged. Root `docker-compose.yml` still builds the two
base images.

Verify: `docker-compose config` prints without error; `docker-compose up -d --build`
brings up `backend`, `frontend`, `doc`, `exporter`, `backend-v6`, `fcs`.

Status 2026-09-15: passed locally (the `doc` service is gone, see 3.3).
`docker compose config` is valid; `backend`, `frontend`, `exporter`,
`backend-v6` (reports 6.1.0, 158 corpora) and `fcs` (Tomcat answers
`/fcs-korp-endpoint/sru?operation=explain` with 200) are up, and
`fcs-prep` runs its 35 tests (0 failures, 3 skipped) and exits 0. Two
things were repaired on the way, neither caused by the migration:
`docker/fcs/prep/Dockerfile` ran `mvn test` from `target/` where there is
no `pom.xml` (MissingProjectException on every start), now
`mvn -f /opt/fcs-korp-endpoint/pom.xml test`; and the exporter image
needed the arm64 build fix described under 4.4. The old
`setups/clarin/frontend/app/` overlay and `frontend/exec/sync.sh` were
deleted: nothing builds from them any more, and the overlay's `config.js`
carried the local-testing backend URL in a commit. The root `README.md`
was rewritten for the new layout, and `setups/clarin/README.md` (new) is
the deploy runbook for Alf.

**5.2 Production build arguments.** `KORP_BACKEND_URL=https://alf.hum.ku.dk/korp/backend`.
The nginx gateway on Alf keeps proxying `/korp/` to 9111 and
`/korp/backend/` to 1234. Backend 8.2.0 ships Flask-Cors with permissive
defaults, so cross-origin calls keep working.

Verify on Alf (staging port first if possible):
```bash
curl -s https://alf.hum.ku.dk/korp/backend/info | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])'
curl -s -o /dev/null -w '%{http_code}\n' https://alf.hum.ku.dk/korp/
curl -s -o /dev/null -w '%{http_code}\n' https://alf.hum.ku.dk/korp/userguide/
```
Expected: `8.2.5`, `200`, `200`. (The version string inside the v8.2.0
tag is 8.2.5, see 1.3.)

Status 2026-09-15: not run; Alf is not reachable from the migration
machine. The exact commands, in the backend-first order from 1.6, are in
`setups/clarin/README.md`. Nothing on Alf needs a `.env` file: the compose
defaults are the production values.

**5.3 Rollback.** Tag the old images before deploying
(`docker tag korp_backend_base korp_backend_base:2022`), keep the old
compose file in git history, and keep the `/opt/corpora` volume untouched
(no data migration is involved). Rolling back is `git checkout <old>` plus
`docker-compose up -d`.

**5.4 Repeat the Phase 3.4 browser table** against production, and re-run
`scripts/golden.sh` against the production backend URL.

Status 2026-09-15: pending the deploy. One extra production check worth
doing right after the backend step: `scripts/golden.sh
https://alf.hum.ku.dk/korp/backend fixtures/prod` followed by
`diff -r fixtures/old fixtures/prod`, since the local fixtures were taken
from the same corpora.

---

### Review of the migration commit

The squashed commit for Phases 0 to 5 was given a subtractive review on
2026-09-15 and the findings applied: `fixtures/new-backend` (a run output
identical to `fixtures/old`) deleted and future run directories
git-ignored; the backend image no longer installs `subversion`, `bison`,
`flex`, `gawk`, `make`, `wheel` or a `python` symlink, none of which had a
consumer; `constraints.txt` keeps only the four evidence-based pins;
`autocomplete: false` and `word_picture: false` live only in `config.yml`
(the converter now reports per-mode values as residue instead of
emitting them); the CLARIN frontend Dockerfile keeps one placeholder
check instead of two; nginx lost a redundant `/userguide/` block; and
four comments that had gone stale were corrected. After the changes the
two base images and the CLARIN images were rebuilt and the golden diff,
the per-mode `corpus_config` check, the HTTP checks and the converter
dry runs were repeated.

## 11. Phase 6: The other setups

Same recipe with the CLARIN work as the template. Order by risk:

1. `threats` (4 corpora, one mode, plain attributes).
2. `memotest` (shares MeMo modes with CLARIN; the YAML can be shared by
   symlink or by giving corpora a second `mode:` entry).
3. `billeballads`.
4. `lanchart` and `lancharttest`: already have `custom/sidebar.js`
   (partitur link); port the `partiturLink` component to the current
   sidebar-component contract (`$scope.wordData`, `$scope.sentenceData`
   still exist). Kalaallisut modes.

Verify per setup: the Phase 2 counts, the Phase 3 build, the Phase 3.4
browser table.

---

## 12. Phase 7: Staying close to upstream

- `frontend/patches/` is the complete list of source deviations. The base
  Dockerfile runs `git apply --check` for each before applying; a failing
  check is the first thing to fix on the next bump.
- Bumping: change the tag in one Dockerfile per image, rebuild, re-run the
  key-parity check (4.1), the corpus_config warnings check (2.2), the golden
  diff (1.4), and the browser table (3.4). Read the upstream `CHANGELOG.md`
  section for the new version before bumping.
- Propose the two patches upstream (per-token CSV columns; configurable
  header menu). Each accepted PR deletes a patch file.

**Bump dry run, 2026-09-15**, against upstream backend `dev` (8.3.0,
untagged), built into a throwaway image tag and run on a spare port; no
repository file changed. Three attempts, each stopped by a named
build-time failure or passed:

1. Committed Dockerfile as is: fails in `pip install` because dev's
   `mysqlclient==2.2.7` builds from source and needs `pkg-config`, which
   the runtime image does not have. Our tag-specific pins were never
   reached.
2. Plus `pkg-config`, minus `constraints.txt` and
   `requirements-overrides.txt` (as the constraints header says to do on a
   bump): fails because jammy's pip 22.0 mis-reads the metadata that
   mysqlclient 2.2's build backend produces ("project name unknown") and
   discards the package.
3. Plus `pip install --upgrade pip`: builds. Smoke tests pass with
   `korp 8.3.0`, `mysqlclient 2.2.7` and `gevent ok` on today's
   zope.event 6.2 / zope.interface 8.6, so the pkg_resources problem that
   forced the zope pins belongs to gevent 22 and is gone in gevent 25.
   At runtime: 158 corpora, CQP 3.4.27, golden diff identical for all 34
   fixtures, `corpus_config` without warnings, and the 8.3.0 novelty
   visible as `Cache-Control: public,max-age=3600` on `corpus_info`.

Conclusions: the safety net works (two failures with a nameable cause,
nothing half-applied, a runtime diff that passed once the build did), and
the recipe for the real bump when 8.3.0 is tagged is three lines: add
`pkg-config` to the runtime apt list, add `pip3 install --upgrade pip`
before the requirements, and delete both pin files. One thing to check on
that bump: whether `corpus_config` also gets the hour-long cache header,
because then YAML edits reach browsers only after the cache expires.
Nothing was changed now; 8.3.0 is still untagged.
- **FastAPI 9.0 readiness.** When a `korp-frontend` release targets the
  9.0 backend: the corpus config directory layout is unchanged in the
  `fastapi` branch (`CORPUS_CONFIG_DIR`), so Phase 2 output carries over.
  The backend image changes to `python:3.12` with `uv sync`, `.env`
  configuration (`DB_*` names, `CORS_ALLOW_ORIGINS` must list the frontend
  origin because CORS is off by default), and `gunicorn` with an ASGI
  worker. The exporter's `/query` URL becomes `/concordance` with
  `offset`/`limit` instead of `start`/`end`. None of that needs to be done
  now; it only needs to not be designed against.

---

## 13. Risks and open questions

| Risk | Mitigation |
|---|---|
| Reading mode for MeMo may need `_head`/`_tail` positional attributes that the corpora lack | Check with `cwb-describe-corpus` in Phase 3.4; if absent, disable `reading_mode` and note it as a re-encoding task |
| `pattern` templates in MeMo custom attributes use `rel="localize[...]"` spans, a deprecated mechanism | Test in 3.4 step 7; replace with `translation`/labels if the spans no longer localise |
| `translationKey: "pos_"` is gone; POS value translations must become `translation:` maps on the preset | Converter generates them from `corpora-da.json`/`corpora-en.json` `pos_*` keys; verify in 3.4 step 5 |
| `corpora-sv.json` and Swedish strings scattered in modes | Dropped; `languages` lists only `dan` and `eng` |
| Node 24 build memory in Docker | If `yarn build` is killed, set `NODE_OPTIONS=--max-old-space-size=4096` |
| Old bookmarks with `?mode=FT` and `#?lang=da` | Mode ids unchanged; `iso_languages` rewrites `da` to `dan` |
| The `hits_display` total used by the exporter now comes from `$ctrl.hits` | Verified in 4.4 |
| `db_setup.sql` seeds time data for corpora that may not exist locally | Harmless; `timespan` ignores unknown corpora |
| FCS stack (`backend-v6`) pins Ubuntu focal and a 2019 backend | Untouched; separate containers |

Open questions for the team:

1. Keep the custom KWIC CSV format (4.3) or adopt upstream's?
2. Is the MSD tag page still the right reference for the Danish tagsets used
   across modes, or should each mode link its own?
3. Which of the 11 modes should stay visible (`visible_modes: 5` today)?
4. Should `memotest` be retired now that CLARIN carries the MeMo modes?

---

## Appendix A: `config.js` to `config.yml` key mapping

| `config.js` (old) | `config.yml` (new) | Note |
|---|---|---|
| `settings.korpBackendURL` | `korp_backend_url` | build-time substitution |
| `settings.languages = ["en","da"]`, `defaultLanguage` | `languages: [{value: dan, label: Dansk}, {value: eng, label: English}]`, `default_language: dan` | three-letter codes |
| `settings.modeConfig` (localekey, mode) | backend `modes/<mode>.yaml` `label`, `order` | mode list comes from `/corpus_config` |
| `settings.visibleModes` | `visible_modes` | |
| `settings.autocomplete` | `autocomplete` | |
| `settings.enableMap`, `newMapEnabled`, `mapPosTag`, `mapCenter` | `map_enabled`, `map_center` | `mapPosTag`, `newMapEnabled` gone |
| `settings.hitsPerPageDefault`, `hitsPerPageValues` | `hits_per_page_default`, `hits_per_page_values` | |
| `settings.enableFrontendKwicDownload` | `enable_frontend_kwic_download` | |
| `settings.enableBackendKwicDownload`, `downloadFormats`, `downloadFormatParams`, `downloadCgiScript` | none | removed upstream in 9.13 |
| `settings.groupStatistics` | `group_statistics` | |
| `settings.wordAttributeSelector`, `structAttributeSelector`, `filterSelection` | none | only `reduce_*` remain |
| `settings.reduceWordAttributeSelector`, `reduceStructAttributeSelector` | `reduce_word_attribute_selector`, `reduce_struct_attribute_selector` | |
| `settings.newsDeskUrl` | `news_url` (YAML file) | we leave it unset |
| `settings.wordpictureTagset`, `wordPictureConf` | `word_picture_tagset`, `word_picture_conf` | same shape; `word_picture: false` in all our modes anyway |
| `settings.primaryColor`, `primaryLight` | none | see 4.6 |
| `settings.defaultOverviewContext`, `defaultReadingContext` | `default_overview_context`, `default_reading_context` | |
| `settings.defaultWithin` | `default_within` | same shape |
| `settings.cqpPrio` | `cqp_prio` | |
| `settings.defaultOptions` | `default_options` | same shape |
| `settings.readingModeField` | none | per-corpus `reading_mode` |
| `settings.lemgramSelect`, `settings.wordpicture` (mode files) | none, `word_picture` | |
| `settings.commonStructTypes` (common.js) | `common_struct_types` | keys snake_cased |
| `settings.corpusListing = new CorpusListing(...)` | none | delete |

## Appendix B: attribute key mapping (JS mode files to YAML)

| Old key | New key | Note |
|---|---|---|
| `label` | `label` | may be `{dan: ..., eng: ...}` |
| `opts` | `opts` | same values; `liteOptions` becomes the literal `{is: "=", is_not: "!="}` |
| `extendedComponent` | `extended_component` | |
| `escape` | `escape` | |
| `order` | `order` | |
| `dataset` | `dataset` | |
| `translationKey: "pos_"` | `translation: {ADJ: {dan: ..., eng: ...}, ...}` | generated from `corpora-*.json` |
| `displayType: "hidden"` | `display_type: hidden` | |
| `hideSidebar`, `hideStatistics`, `hideExtended`, `hideCompare` | `hide_sidebar`, `hide_statistics`, `hide_extended`, `hide_compare` | |
| `isStructAttr` | `is_struct_attr` | |
| `internalSearch`, `externalSearch` | `internal_search`, `external_search` | |
| `sidebarComponent` | `sidebar_component` | component name in `custom/sidebar.js` |
| `stringify` (function) | `stringify: "<key>"` | function moves to `custom/stringify.js` |
| `stats_stringify` (function) | `stats_stringify: "<key>"` | function moves to `custom/statistics.js` |
| `stats_cqp` (function) | `stats_cqp: "<key>"` | same |
| `pattern` | `pattern` | lodash template; `val`, `key`, `pos_attrs`, `struct_attrs` still available |
| `type: "set"` / `"url"` | `type` | |
| `customAttributes: {x: {label, order, customType, pattern}}` | corpus `custom_attributes: [{x: {label, custom_type, pattern}}]` | |
| corpus `within: {sentence: "sentence"}` | `within: [{label: {dan: sætning, eng: sentence}, value: sentence}]` | |
| corpus `context: {"1 sentence": "1 sentence"}` | `context: [{label: ..., value: 1 sentence}]` | |
| corpus `attributes` / `structAttributes` (objects) | `pos_attributes` / `struct_attributes` (lists of one-key maps, values are preset names or inline definitions) | |
| `settings.corporafolders.x = {title, contents, description}` | mode `folders: {x: {title, description, subfolders}}` plus `mode: [{name, folder: x}]` on each corpus | |
| `settings.preselectedCorpora` | mode `preselected_corpora` | an empty list now selects nothing |

## Appendix C: corpus ids referenced by the CLARIN modes (111)

DUDSDFK_BILLALL, FT_KORPUS, LIT1800JPJNL, LIT1800JPJNLT,
LSPAGRICULTUREJORDBRUGSFORSKNING, LSPBYGGERI3C, LSPCLIMATEAKTUELNATURVIDENSKAB,
LSPCLIMATEDMU, LSPCLIMATEHOVEDLAND, LSPCLIMATEOEKRAAD, LSPCONSTRUCTIONEB1,
LSPCONSTRUCTIONEB2, LSPCONSTRUCTIONMURO, LSPCONSTRUCTIONSBI,
LSPHEALTH1AKTUELNATURVIDENSKAB, LSPHEALTH1LIBRISSUNDHED, LSPHEALTH1NETPATIENT,
LSPHEALTH1REGIONH, LSPHEALTH1SOEFARTSSTYRELSEN, LSPHEALTH1SST,
LSPHEALTH2SUNDHEDDK1, LSPHEALTH2SUNDHEDDK2, LSPHEALTH2SUNDHEDDK3,
LSPHEALTH2SUNDHEDDK5, LSPNANOAKTUELNATURVIDENSKAB, LSPNANONANO1, LSPNANONANO2,
LSPNANONANO3, LSPNANONANO4, SAXODEL01 to SAXODEL16, memo_1870 to memo_1899,
memo_all, memo_bangh_faedra_1883, memo_bangh_praester_1883,
memo_bangh_stilleeksistenser_1886, memo_bangh_stuk_1887, memo_bangh_tine_1889,
memo_fraktur_corr_1870 to memo_fraktur_corr_1891 (no 1879), memo_fraktur_gold,
memo_pontoppidan_isbjoernen_1887, memo_pontoppidan_mimoser_1886,
memo_pontoppidan_sandingemenighed_1883, memo_pontoppidan_staekkedevinger_1881,
threats_art, threats_jeb, threats_jtb, threats_kar.

Note the mixed case: CWB corpus ids are upper-case in the registry, the
backend YAML file names must be lower-case, and `corpus_info` accepts either.

## Appendix D: upstream references

- Frontend configuration: `korp-frontend/doc/frontend_devel.md` at v9.15.1
- Backend corpus configuration: `korp-backend/README.md` at v8.2.0, section
  "Corpus Configuration for the Korp Frontend"
- Reference instance config: `spraakbanken/korp-frontend-sb` (`app/config.yml`,
  `app/custom/*`) and `spraakbanken/korp-config` (1121 corpus YAML files,
  presets)
- Backend endpoint implementation: `korp/views/corpus_config.py` at v8.2.0
