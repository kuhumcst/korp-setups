# Note: postgres cannot be run directly as the root user!
# We only want to run initdb once (for an empty data directory).
sudo -u postgres /usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data || true &&
sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l /var/log/postgresql/logfile start &&

# Set up the postgres database (if it hasn't already)
# https://github.com/ufal/clarin-dspace/wiki/Installation#create-databases
sudo -u postgres createuser --username=postgres --no-superuser dspace || true
cd $DSPACE_WORKSPACE/scripts &&
make create_databases || true &&

# Tomcat will serve everything in /opt/tomcat/webapps
/opt/tomcat/bin/startup.sh &&

# Enable relevant modules and remove the default website before starting Apache.
# (just creates/removes symlinks in subdirs of /etc/apache2)
a2enmod proxy &&
a2enmod proxy_ajp &&
a2enmod ssl &&
a2dissite 000-default &&
apache2ctl start && 

# TODO: remove? is it still necessary?
ping localhost
