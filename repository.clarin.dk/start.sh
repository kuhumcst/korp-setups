# Note: postgres cannot be run directly as the root user!
# We only want to run initdb once (for an empty data directory).
sudo -u postgres /usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data || true
sudo -u postgres /usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l /var/log/postgresql/logfile start &&

/opt/tomcat/bin/startup.sh &&

# Enable relevant modules and remove the default site before starting Apache
ln -s /etc/apache2/mods-available/proxy.load /etc/apache2/mods-enabled/ &&
ln -s /etc/apache2/mods-available/proxy_ajp.load /etc/apache2/mods-enabled/ &&
ln -s /etc/apache2/mods-available/ssl.load /etc/apache2/mods-enabled/ &&
rm /etc/apache2/sites-enabled/000-default.conf &&
apache2ctl start && 

# TODO: remove? is it still necessary?
ping localhost
