# Postgres cannot be run directly as the root user
# TODO: custom config...? for now just using the files included with the install

# We only want to run initdb once (for an empty data directory).
# https://timmurphy.org/2015/01/29/test-if-a-directory-is-empty-in-bash/
test "$(ls -A /usr/lib/postgresql/10/bin/initdb)" || sudo -u postgres /usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data &&
sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l /var/log/postgresql/logfile start &&
# TODO: apache integration with tomcat
#apache2ctl start && 
/opt/tomcat/bin/startup.sh &&
touch services-started &&
ping localhost
