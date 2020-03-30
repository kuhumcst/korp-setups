repository.clarin.dk
====================
Here I will try to document - for the sake of my future self and other maintainers - the important bits of of knowledge concerning the Docker setup of `repository.clarin.dk`.

Current state
-------------

Builds a rudimentary version of the clarin-dspace setup, with only the xmlui part of clarin-dspace (barely) enabled. It should be accessible through e.g. https://localhost/xmlui/page/cite, but https://localhost/xmlui somehow doesn't work.

TODO
----

* Need to figure out how [dspace overlays](https://github.com/ufal/clarin-dspace/wiki/Overlays) work.
  - Investigate dokuwiki and existing code on the server.
  - Is there a hidden SVN repo with overlay code somewhere?
  - Is this the key to understanding why https://localhost/xmlui/ hangs indefinitely while https://localhost/xmlui/login works?
* Document postgres setup

Infrastructure as code
----------------------
The central idea is that `repository.clarin.dk` is deployed as a Docker container. Docker is a way to package and deploy Linux server apps using shell commands in a similar way to apt-get or Homebrew. It can also be used on Windows or macOS, but accomplishes this by running the container in a Linux VM.

To build and deploy the project, you need to install [Docker](https://www.docker.com/) as well as [docker-compose](https://docs.docker.com/compose/).

## Project overview
Most of the project files are related to our use of Docker. The most important ones are:

* `Dockerfile` - builds a single Docker image that we can run as a Docker container.
* `docker-compose.yml` - defines data volumes and environment variables for the Docker image. Used to build the image and deploy it as a container.

These two files contain most of the necessary code to set up and deploy our system, but we also have a need for the following:

* `start.sh` - called at the very end of the `Dockerfile`. Starts the various processes that run inside our Docker container (e.g. servers, database).
* `.env` - environment variables used by docker-compose during the build step.
* `default.env` - default runtime environment variables. Can be modified by the user when running the container using docker-compose.

Redeployment then consists of making changes to the above files, testing the changes locally, and running the appropriate commands to redeploy on the production server. Both the development machine and the production server will need to have docker-compose installed, but the setup and deployment of the app should otherwise be self-contained.

### Build, test, deploy
The basic workflow is done entirely using a few docker-compose commands. It can be helpful to alias these in your local terminal since you will be typing them a lot during development.

_Note: before you can build the image for the first time, you will need to [create certificate files](#setting-up-https) for serving with Apache using HTTPS!_

```
# Build image(s) and run container(s) in a detached state with `docker-compose`
docker-compose up -d --build

# Enter the running repository container
docker-compose exec app bash

# Stop the running container(s)
docker-compose stop

# If you want to prune the volumes too
docker-compose down --remove-orphans --volumes

```

### Data volumes
The mutable parts of `repository.clarin.dk` are isolated in Docker data volumes. They are defined in the `docker-compose.yml` file and comprise:

* `/usr/local/pgsql/data` - Postgres data directory.
* `/var/log/postgresql` - Postgres logs.
* `/opt/tomcat/logs` - Tomcat logs.
* `/var/log/apache2` - Apache logs.
* `/opt/certs` - SSL certificate files (used by Apache).

The volumes are mounted to paths inside the running Docker container and persist across restarts of the container. The container itself should be considered effectively immutable and **any** data that is not contained by the volumes listed above considered completely temporary.

_NOTE: when running the Docker container on a Mac these paths actually refer to paths in the Linux VM that is used to run the container rather than actual paths in the Mac file system!_

Inside the Docker container
---------------------------
In this section I will give an overview of the components that are set up inside the Docker container, focusing on the bits that are most important to understand.

### PostgreSQL
TODO: write stuff

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

#### Setting up HTTPS
You will need two certificate files in order to set up Apache properly for HTTPS. If you want to develop and run the Docker container locally, you should check out [these general instructions](https://github.com/kuhumcst/infrastructure/blob/master/README.md#https-for-local-development).

In `docker-compose.yml`, the certificates are set up by default to be located in the **parent directory** of the .yml file, i.e. the root directory of the git project. The certificate directory is then mirrored inside the Docker container at `/opt/certs`. The location of the certificates is defined dynamically by `$CERTIFICATE_DIR` in the `.env` file.

### Clarin-dspace
The main backend code for `repository.clarin.dk` comes from a project called [clarin-dspace](https://github.com/ufal/clarin-dspace) which is a fork of the [DSpace](https://en.wikipedia.org/wiki/DSpace) project.

Installing, deploying, and running clarin-dspace is centred around a `makefile` that comes with many different targets. The ones that we reference during our deployment of dspace in the Dockerfile are:

* `make install_libs` - installs additional dependencies via maven. Requires `python` to be installed.
* `new_deploy` - compiles and deploys a new instance of clarin-dspace. Consists of 3 steps:
  - `compile` - compiles each of the dspace modules defined by the `pom.xml` found in `/opt/repository/sources/dspace`.
  - `fresh_install` - runs `ant` on for the `fresh_install` target `/opt/lindat-dspace/sources/dspace/dspace/src/main/config/build.xml`. We have modified this target slightly so that it doesn't attempt to test a running postgres instance. This allows us to prebake the entire deploy process into the Docker image.
  - `postinstall` - grants a tomcat user access to the web apps produced in the previous steps and fetches the [lindat-common theme](https://github.com/ufal/lindat-common) from git.
  
The installation directory is at `/opt/lindat-dspace/installation`. Inside this directory we can find logs at `/opt/lindat-dspace/installation/log`.

Two separate files are used to configure the project:

* `variable.makefile` - variables referenced in the [makefile](https://github.com/ufal/clarin-dspace/wiki/Installation#makefile). Mainly has to do with configuring branding/UI.
* `local.properties` - the primary [configuration file](https://github.com/ufal/clarin-dspace/wiki/Configuration) for clarin-dspace.

In order for clarin-dspace to run properly, certain [System Properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html) must be set. We do this through `$CATALINA_OPTS` in the `default.env` file which controls which flags we start the Tomcat process with. Currently these properties include:

* `dspace.dir` - directory of the installer produced during by `make compile`.
* `dspace.configuration` - path to the `dspace.cfg` file located inside the installation directory. This config file refers to some of the variables set in `local.properties` and propably shouldn't be modified directly.

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
