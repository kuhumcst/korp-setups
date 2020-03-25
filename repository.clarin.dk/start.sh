# Note: postgres cannot be run directly as the root user!
# We only want to run initdb once (for an empty data directory).

sudo -u postgres /usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data || true
sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l /var/log/postgresql/logfile start &&

# The databases need to be set up before `make fresh_install` can run!
# https://github.com/ufal/clarin-dspace/wiki/Installation#create-databases
sudo -u postgres createuser --username=postgres --no-superuser dspace || true
cd $DSPACE_WORKSPACE/scripts &&
make create_databases || true

# The second step of the `fresh_deploy` target
# (the `compile` step was run in the Dockerfile)
make fresh_install &&

/opt/tomcat/bin/startup.sh &&

# Enable relevant modules and remove the default site before starting Apache
ln -s /etc/apache2/mods-available/proxy.load /etc/apache2/mods-enabled/ &&
ln -s /etc/apache2/mods-available/proxy_ajp.load /etc/apache2/mods-enabled/ &&
ln -s /etc/apache2/mods-available/ssl.load /etc/apache2/mods-enabled/ &&
rm /etc/apache2/sites-enabled/000-default.conf &&
apache2ctl start && 

# TODO: remove? is it still necessary?
ping localhost
