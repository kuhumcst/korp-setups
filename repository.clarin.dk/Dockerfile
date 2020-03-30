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
ENV DSPACE_INSTANCE_NAME=lindat-dspace
ENV DSPACE_SOURCE_DIRECTORY=/opt/lindat-dspace/sources/dspace
ENV DSPACE_WORKSPACE=/opt/lindat-dspace/workspace
ENV DSPACE_INSTALLATION_DIRECTORY=/opt/lindat-dspace/installation

# This one was not listed with the others, but clarin-dspace cannot run without it, e.g. xmlui reads this property
# It's really just another name for DSPACE_INSTALLATION_DIRECTORY
ENV DSPACE_HOME=/opt/lindat-dspace/installation

RUN git clone https://github.com/ufal/clarin-dspace.git -b clarin /opt/lindat-dspace/sources/dspace

# Enforce a specific commit to make the build reproducible
WORKDIR /opt/lindat-dspace/sources/dspace
RUN git checkout d3715efe7d57371e0baf981b89d56bd6043ae22f

# Optional variables for the clarin-dspace makefile
# https://github.com/ufal/clarin-dspace/wiki/Installation#makefile
COPY clarin-dspace/variable.makefile /opt/lindat-dspace/sources/dspace/utilities/project_helpers/config/

# The makefile expects a sources folder to be symlinked inside this directory
# https://github.com/ufal/clarin-dspace/wiki/Installation#directory-structure
WORKDIR /opt/lindat-dspace/sources/dspace/utilities/project_helpers
RUN ./setup.sh /opt/lindat-dspace/workspace

# This is the directory containing the makefile
WORKDIR /opt/lindat-dspace/sources/dspace/utilities/project_helpers/scripts
RUN make install_libs

# The main configuration file for clarin-dspace (compilation will fail without it)
# https://github.com/ufal/clarin-dspace/wiki/Installation#update-dspace-configuration
# Documentation of the variables: https://github.com/ufal/clarin-dspace/wiki/Configuration
RUN mkdir -p /opt/lindat-dspace/config
COPY clarin-dspace/local.properties /opt/lindat-dspace/sources/dspace/local.properties

# TODO: these perl regex replacements should happen in our own rebased git branch instead
# We have no password set for our dspace user, so the build.properties need to reflect that
RUN perl -i -pe 's/db.password=dspace/db.password=/g' /opt/lindat-dspace/sources/dspace/build.properties

# To RUN new_deploy, we need to make sure that we don't try to run db tests.
# We do this by removing the test_database target from the list of dependencies.
# Otherwise, fresh_install (the 2nd step of new_deploy) will fail.
RUN perl -i -pe 's/depends="init_installation,init_configs,test_database,install_code"/depends="init_installation,init_configs,install_code"/g' /opt/lindat-dspace/sources/dspace/dspace/src/main/config/build.xml

# Bundle of 3 separate make targets: compile, fresh_install, and postinstall.
# fresh_install runs Ant with the target in the build.xml we just modified!
RUN make new_deploy

# The default install of postgres on Ubuntu seems to be missing this required dir
# https://github.com/torhve/pix/issues/2
RUN mkdir -p /var/run/postgresql/10-main.pg_stat_tmp
RUN chown postgres.postgres /var/run/postgresql/10-main.pg_stat_tmp -R

# Used for postgres initdb
RUN mkdir -p /usr/local/pgsql/data
RUN chown postgres /usr/local/pgsql/data
RUN chown postgres /var/log/postgresql

# Remove the default web apps included with Tomcat.
RUN rm -rf /opt/tomcat/webapps/*

# Symlink each dspace app directory, accessed by e.g. https://localhost/xmlui
# This is done instead of making a custom Tomcat server.xml with <Context> tags.
RUN ln -s /opt/lindat-dspace/installation/webapps/xmlui /opt/tomcat/webapps/xmlui
#RUN ln -s /opt/lindat-dspace/installation/webapps/solr /opt/tomcat/webapps/solr
#RUN ln -s /opt/lindat-dspace/installation/webapps/oai /opt/tomcat/webapps/oai
#RUN ln -s /opt/lindat-dspace/installation/webapps/rest /opt/tomcat/webapps/rest

# Add config to set up Apache as proxy for Tomcat
COPY apache/tomcat_ajp_proxy.conf /etc/apache2/sites-enabled/

WORKDIR /
COPY start.sh /
RUN chmod +x /start.sh
CMD /start.sh
