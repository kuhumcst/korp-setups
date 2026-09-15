# CLARIN setup (alf.hum.ku.dk/korp)

The Korp instance for CLARIN-DK: korp-frontend v9.15.1 and korp-backend
v8.2.0 from Språkbanken, built by the base images in `../../frontend` and
`../../backend`, plus this setup's configuration, the user guide, the KWIC
exporter, and the separate CLARIN FCS endpoint stack.

## Layout

```
docker-compose.yml        services: backend, frontend, exporter, backend-v6, fcs-prep, fcs
.env                      local only, git-ignored: CORPORA_DIR, KORP_BACKEND_URL, KORP_EXPORTER_URL
corpus_config/            corpus and mode configuration served by the backend (/corpus_config); see its README
corpora/encodingscripts/  cwb-encode recipes
frontend/Dockerfile       builds the Korp bundle with frontend/config/, the user guide, and an nginx image
frontend/config/          the frontend configuration directory (config.yml, translations/, custom/, modes/, img/)
frontend/nginx.conf       serves dist/ and /userguide/ on port 9111
docker/backend-v6, docker/fcs   the FCS endpoint stack (old backend + Tomcat), unchanged by the 2026 migration
```

There is no patched copy of upstream source in this directory. The few
source changes we need live in `../../frontend/patches/` and are applied
when the base image is built.

## Local run

Requirements: Docker with either the Compose v2 plugin (`docker compose`)
or the old v1 binary (`docker-compose`); the compose file works with both.
Plus the CLARIN corpora (CWB `data/` and `registry/` directories) somewhere
on disk.

1. Create `.env` next to `docker-compose.yml`:
   ```
   CORPORA_DIR=/path/to/corpora            # contains data/ and registry/
   KORP_BACKEND_URL=http://localhost:1234
   KORP_EXPORTER_URL=http://localhost:14000/download/csv
   ```
   The registry files contain absolute paths under `/opt/corpora`, which
   is where the directory is mounted inside the containers; the host path
   is free.
2. Build the base images once, from the repository root:
   `docker compose build`
3. Here: `docker compose up -d --build backend frontend exporter`
4. Open http://localhost:9111/ (backend: http://localhost:1234/info).

After changing `corpus_config/`, nothing needs rebuilding: the directory
is bind-mounted and the backend caches nothing when memcached is off.
After changing `frontend/config/`, rebuild the frontend image. After
changing a patch or bumping the upstream tag, rebuild the base image
first.

## Deploying to Alf

Production values are the defaults in `docker-compose.yml`
(`KORP_BACKEND_URL=https://alf.hum.ku.dk/korp/backend`,
`KORP_EXPORTER_URL=download/csv`, corpora at `/opt/corpora`), so Alf needs
no `.env` file. The gateway rules are unchanged: `/korp/` to port 9111,
`/korp/backend/` to 1234, and the exporter paths as before.

Alf (checked 2026-09-15) has the v1 `docker-compose` binary only, Docker
commands need `sudo`, and the running containers carry v1 names such as
`clarin_backend_1`. The commands below are written for that; with the v2
plugin they read `sudo docker compose ...` and the containers are named
`clarin-backend-1`. The production database holds exactly the rows
`db_setup.sql` seeds (checked the same day), so recreating the backend
container loses no data.

Do the cut-over in two steps, because the old frontend runs fine on the
new backend (verified during the migration) but the new frontend needs
the new backend:

1. **Backend first.** Tag the running images for rollback, then rebuild
   and restart only the backend:
   ```bash
   sudo docker tag korp_backend_base korp_backend_base:2022
   sudo docker tag clarin_backend clarin_backend:2022
   (cd ../.. && sudo docker-compose build backend)
   sudo docker-compose up -d --build backend
   curl -s https://alf.hum.ku.dk/korp/backend/info | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])'
   ```
   Expected: `8.2.5`, and the old frontend keeps working.
2. **Frontend second**, when convenient:
   ```bash
   sudo docker tag korp_frontend_base korp_frontend_base:2022
   sudo docker tag clarin_frontend clarin_frontend:2022
   (cd ../.. && sudo docker-compose build frontend)
   sudo docker-compose up -d --build frontend
   curl -s -o /dev/null -w '%{http_code}\n' https://alf.hum.ku.dk/korp/
   curl -s -o /dev/null -w '%{http_code}\n' https://alf.hum.ku.dk/korp/userguide/
   ```
   Expected: `200` twice. Browsers that cached the old `index.html` show
   a blank page until they reload once, because the old page asks for
   `bundle.js`, which no longer exists; the new nginx sends `index.html`
   with `Cache-Control: no-cache` so this cannot recur.

Rollback of either step is `sudo docker-compose up -d` with the previous
git revision checked out, or retagging the `:2022` images; no data
changes. (`sudo docker images` shows the exact image names on the host;
v1 names them `clarin_backend`, v2 `clarin-backend`.)

## Checks after deploying

- Every mode loads and a simple search returns hits (the list of modes and
  a query per mode are in `../../doc/upgrade-plan.md`, Phase 3.4).
- `../../scripts/golden.sh https://alf.hum.ku.dk/korp/backend fixtures/prod`
  and `diff -r fixtures/old fixtures/prod` shows no differences.
- `/corpus_config?mode=<mode>` answers `ok` for every mode (command in
  `corpus_config/README.md`).

## Keeping up with upstream

Change the tag in `../../frontend/Dockerfile` (`KORP_FRONTEND_REF`) or
`../../backend/Dockerfile` (`KORP_BACKEND_REF`), rebuild, and let the
build-time checks speak: patches that no longer apply, Danish translation
keys that no longer match upstream's set, dependency imports that fail.
Then repeat the checks above. Details in `../../doc/upgrade-plan.md`,
Phase 7.
