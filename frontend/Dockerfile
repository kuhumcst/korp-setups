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
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Additional source compilation tools needed for ARM64 builds, e.g. Mac M1
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    python2 \
    python-is-python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# With NPM installed, we can install yarn
RUN npm install --global yarn

# Fetch the korp-frontend
WORKDIR /opt
RUN git clone https://github.com/spraakbanken/korp-frontend.git
WORKDIR /opt/korp-frontend
RUN git fetch --all
# Checkout commit from 18.1.2022
RUN git checkout d3a09514a43c4e9a266c5be50fa181f57b60d70b

# Fetch korp-frontend dependencies
WORKDIR /opt/korp-frontend
RUN yarn

# Add basic UI localisation for Danish
COPY app /opt/korp-frontend/app

# Install mkdocs for building user guides.
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*
RUN pip install mkdocs

# This Dockerfile does NOT contain an entrypoint! You MUST extend it by writing
# your own Dockerfile, using `korp_frontend_base` as a parent image.
# See korp/setups/clarin for an example setup including a Dockerfile.
