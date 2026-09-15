"""
Korp backend configuration for the korp-setups base image.

Installed as /opt/korp-backend/instance/config.py, where it overrides the
defaults shipped in korp-backend's own config.py (v8.2.0). Keep the key set
identical to upstream's file; unknown keys are silently ignored by Flask.
"""

# Host and port for the WSGI server
WSGI_HOST = "0.0.0.0"
WSGI_PORT = 1234

# The absolute path to the CQP binaries
CQP_EXECUTABLE = "/usr/local/cwb/bin/cqp"
CWB_SCAN_EXECUTABLE = "/usr/local/cwb/bin/cwb-scan-corpus"

# The absolute path to the CWB registry files (bind-mounted from the host)
CWB_REGISTRY = "/opt/corpora/registry"

# The default encoding for the cqp binary
CQP_ENCODING = "UTF-8"

# Locale to use when sorting (generated in the Dockerfile)
LC_COLLATE = "da_DK.UTF-8"

# The maximum number of search results that can be returned per query (0 = no limit)
MAX_KWIC_ROWS = 0

# Number of threads to use during parallel processing
PARALLEL_THREADS = 3

# Database host and port (MySQL runs inside the same container)
DBHOST = "127.0.0.1"
DBPORT = 3306

# Database name
DBNAME = "korp"

# Word Picture table prefix
DBWPTABLE = "relations"

# Username and password for database access (see db_setup.sql)
DBUSER = "root"
DBPASSWORD = "1234"

# Cache path (optional). Script must have read and write access.
# Caching also needs MEMCACHED_SERVER; with both unset, caching is off.
CACHE_DIR = ""

# Disk cache lifespan in minutes
CACHE_LIFESPAN = 20

# Memcached server IP address and port, or path to socket file (socket path must start with slash)
MEMCACHED_SERVER = None

# Max number of rows from count command to cache
CACHE_MAX_STATS = 5000

# Max size in bytes per cached query data file (0 = no limit)
CACHE_MAX_QUERY_DATA = 0

# Corpus configuration directory served to the frontend via /corpus_config.
# Each setup bind-mounts its own YAML tree here.
CORPUS_CONFIG_DIR = "/opt/corpus_config"

# Set to True to enable "lab mode", potentially enabling experimental features and access to lab-only corpora
LAB_MODE = False

# Plugins to load
PLUGINS = []

# Plugin configuration
PLUGINS_CONFIG = {}
