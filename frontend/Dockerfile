# Korp frontend base image: upstream korp-frontend source at a release tag,
# with dependencies installed and our source patches applied.
#
# This image has NO entrypoint. A setup extends it, adds its configuration
# directory, runs `yarn build`, and serves the resulting dist/ (see
# setups/clarin/frontend/Dockerfile for the reference setup).

FROM node:24-bookworm

# Fetch korp-frontend at a release tag. Override with --build-arg to try
# another tag or commit.
ARG KORP_FRONTEND_REF=v9.15.1
WORKDIR /opt
RUN git clone https://github.com/spraakbanken/korp-frontend.git
WORKDIR /opt/korp-frontend
RUN git checkout "${KORP_FRONTEND_REF}"

# Dependencies exactly as locked by upstream for this tag. Installed before
# the patches so that editing a patch does not invalidate this slow layer.
RUN yarn install --frozen-lockfile --network-timeout 600000

# Source patches (frontend/patches/*.patch) are the complete list of our
# deviations from upstream. `git apply --check` first, so a patch that no
# longer applies fails the build loudly instead of half-applying.
COPY patches/ /patches/
RUN set -e; for p in /patches/*.patch; do \
      [ -e "$p" ] || continue; \
      echo "applying $p"; git apply --check "$p" && git apply --3way "$p"; \
    done; git status --short

# webpack 5 + TypeScript needs more heap than Node's default on some hosts.
ENV NODE_OPTIONS=--max-old-space-size=4096
