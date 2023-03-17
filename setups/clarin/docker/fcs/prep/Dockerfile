# This Dockerfile produces the fcs-korp-endpoint.war file for the fcs service.
# In additionto being used as a builder, it also runs the tests before quitting.
FROM ubuntu:focal

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    git \
    maven

WORKDIR /opt
RUN git clone https://github.com/kuhumcst/fcs-korp-endpoint.git && \
    git -C /opt/fcs-korp-endpoint fetch --all && \
    git -C /opt/fcs-korp-endpoint checkout 2e6cdc9296c96826e9333982a2034a8991284de5

# The .jar and .war artifacts are produced here (in the ./target subdirectory)
WORKDIR /opt/fcs-korp-endpoint
RUN mvn clean && mvn compile
RUN mvn war:war

# The so-called Tomcat Context path is derived from the name of the .war file;
# it is renamed to fcs-korp-endpoint.war to ensure the path remains consistent.
WORKDIR /opt/fcs-korp-endpoint/target
RUN mv *.war fcs-korp-endpoint.war

# The .jar file is used to run the tests, after which the container quits.
# The tests can be viewed in the logs.
CMD mvn test
