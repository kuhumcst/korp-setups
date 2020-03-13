FROM ubuntu:18.04 AS apt-dependencies

# skip manual configuration during apt-get install (e.g. postgresql-contrib)
ARG DEBIAN_FRONTEND=noninteractive

# Installing as many dependencies as possible using apt-get
# https://github.com/ufal/clarin-dspace/wiki/Installation----Prerequisites
RUN apt-get update
RUN apt-get install -y make git openjdk-8-jdk maven wget libxml2-utils xsltproc unzip postgresql sudo

# TODO: extra/uncertain deps, will probably review and remove at a later point
RUN apt-get install -y iputils-ping postgresql-contrib iputils-ping

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




FROM other-dependencies AS runner

# Required environment variables
ENV ANT_HOME=/opt/apache-ant
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV PSQL_DIR=/usr/lib/postgresql/10/bin
ENV PATH=$PATH:$JAVA_HOME/bin:$ANT_HOME/bin:$PSQL_DIR

# The default install of postgres on Ubuntu seems to be missing this required dir
# https://github.com/torhve/pix/issues/2
RUN mkdir -p /var/run/postgresql/10-main.pg_stat_tmp
RUN chown postgres.postgres /var/run/postgresql/10-main.pg_stat_tmp -R

# Used for postgres initdb
RUN mkdir -p /usr/local/pgsql/data
RUN chown postgres /usr/local/pgsql/data
RUN chown postgres /var/log/postgresql

ADD start.sh /
RUN chmod +x /start.sh
CMD /start.sh && ping localhost
