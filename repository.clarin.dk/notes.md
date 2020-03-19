NOTE: temporary development notes, will revisit and move bits into the README.md.


Dockerfile
----------

Build from Dockerfile:

```
docker build -t app .
```

Kill any existing container and run the latest build:

```
docker run -dt app:latest
```

This will execute (only) the last CMD in the Dockerfile in detached mode. The ID of the latest container is available using `docker ps -ql`.

To attach to the running container:

```
docker attach $(docker ps -ql)
```

To "log in" with a shell:

```
docker container exec -it $(docker ps -ql) /bin/bash
```


docker-compose.yml
-----------------
Build image(s) and run container(s) detached with `docker-compose`:

```
docker-compose up -d --build
```

Enter the running repository container:

```
docker-compose exec app /bin/bash
```

Stop the running container(s) if detached

```
docker-compose stop
```

TODO: Remove cached stuff... I think?

```
docker-compose down --remove-orphans --volumes
```


Docker for Mac
--------------
This section is entirely Mac-specific!

Since Docker for Mac runs Linux inside a VM, it occasionally becomes necessary to enter that VM to perform certain actions. One of these actions is that of inspecting the mounted volumes.

The easiest way of getting directly into the VM (taken from [this gist](https://gist.github.com/BretFisher/5e1a0c7bcca4c735e716abf62afad389)):

```
docker run -it --rm --privileged --pid=host justincormack/nsenter1
```

The `Mountpoint` specified in the JSON you get when calling `docker volume inspect $VOLUME_ID` is a path inside this Linux VM, e.g.

```
docker volume inspect repositoryclarindk_postgres_logs
```

will return a bit of JSON where this path is specified for our `postgres_logs` Docker data volume.


Prerequisites checklist
-----------------------
I've been running through the dependency setup checklist for the Docker container I've been building.

See: https://github.com/ufal/clarin-dspace/wiki/Prerequisites-checklist

- Ant
  - [x] `ant -version`
- Postgresql
  - version
    - [x] run as user postgres, e.g.: `sudo -u postgres psql -c 'select version()'`
  - creating dbs, either:
    - [x] allow the access to the postgres superuser
    - [ ] ~~give createdb rights to (dspace) db user~~
    - [ ] ~~create the dbs manually and grant rights to the (dspace) db user (see the create_databases target)~~
  - Test connection via ip
    - [ ] `psql --password --username=dspace -h 127.0.0.1 -c '\d' dspace` (pretty sure this needs to run after another step?)
- jdk
  - [x] `javac -version`
- tomcat
  - [x] You'll need an access to tomcat configs (server.xml and the like), the ability to restart tomcat.
  - [x] Verify that tomcat is running fine, configure HttpConnector (you can use ajp later on) and deploy for example probe. That's the first thing to check before even connecting tomcat with frontfacing (proxy) webserver.
  - [x] Tweaks to the init scripts and/or default variables are necessary - giving the tomcat jvm more memory (in JAVA_OPTS or CATALINA_OPTS depending on the init script). The amount depends on the data stored and on load (6G usually enough)
  - version
    - [x] `java -cp /opt/tomcat/lib/catalina.jar org.apache.catalina.util.ServerInfo` (original: `java -cp $(locate catalina.jar | head -n1) org.apache.catalina.util.ServerInfo
`)
- maven
  - [x] `mvn -version`
- Other tools
  - [x] `for cmd in make wget xmllint xsltproc unzip; do which $cmd > /dev/null || echo "Please install $cmd"; done`
- Webserver
  - [ ] With either apache or nginx you'll need to be able to make changes to the configuration (e.g. to create specific rewrite rules).
  - [ ] With either you'll need several modules enabled (with nginx this means recompiling). We've seen better performance with nginx, but apache is easier to set up (at least on ubuntu system) as you usully don't need to compile shibboleth yourself.
  - [ ] ssl
  - [ ] shibboleth-sp (if you need federated auth, you need this if you are aming for CLARIN center)
  - [ ] ~~with nginx you'll be building it from sources along with nginx modules~~
  - [ ] with apache you might avoid that if there is mod-shib2 available for your distribution
  - in either case you need to configure it. Ideally becoming a member of your national federation. As a minimum configure it to use the dummy/test idp at https://www.testshib.org/
  - [ ] optionaly ajp module to connect the tomcat installation
  - version
    - [ ] `nginx -V`
- mail
  - [ ] Prepare smtp name/ip[, username, password]


Web server
----------

I'm going with the Apache web server for now, forgoing nginx. The [main requirements](https://github.com/ufal/clarin-dspace/wiki/Installation----Prerequisites#web-server--servlet-container):

- [ ] Enabled https
- [x] ability to deploy java webapps
- [ ] possibility of running perl/cgi

This is the more specific setup info for the web server: https://github.com/ufal/clarin-dspace/wiki/Web-

### Tomcat
- [ ] If you've decided to go with Tomcat, you might find psi-probe a nice addition, or a measure how to test your setup is working fine.
- [ ] You might need to tweak the memory parameters your tomcat is run with. We have a modified (debian) init.d script similar to [this](https://gist.github.com/kosarko/ac6d9e26a078f17f4a2c) for tomcat8 and java8.
- [ ] [Tomcat / Apache integration](https://github.com/ufal/clarin-dspace/wiki/Connecting-Tomcat-with-Apache)
- [ ] ~~[Tomcat / Nginx integration](https://github.com/ufal/clarin-dspace/wiki/Using-Nginx)~

### HTTPS
- [ ] You'll need to acquire a certificate and set it up in your web server.
- [ ] Apache mod_ssl provides a sample configuration in some distributions.
- [ ] ~~Nginx tips are in the Tomcat Nginx section above.~~
- [ ] Should be fairly simple to obtain a certificate through Let's Encrypt.
- [ ] Don't forget to include the whole certificate chain in your configs.

### Rewrites
- [ ] You'll need to set your web server with additional rewrites to by compliant with Centres' requirements. See them in the [checklist](https://github.com/ufal/clarin-dspace/wiki/Repository-Checklist#web-server-rewritesredirects).
