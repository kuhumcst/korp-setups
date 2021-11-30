# Based on: https://github.com/fau-klue/docker-corpus-tool

FROM ubuntu:bionic as builder

# Install cwb dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    apt-utils \
    autoconf \
    bison \
    flex \
    gcc \
    libc6-dev \
    libglib2.0-0 \
    libglib2.0-dev \
    libncurses5 \
    libncurses5-dev \
    libpcre3-dev \
    libreadline7 \
    libreadline-dev \
    make \
    pkg-config \
    subversion \
    && rm -rf /var/lib/apt/lists/*

# Download latest cwb source,
# excluding /cwb/doc to keep svn from timing out.
RUN svn checkout --depth immediates http://svn.code.sf.net/p/cwb/code/cwb/trunk cwb/
RUN svn update --set-depth exclude /cwb/doc
RUN svn update --set-depth infinity /cwb/*
# Run install script and Move to unified location
WORKDIR /cwb
RUN ./install-scripts/install-linux
RUN mv /usr/local/cwb-* /usr/local/cwb

###########################################
# Actual Image without build dependencies #
###########################################
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
    subversion \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python

# Add new binaries to PATH
COPY --from=builder /usr/local/cwb /usr/local/cwb
ENV PATH="/usr/local/cwb/bin/:${PATH}"

# TODO: move git and git clone into build step
# Fetch the korp-backend and add our custom config.py
WORKDIR /opt
RUN git clone https://github.com/spraakbanken/korp-backend.git
WORKDIR /opt/korp-backend
RUN pip3 install wheel
RUN pip3 install -r requirements.txt
COPY config.py /opt/korp-backend/config.py

# Set up a new Mysql DB
COPY db_setup.sql ./
RUN service mysql start && \
    mysql -uroot -ppassword < ./db_setup.sql

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
