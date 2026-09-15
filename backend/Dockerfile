# Korp backend base image: CWB + korp-backend v8.2.0 + MySQL for time data.
# Based on: https://github.com/fau-klue/docker-corpus-tool

FROM ubuntu:jammy AS builder

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

# Download a fixed CWB revision (3.4.27 on trunk r1557),
# excluding /cwb/doc to keep svn from timing out.
RUN svn checkout -r1557 --depth immediates http://svn.code.sf.net/p/cwb/code/cwb/trunk cwb/
RUN svn update -r1557 --set-depth exclude /cwb/doc
RUN svn update -r1557 --set-depth infinity /cwb/*
# Run install script and Move to unified location
WORKDIR /cwb
RUN ./install-scripts/install-linux
RUN mv /usr/local/cwb-* /usr/local/cwb

###########################################
# Actual Image without build dependencies #
###########################################
FROM ubuntu:jammy

# Install dependency libraries
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    libglib2.0-0 \
    libreadline8 \
    locales \
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

# LC_COLLATE in config.py refers to this locale; generate it so sorting works.
RUN locale-gen da_DK.UTF-8

# Add new binaries to PATH
COPY --from=builder /usr/local/cwb /usr/local/cwb
ENV PATH="/usr/local/cwb/bin/:${PATH}"

# Fetch korp-backend at a release tag. Override with --build-arg to test
# another tag or commit (e.g. a dev checkout).
ARG KORP_BACKEND_REF=v8.2.0
WORKDIR /opt
RUN git clone https://github.com/spraakbanken/korp-backend.git
WORKDIR /opt/korp-backend
RUN git checkout "${KORP_BACKEND_REF}"

# Upstream pins its direct dependencies loosely and its transitive ones not
# at all; resolved today they break the stack (see constraints.txt for the
# list). Constraints pin the transitive packages to versions contemporary
# with the tag, while requirements.txt stays upstream's file.
COPY constraints.txt requirements-overrides.txt /tmp/
RUN pip3 install -r requirements.txt -c /tmp/constraints.txt
# Replace pins that cannot work on this Python (see requirements-overrides.txt).
RUN pip3 install --upgrade -r /tmp/requirements-overrides.txt
# Fail the build, not the container, if the dependency set is broken.
RUN python3 -c "from gevent import monkey; monkey.patch_all(subprocess=False); print('gevent ok')"
RUN python3 -c "import MySQLdb; assert MySQLdb.version_info >= (2, 0), MySQLdb.version_info; print('mysqlclient', MySQLdb.version_info)"

# Our configuration overrides the shipped config.py via Flask's instance dir.
RUN mkdir -p /opt/korp-backend/instance /opt/corpus_config
COPY config.py /opt/korp-backend/instance/config.py
# Fail the build if the instance config is not picked up.
RUN python3 -c "from korp import create_app; a = create_app(); \
    assert a.config['CWB_REGISTRY'] == '/opt/corpora/registry', a.config['CWB_REGISTRY']; \
    print('instance config ok, korp', __import__('korp').__version__)"

# Set up a new Mysql DB
COPY db_setup.sql ./
RUN service mysql start && \
    mysql -uroot -ppassword < ./db_setup.sql

# Start the main process
CMD service mysql start && python3 /opt/korp-backend/run.py
