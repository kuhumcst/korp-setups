FROM ubuntu:18.04 AS build

# TODO: apache dep is missing + apache integration with tomcat
# TODO: split into separate build and prod steps

# Installing as many dependencies as possible using apt-get
# https://github.com/ufal/clarin-dspace/wiki/Installation----Prerequisites
RUN apt-get update
RUN apt-get install -y make git openjdk-8-jdk maven wget libxml2-utils xsltproc unzip

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
RUN apt-get clean

# Environment variables (required for Ant to work)
ENV ANT_HOME=/opt/apache-ant
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin:$ANT_HOME/bin

CMD /opt/tomcat/bin/startup.sh
