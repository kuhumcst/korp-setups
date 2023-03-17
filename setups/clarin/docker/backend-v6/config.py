# -*- coding: utf-8 -*-
"""
Configuration file used by the main korp.py script.

Copy this file to config.py and change the settings below.
"""

# Host and port for the WSGI server
WSGI_HOST = "0.0.0.0"
WSGI_PORT = 1234

# The absolute path to the CQP binaries
CQP_EXECUTABLE = "/usr/local/cwb/bin/cqp"
CWB_SCAN_EXECUTABLE = "/usr/local/cwb/bin/cqp-scan-corpus"

# The absolute path to the CWB registry files
CWB_REGISTRY = "/opt/corpora/registry"

# The default encoding for the cqp binary
CQP_ENCODING = "UTF-8"

# Locale to use when sorting
LC_COLLATE = "da_DK.UTF-8"

# The maximum number of search results that can be returned per query (0 = no limit)
MAX_KWIC_ROWS = 0

# Number of threads to use during parallel processing
PARALLEL_THREADS = 3

# Database host and port
DBHOST = "127.0.0.1"
DBPORT = 3306

# Database name
DBNAME = "korp"

# Word Picture table prefix
DBWPTABLE = "relations"

# Username and password for database access
DBUSER = "root"
DBPASSWORD = "1234"

# URL to authentication server
AUTH_SERVER = ""

# Secret string used when communicating with authentication server
AUTH_SECRET = ""

# A text file with names of corpora needing authentication, one per line
PROTECTED_FILE = ""

# Cache path (optional). Script must have read and write access.
CACHE_DIR = ""

# Disk cache lifespan in minutes
CACHE_LIFESPAN = 20

# List of Memcached servers or sockets (socket paths must start with slash)
MEMCACHED_SERVERS = []

# Size of Memcached client pool
MEMCACHED_POOL_SIZE = 25

# Max number of rows from count command to cache
CACHE_MAX_STATS = 5000
