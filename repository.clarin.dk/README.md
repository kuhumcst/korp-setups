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

* `$CATALINA_HOME/bin` - where the `startup.sh` and `shutdown.sh` scripts reside.
* `$CATALINA_HOME/webapps` - a magical directory where you can drop .WAR-files and get a web app served by tomcat.
* `$CATALINA_HOME/conf` - where the config files reside. The important one is `server.xml`.
* `$CATALINA_HOME/logs` - where the logs go.
