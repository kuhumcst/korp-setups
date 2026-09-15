# CLARIN Korp frontend: upstream korp-frontend (from korp_frontend_base) built
# with our configuration directory, served together with the user guide by
# nginx. Three stages; only the last one ends up in the running container.
# Build context: the repository root (see docker-compose.yml).
#
# TODO: The root context exists only so this file can COPY doc/userguides
# with the v1 docker-compose binary that Alf runs (2026-09-15). Once Alf has
# the Compose v2 plugin, switch back to `context: frontend/` plus
# `additional_contexts: {userguides: ../../doc/userguides}` in
# docker-compose.yml and `COPY --from=userguides . /userguides` below, and
# drop the setups/clarin/frontend/ prefixes from the COPY lines.

ARG KORP_BACKEND_URL=https://alf.hum.ku.dk/korp/backend
ARG KORP_EXPORTER_URL=download/csv

########## 1. Build the Korp bundle with our configuration ##########
FROM korp_frontend_base AS build
ARG KORP_BACKEND_URL
ARG KORP_EXPORTER_URL

COPY setups/clarin/frontend/config/ /opt/korp-config/
# The backend and exporter URLs differ between production and a local
# checkout; they are the only values in config.yml that do.
RUN sed -i "s|__KORP_BACKEND_URL__|${KORP_BACKEND_URL}|; s|__KORP_EXPORTER_URL__|${KORP_EXPORTER_URL}|" /opt/korp-config/config.yml \
    && ! grep -q "__KORP_" /opt/korp-config/config.yml

WORKDIR /opt/korp-frontend
RUN printf '{"configDir": "/opt/korp-config"}\n' > run_config.json
# The Danish UI file must have exactly upstream's key set, so a new upstream
# release with new strings fails here instead of showing raw keys to users.
# Regenerate with scripts/locale_dan_sync.py.
RUN node -e ' \
    const up = Object.keys(require("./app/translations/locale-eng.json")); \
    const dan = Object.keys(require("/opt/korp-config/translations/locale-dan.json")); \
    const missing = up.filter((k) => !dan.includes(k)), stale = dan.filter((k) => !up.includes(k)); \
    if (missing.length || stale.length) { console.error("locale-dan.json out of sync. missing:", missing, "stale:", stale); process.exit(1); } \
    console.log("locale-dan.json in sync:", dan.length, "keys")'
RUN yarn build
# The build must have picked up our config: translations and the MSD page are
# copied from the config dir, so their absence means the wrong directory.
RUN ls dist/translations/ | grep -q '^locale-dan\.' && ls dist/modes/msdtags.html

########## 2. Build the user guide (mkdocs) ##########
FROM python:3.12-slim AS docs
RUN pip install --no-cache-dir mkdocs
# The user guide sources are shared by all setups (repo root, doc/userguides),
# which is why the build context is the repository root.
COPY doc/userguides /userguides
WORKDIR /userguides
COPY setups/clarin/frontend/mkdocs_yml_extension.txt ./
RUN cat mkdocs_yml_extension.txt >> mkdocs.yml \
    && rm -f docs/lanchart-*.md \
    && mkdocs build

########## 3. Serve ##########
FROM nginx:1.27-alpine
COPY setups/clarin/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/korp-frontend/dist/ /usr/share/nginx/html/
COPY --from=docs /userguides/site/ /usr/share/nginx/html/userguide/
EXPOSE 9111
