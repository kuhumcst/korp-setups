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
    vim \
    tree \
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
RUN git checkout upstream-master-bugfixes

# Fetch korp-frontend dependencies
WORKDIR /opt/korp-frontend
RUN yarn

# ARGs:
#   Retrieve args from docker-compose for use in build step with ARG.
#   (Set as envvar with ENV to make available to CMD).
ARG BUILD_MODE
ENV build_mode=$BUILD_MODE
RUN echo "envvar build_mode of cwb-encoding: $build_mode"

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh $build_mode
