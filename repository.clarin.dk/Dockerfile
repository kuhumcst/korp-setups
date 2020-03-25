FROM ubuntu:18.04 AS apt-dependencies

# skip manual configuration during apt-get install (e.g. postgresql-contrib)
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
	# Installing as many dependencies as possible using apt-get
	# https://github.com/ufal/clarin-dspace/wiki/Installation----Prerequisites
	&& apt-get install -y make git openjdk-8-jdk maven wget libxml2-utils xsltproc unzip postgresql apache2 sudo python \
	# TODO: extra/uncertain deps, will probably review and remove at a later point
	&& apt-get install -y iputils-ping postgresql-contrib

# Remove temporary files
RUN apt-get clean




FROM apt-dependencies AS other-dependencies

# Ant is not readily available using apt-get
RUN wget http://ftp.download-by.net/apache//ant/binaries/apache-ant-1.10.7-bin.tar.gz
RUN mkdir /opt/apache-ant
RUN tar xvzf apache-ant-1.10.7-bin.tar.gz -C /opt/apache-ant --strip-components=1

# Tomcat is not readily available using apt-get
# https://www.digitalocean.com/community/tutorials/how-to-install-apache-tomcat-8-on-ubuntu-16-04
RUN wget https://archive.apache.org/dist/tomcat/tomcat-8/v8.0.35/bin/apache-tomcat-8.0.35.tar.gz
RUN mkdir /opt/tomcat
RUN tar xvzf apache-tomcat-8.0.35.tar.gz -C /opt/tomcat --strip-components=1

# Cleaning up temporary files
RUN rm apache-ant-1.10.7-bin.tar.gz
RUN rm apache-tomcat-8.0.35.tar.gz




# Mostly trying to follow the "official" install guide
# https://github.com/ufal/clarin-dspace/wiki/Installation
FROM other-dependencies AS clarin-dspace

# Reflects the directories set up during the build stages
ENV CATALINA_HOME=/opt/tomcat
ENV CATALINA_BASE=/opt/tomcat
ENV ANT_HOME=/opt/apache-ant
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV POSTGRES_HOME=/usr/lib/postgresql/10
ENV PATH=$PATH:$JAVA_HOME/bin:$ANT_HOME/bin:$POSTGRES_HOME/bin:$CATALINA_HOME/bin

# As listed in the install documentation
# https://github.com/ufal/clarin-dspace/wiki/Installation
ENV DSPACE_INSTANCE_NAME=repository
ENV DSPACE_SOURCE_DIRECTORY=/opt/repository/sources/dspace
ENV DSPACE_WORKSPACE=/opt/repository/workspace
ENV DSPACE_INSTALLATION_DIRECTORY=/opt/repository/installations

RUN git clone https://github.com/ufal/clarin-dspace.git -b clarin /opt/repository/sources/dspace

# Enforce a specific commit to make the build reproducible
WORKDIR /opt/repository/sources/dspace
RUN git checkout d3715efe7d57371e0baf981b89d56bd6043ae22f

# TODO: is this step actually necessary? remove if not
# The makefile expects a sources folder to be symlinked here - I think?
# https://github.com/ufal/clarin-dspace/wiki/Installation#directory-structure
WORKDIR /opt/repository/sources/dspace/utilities/project_helpers
RUN ./setup.sh /opt/repository/workspace

# This is the directory containing the makefile
WORKDIR /opt/repository/sources/dspace/utilities/project_helpers/scripts
RUN make install_libs

# The main configuration file for clarin-dspace
# Compilation will fail without this file
# https://github.com/ufal/clarin-dspace/wiki/Installation#update-dspace-configuration
RUN mkdir -p /opt/repository/config
ADD clarin-dspace/local.properties /opt/repository/sources/dspace/local.properties

# Where the clarin-dspace logs go
RUN mkdir -p /opt/repository/logs

# Can't `RUN make new_deploy` directly as its second step requires database access
# `compile` is the first step of the `new_deploy` target and takes the most time to run
RUN make compile

# The default install of postgres on Ubuntu seems to be missing this required dir
# https://github.com/torhve/pix/issues/2
RUN mkdir -p /var/run/postgresql/10-main.pg_stat_tmp
RUN chown postgres.postgres /var/run/postgresql/10-main.pg_stat_tmp -R

# Used for postgres initdb
RUN mkdir -p /usr/local/pgsql/data
RUN chown postgres /usr/local/pgsql/data
RUN chown postgres /var/log/postgresql

# Add .war file to webapps repo (unpacked and served on localhost:8080 by tomcat)
# TODO: sample app, replace later with real .war file
ADD sample.war /opt/tomcat/webapps/

# Add config to set up Apache as proxy for Tomcat
ADD tomcat_ajp_proxy.conf /etc/apache2/sites-enabled/

WORKDIR /
ADD start.sh /
RUN chmod +x /start.sh
CMD /start.sh
