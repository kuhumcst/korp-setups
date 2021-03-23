FROM ubuntu:focal

# Install dependency libraries
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    curl \
    ca-certificates \
    git \
    mysql-server

# Fetch and run script to add nodejs repos alongside standard Ubuntu ones.
# Replace setup_12.x with setup_xx.x for whatever specific version is needed.
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-2-%E2%80%94-installing-node-js-with-apt-using-a-nodesource-ppa
RUN curl https://deb.nodesource.com/setup_12.x > setup_nodejs.sh
RUN bash setup_nodejs.sh

# Then install Nodejs (and NPM as a implicit, recommended install)
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# With NPM installed, we can install yarn
RUN npm install --global yarn

# Fetch the korp-frontend
WORKDIR /opt
RUN git clone https://github.com/spraakbanken/korp-frontend.git
WORKDIR /opt/korp-frontend
RUN git fetch --all
RUN git checkout f5c4e4fd7bb91ad6bcdd3389f3a28f80154be8b4

# Fetch korp-frontend dependencies
WORKDIR /opt/korp-frontend
RUN yarn

# Hotfix for a dumb bug in the korp-frontend source code
# https://github.com/spraakbanken/korp-frontend/pull/130
# https://github.com/spraakbanken/korp-frontend/issues/131
RUN sed -i 's/templateUrl/template/g' /opt/korp-frontend/app/scripts/directives.js

# Add basic UI localisation for Danish
COPY app /opt/korp-frontend/app

# TODO: revisit - still relevant?
# Include a script to sync mode and translation files from config/ to dist/.
# Run `docker-compose exec frontend sync.sh` in same dir as docker-compose.yml.
COPY exec/sync.sh /bin/
RUN chmod +x /bin/sync.sh

# This Dockerfile does NOT contain an entrypoint! You MUST extend it by writing
# your own Dockerfile, using `korp_frontend_base` as a parent image.
# See korp/setups/clarin for an example setup including a Dockerfile.
