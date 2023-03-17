# This Dockerfile runs the fcs-korp-endpoint.war service using Tomcat.
FROM tomcat:9

# The fcs-korp-endpoint.war is copied over from the fcs-prep builder.
# Note that the name of the .war file is significant as it defines the default
# Tomcat Context path (from the root) that the web service can be reached at,
# i.e. our host server can reached it at localhost:8088/fcs-korp-endpoint/...
COPY --from=fcs-prep-build /opt/fcs-korp-endpoint/target/fcs-korp-endpoint.war /usr/local/tomcat/webapps/
