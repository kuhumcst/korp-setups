# Postgres cannot be run directly as the root user
# TODO: custom config...? for now just using the files included with the install
# TODO: not working properly, https://stackoverflow.com/questions/31645550/why-psql-cant-connect-to-server
sudo -u postgres /usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data
sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l logfile start

# TODO: apache dep is missing + apache integration with tomcat
/opt/tomcat/bin/startup.sh

ping localhost
