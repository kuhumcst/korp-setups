repository.clarin.dk
====================
Here I will try to document -- for the sake of my future self (and others) -- the important bits of of knowledge concerning our Docker setup of `repository.clarin.dk`.

Infrastructure as code
----------------------
The central idea is that `repository.clarin.dk` is deployed as a Docker container. Docker is a way to package and deploy Linux server apps using shell commands in a similar way to apt-get or Homebrew. It can also be used on Windows or macOS, but accomplishes this by running the container in a Linux VM.


## Dockerfile & docker-compose.yml
The `Dockerfile` and the `docker-compose.yml` file contain all of the setup and deployment needed. Redeployment then consists of making changes to these files, testing the changes locally, and running the appropriate commands to redeploy on the production server. Both the development machine and the production server will need to have Docker installed, but the setup and deployment of the app should otherwise be self-contained.

TODO: more stuff to come in this section, e.g. actual commands

### Data volumes
The mutable parts of `repository.clarin.dk` are isolated in named Docker volumes. They are defined in the `docker-compose.yml` file and comprise the

* Postgres data directory
* Postgres logs
* Tomcat logs
* ... & more to come!

The volumes are mounted to paths inside the running Docker container and persist across restarts of the container. The container itself should be considered effectively immutable and **any** data that is not contained by the volumes listed above considered completely temporary.

_NOTE: when running the Docker container on a Mac these paths actually refer to paths in the Linux VM that is used to run the container rather than actual paths in the Mac file system!_

Inside the Docker container
---------------------------
In this section I will give an overview of the components that are set up inside the Docker container, focusing on the bits that are most important to understand.

### Tomcat
We use version 8 of the Java-based Tomcat web server (the latest stable version is 9, soon to be 10). Tomcat is used to deploy web applications as [Java servlets](https://en.wikipedia.org/wiki/Java_servlet) distributed in [.WAR-files](https://en.wikipedia.org/wiki/WAR_(file_format)). These are basically just zip files that bundle static assets with a Java class that can handle requests from clients.

Like lots of crusty old Java projects, [Tomcat](https://en.wikipedia.org/wiki/Apache_Tomcat) introduces a whole lot of jargon, some of which is specific to Java web development and some of which is specific to Tomcat itself. The [documentation](http://tomcat.apache.org/tomcat-8.0-doc/) also makes a lot of assumptions rooted in old-fashioned build and deployment tooling.

Fortunately, using Tomcat is not too hard if you can get past the jargon and the antiquated tooling. It's also well-suited for distribution with Docker!

The important thing to note is that everything basically goes into a single root directory that is referred to as `$CATALINA_HOME` or `$CATALINA_BASE`. In our case, they refer to the same thing since we only have a single Tomcat installation in our Docker container (in `/opt/tomcat`).

Inside this root directory, there are some directories of note:

* `/opt/tomcat/bin` - where the `startup.sh` and `shutdown.sh` scripts reside.
* `/opt/tomcat/webapps` - a magical directory where you can drop .WAR-files and get a web app served by tomcat.
* `/opt/tomcat/conf` - where the config files reside. The important one is `server.xml`.
* `/opt/tomcat/logs` - where the logs go.


### Apache Web Server
We use the default version in Ubuntu 18.04 (2.4.x) of the Apache Web Server. Apache's function is to be a reverse proxy for incoming HTTP requests on behalf of the Tomcat server (which we have set up to use the AJP protocol).

Ubuntu's fork of Apache differs in one crucial way: the single `httpd.conf` has been [split into multiple files](https://help.ubuntu.com/lts/serverguide/httpd.html) located in multiple directories. These are as follows:

* `/etc/apache2/apache2.conf`- the main configuration file. Includes all remaining configuration files when starting up the web server.
* `/etc/apache2/ports.conf`- used to determine the listening ports for incoming connections.
* `/etc/apache2/mods-enabled/`- configs relating to Apache modules.
* `/etc/apache2/conf-enabled/`- configs relating to global configuration.
* `/etc/apache2/sites-enabled/`- configs relating to virtual hosts.

The convention is to symlink the actual config files in last three directories from `../mods-available/`, `../conf-available/`, and `../sites-available/`. In our case, that convention does not really matter since we build a new Docker container every time we redeploy and don't have to worry about configuring a live system directly.

Some other directories of note:

* `/var/log/apache2/` - where the logs go.


#### Setting up HTTPS for local development
In order to set up Apache properly with HTTPS for development on [localhost](https://localhost:443) it is necessary to generate and approve your own local certificate.

[Let's Encrypt](https://letsencrypt.org/docs/certificates-for-localhost/) provides a simple one-liner which should be run as a prerequisite. Here is a slightly modified version:

```
openssl req -x509 -out repository.clarin.dk.crt -keyout repository.clarin.dk.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

This generates a `repository.clarin.dk.crt` and a `repository.clarin.dk.key` file.

The `repository.clarin.dk.crt` file should be added to your list of trusted certificates. On macOS, this is done by 

* opening up `Keychain Access.app`
* importing the `repository.clarin.dk.crt` file
* ensuring that it is fully trusted by double clicking on the newly added `localhost` listing and selecting _"Always allow"_.

In the default `docker-compose.yml` configuration the certificate will be loaded from the same directory as the `docker-compose.yml` file. This is defined by `$CERTIFICATE_DIR` in the `.env` file:

* `/opt/certs` - location of the certificate files.

More documentation
------------------
Various bits of the documentation found here has been sourced from the following places:

* https://github.com/ufal/clarin-dspace/blob/clarin/README.md
* https://github.com/ufal/clarin-dspace/wiki/Installation----Prerequisites
  - https://github.com/ufal/clarin-dspace/wiki/Repository-Checklist
* https://github.com/ufal/clarin-dspace/wiki/Web-Server
  - https://github.com/ufal/clarin-dspace/wiki/Connecting-Tomcat-with-Apache
* https://github.com/ufal/clarin-dspace/wiki/Installation
  - https://github.com/ufal/clarin-dspace/blob/clarin/utilities/project_helpers/scripts/makefile
* ... and the [clarin-dspace Wiki](https://github.com/ufal/clarin-dspace/wiki
) in general.
