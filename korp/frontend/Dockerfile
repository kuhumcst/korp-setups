FROM ubuntu:bionic

# TODO: investigate if mysql deps are all necessary
# Install dependency libraries
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    bison \
    flex \
    libglib2.0-0 \
    libreadline7 \
    readline-common \
    python3 \
    python3-dev \
    python3-pip \
    python3-setuptools \
    git \
    gcc \
    mysql-server \
    libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# complicated yarn install: https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    yarn \
    && rm -rf /var/lib/apt/lists/*

# Fetch the korp-frontend
WORKDIR /opt
RUN git clone https://github.com/kuhumcst/korp-frontend.git
WORKDIR /opt/korp-frontend
RUN git fetch --all
RUN git checkout ad56371387c7d582fa6b2658df6921f4458584da

# Fetch korp-frontend dependencies
WORKDIR /opt/korp-frontend
RUN yarn

# Recursively patch korp-frontend source code - provides basic UI localisation
# Copy files in local "app" to corresponding paths in "/opt/korp-frontend/app",
# without substituting existing dirs. (config.js will be replaced, files in
# includes and translations dirs will be replaced if files with corresponding file names are present
# in local app/includes and app/translations -- the full dirs are NOT replaced).
COPY app /opt/korp-frontend/app

# Include a script to sync mode and translation files from config/ to dist/.
# Run `docker-compose exec frontend sync.sh` in same dir as docker-compose.yml.
COPY exec/sync.sh /bin/
RUN chmod +x /bin/sync.sh

# This Dockerfile does NOT contain an entrypoint! You MUST extend it by writing
# your own Dockerfile, using `korp_frontend_base` as a parent image.
# See korp/setups/clarin for an example setup including a Dockerfile.