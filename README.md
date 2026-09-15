Korp
====
This is a custom Docker setup of Korp: a web interface ([frontend](https://github.com/spraakbanken/korp-frontend) and [backend](https://github.com/spraakbanken/korp-backend)) for the [IMS Corpus Workbench (CWB)](https://cwb.sourceforge.io/). Two base images ([korp_backend_base](/backend) and [korp_frontend_base](/frontend)) form the foundation of a selection of individual [Korp setups](/setups) maintained by the [Department of Nordic Studies and Linguistics](https://nors.ku.dk/english/) at the University of Copenhagen.

> The original intent was to replace Clarin.dk's ailing instance of Korp with a more [up-to-date, Dockerised version](https://alf.hum.ku.dk/korp) (this is now the [Clarin setup](/setups/clarin)).

Versions
--------
The base images follow Språkbanken's tagged releases: korp-frontend **v9.15.1** (`frontend/Dockerfile`, `KORP_FRONTEND_REF`) and korp-backend **v8.2.0** (`backend/Dockerfile`, `KORP_BACKEND_REF`). The 2026 migration from the 2022 pins, its reasoning and its checks are documented in [doc/upgrade-plan.md](doc/upgrade-plan.md). The CLARIN setup is migrated; the other setups still use the 2022 layout and are next (plan, Phase 6).

How a setup is put together
---------------------------
Upstream Korp is not patched by copying files over its source any more. Each layer has one place:

| Concern | Where | Notes |
|---|---|---|
| Frontend settings | `setups/<setup>/frontend/config/config.yml` | upstream's `config.yml` format; read via `run_config.json` at build time |
| Corpus and mode configuration | `setups/<setup>/corpus_config/` (YAML) | served by the backend's `/corpus_config`; bind-mounted at `/opt/corpus_config` |
| Translations | `setups/<setup>/frontend/config/translations/` | three-letter language codes (`dan`, `eng`); `locale-dan.json` must match upstream's key set, checked at build time |
| Site code (sidebar components, stringifiers, CSS) | `setups/<setup>/frontend/config/custom/` | upstream's `custom/*.js` hooks, loaded if present |
| Changes to upstream source | `frontend/patches/*.patch` | applied with `git apply --check` when the base image is built; a patch that no longer applies fails the build |
| Backend settings | `backend/config.py` | installed as upstream's `instance/config.py` |
| Python dependency pins | `backend/constraints.txt`, `backend/requirements-overrides.txt` | upstream's `requirements.txt` stays as is |

Build, deploy, debug
--------------------
> NOTE: you will need to have `git` and `docker` (with the Compose plugin) installed on the host machine.

Deployment consists of:

1. Cloning this repository on the production server.
2. Building the base images with `docker compose build` in the repository root.
3. Building and running a specific setup with `docker compose up -d --build` inside `setups/<setup>`.

This starts at least two containers, backend and frontend. Some setups run more (an exporter for bulk KWIC downloads, the CLARIN FCS endpoint, the LANCHART partitur viewer).

### HTTPS gateway setup
None of the setups come with SSL certificate support, so a reverse proxy in front of them is needed to serve Korp over HTTPS. The production server of the Clarin setup (Alf) sits behind an nginx gateway.

### Local runs
Machine-specific values (where the corpora are, which backend URL the browser should use) go into a git-ignored `.env` file next to the setup's `docker-compose.yml`; the compose file's defaults are the production values. See [setups/clarin/README.md](setups/clarin/README.md) for the CLARIN example, including the cut-over order and rollback.

Docker commands
---------------
> _All commands must be run in a directory containing a `docker-compose.yml` file, and often as a superuser (`sudo`)._

Build the base images (repository root); rerun after changing `backend/`, `frontend/` or the patches:

```shell
docker compose build
```

Build and run a setup:

```shell
docker compose up -d --build
```

Debug a misbehaving container by running it attached, entering it, or reading its logs:

```shell
docker compose up --build            # attached, with output
docker compose logs -f backend
docker compose exec backend bash
docker compose restart frontend
docker compose down --remove-orphans --volumes   # stop and remove everything, including volumes
```

Creating setups that inherit from the base images
-------------------------------------------------
A Dockerfile cannot extend another Dockerfile, only an image, so the base images must exist locally (`docker compose build` in the root) before a setup can be built. A setup's frontend Dockerfile extends `korp_frontend_base`, copies its configuration directory in, writes `run_config.json`, runs `yarn build`, and serves the result. The CLARIN version does this in three stages (build, user guide, nginx) and is the template for the other setups:

```Dockerfile
FROM korp_frontend_base AS build
COPY config/ /opt/korp-config/
WORKDIR /opt/korp-frontend
RUN printf '{"configDir": "/opt/korp-config"}\n' > run_config.json
RUN yarn build
```

### Converting an old setup
The pre-2026 setups keep their corpora and modes in JavaScript files (`app/config.js`, `app/modes/*_mode.js`). `scripts/modejs2yaml.js` converts those into the backend's YAML directory and reports what it cannot express; `scripts/locale_dan_sync.py` rebuilds the Danish UI file against the current upstream key set. Both were written for the CLARIN migration and are meant to be reused for the other setups.

### Editing Korp templates
Korp is an [AngularJS](https://angularjs.org/) application written in TypeScript. Its templates are HTML strings inside components. Configuration values (labels, descriptions, the header logo HTML in `config.yml`) may contain HTML and AngularJS expressions.

### User documentation
`doc/userguides/docs` holds a general Korp user guide built into a static site with mkdocs. `index.md` and `regex.md` are general; the other pages belong to specific setups. Each setup's frontend Dockerfile builds the guide from `doc/userguides` (passed to the build as the `userguides` context in the compose file), removes the pages it does not want, appends its navigation from `mkdocs_yml_extension.txt`, and serves the result under `/userguide/`. A link to it is part of the header configuration in `config.yml`.

Configuration documentation
---------------------------
* Frontend settings and attribute options: https://github.com/spraakbanken/korp-frontend/blob/master/doc/frontend_devel.md
* Backend corpus configuration format: https://github.com/spraakbanken/korp-backend#corpus-configuration-for-the-korp-frontend
* Språkbanken's own configuration, as a worked example: https://github.com/spraakbanken/korp-frontend-sb and https://github.com/spraakbanken/korp-config

Inspiration
-----------
* https://github.com/fau-klue/docker-corpus-tool
* https://github.com/spraakbanken/korp-frontend-sb
