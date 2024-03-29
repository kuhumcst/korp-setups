# It is not possible to reuse the CWB builder used for the general backend image
# since dynamic linking is used, i.e. the Ubuntu version must match!

FROM ubuntu:focal AS builder

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
    libreadline8 \
    libreadline-dev \
    make \
    pkg-config \
    subversion \
    && rm -rf /var/lib/apt/lists/*

# Download latest cwb source,
# excluding /cwb/doc to keep svn from timing out.
RUN svn checkout -r1557 --depth immediates http://svn.code.sf.net/p/cwb/code/cwb/trunk cwb/
RUN svn update -r1557 --set-depth exclude /cwb/doc
RUN svn update -r1557 --set-depth infinity /cwb/*
# Run install script and Move to unified location
WORKDIR /cwb
RUN ./install-scripts/install-linux
RUN mv /usr/local/cwb-* /usr/local/cwb


# Based on the korp_backend_base image.
# This container deliberately uses an older version of Ubuntu (focal) to satisfy
# the  requirements of the older code, e.g. setuptools needs to be version <=46,
# but at the same time libreadline must be libreadline8!

FROM ubuntu:focal

# TODO: investigate if mysql deps are all necessary
# Install dependency libraries
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    bison \
    flex \
    gawk \
    libglib2.0-0 \
    libreadline8 \
    make \
    readline-common \
    python3 \
    python3-dev \
    python3-pip \
    python3-setuptools \
    git \
    gcc \
    build-essential \
    mysql-server \
    libmysqlclient-dev \
    subversion \
    memcached \
    libmemcached-dev \
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
# The final version of the v6 backend
RUN git checkout 5ef19b64b0c8342d225e5b51f2511523f0981094
# We patch in an updated version of the requirements (pur -r requirements)
# as the requirements.txt specified in the repo is not able to be fully install
COPY requirements.txt requirements.txt
RUN pip3 install wheel
RUN pip3 install -r requirements.txt
COPY config.py /opt/korp-backend/config.py

# Set up a new Mysql DB
COPY db_setup.sql ./
RUN service mysql start && \
    mysql -uroot -ppassword < ./db_setup.sql

# Start the main process
CMD service mysql start && python3 /opt/korp-backend/korp.py
#CMD tail -f /dev/null
