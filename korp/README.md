Korp
====
This is a custom Docker setup of Korp: a web interface ([frontend](https://github.com/spraakbanken/korp-frontend) and [backend](https://github.com/spraakbanken/korp-backend)) for the beta version of [CWB (IMS Corpus Workbench)](http://cwb.sourceforge.net/beta.php). Two Docker images ([korp_backend_base](https://github.com/kuhumcst/infrastructure/blob/master/korp/backend) and [korp_frontend_base](https://github.com/kuhumcst/infrastructure/blob/master/korp/frontend)) form the basis of a selection of derived [Korp setups](https://github.com/kuhumcst/infrastructure/blob/master/korp/setups) maintained by the University of Copenhagen.

The original purpose was to replace Clarin.dk's [ailing instance of Korp](https://alf.hum.ku.dk/korp-old) (still available for a limited time) with a more [up-to-date, Dockerised version](https://alf.hum.ku.dk/korp) (the [Clarin setup](https://github.com/kuhumcst/infrastructure/blob/master/korp/setups/clarin) production instance).

Build, test, deploy
------------------
Deployment consists of

* Fetching the infrastructure repository on the production server
* Building the base images using docker-compose
* Building and running the full system using docker-compose

This will start two local Docker containers processes serving the frontend and backend.

The production server of the Clarin setup (Alf) is currently running an nginx server which serves as a gateway for both of these to the public Internet. In the future it might make sense to run this nginx server in a separate Docker container too (see [TODOS](#TODOS) below).

### Environment variables
The following environment variables must be set up correctly before building/running a Korp setup:

* `$CORPORA_DIR` - a path to the directory containing the corpora-related subfolders such as registry, data, etc.

The [.env file](https://github.com/kuhumcst/infrastructure/blob/master/korp/.env) in this directory contains default values, but they may need to be changed.

Docker commands
---------------
> _NOTE: all commands must be run in a directory containing a `docker-compose.yml` file!_

### Building and running containers
When `$CORPORA_DIR` is defined in the shell and your frontend config is sound,
building and running the system should be fairly simple.

```shell
# Build image(s) and store them in the local Docker repo, but do not run them!
# This command is mainly used to build the base images in the korp/ root.
docker-compose build

# Build image(s) and run container(s) in a detached state with `docker-compose`;
# the most common way to run a setup. Omit the -d to get command-line feedback.
# Note that this requires necessary environment variables to be defined too!
docker-compose up -d --build

# When building one of the setups, in practice this just means prepending the 
# `up` part of the command with `--env-file ../../.env` - or whatever relative 
# path that will resolve correctly for your setup.
docker-compose --env-file ../../.env up -d --build
```

### Debugging
Of course, in the real world, you will need to debug the system.

```shell
# When something is misbehaving, get feedback by NOT running in a detached state
docker-compose up

# Restart - but do not rebuild - a single container
# Needed if Dockerfile/docker-compose.yml are untouched, but changes exist in e.g. frontend/app/config.js
docker-compose restart backend
docker-compose restart frontend

# Enter the running containers
docker-compose exec backend bash
docker-compose exec frontend bash

# Stop the running container(s)
docker-compose stop

# If you want to prune the volumes too
docker-compose down --remove-orphans --volumes
```

### Creating setups that inherit from parent images
The `korp/setups` directory contains custom setups used in different contexts. As an example,
the setup in `korp/setups/clarin` is the Korp instance available at [clarin.dk](https://alf.hum.ku.dk/korp). 

A Dockerfile file cannot extend another Dockerfile, only Docker images. These images can either be pulled from a Docker repository or pulled from the local repository on your machine. Once built, the image is available and can be used as a parent image of another Dockerfile, e.g. an example Dockerfile might extend the frontend base:

```Dockerfile
FROM korp_frontend_base

# Using a custom entrypoint
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
```

However, before we can create Dockerfiles that extend `korp_frontend_base` or `korp_backend_base` we must first build these images. That is accomplished by running

```shell
docker-compose build
```

inside the `korp/` directory where the `docker-compose.yml` creating the base images is located.

### Updating modes and translations
It is possible to update mode files and translation files while the system is running without restarting it. In order to synchronize files, the user should navigate to the korp project directory (in the case of the current Clarin production version that is `/opt/corpora/infrastructure/korp/setups/clarin`) and execute the following command:

```bash
docker-compose exec frontend sync.sh
```

This command will run a script copying files from `modes/` and `translations/` to the `dist/` folder that is internal to the Korp docker container. The `modes/` and `translations/` folders are subfolders of `/opt/corpora/infrastructure/korp/app` in the current CST Korp installation.

Any other updates to files in `/opt/corpora/infrastructure/korp/setups/clarin/app` will require restarting the Docker container (takes 1-2 minutes):

```bash
docker-compose --env-file ../../.env up -d --build
```

> _Note: in order to see the changes in the browser, it might be necessary to reload the page too!_

Running the frontend independently
----------------------------------
In case _only_ the backend service needs to be started, make sure the relevant `docker-compose.yml` does not start a frontend container, e.g. by commenting out the relevant code. The frontend can then be run independently, e.g. from a checked out `korp-frontend` git repo, using the following commands:

```
yarn
yarn build
yarn start:dist
```

The `config.js` must contain a valid `korpBackendURL` endpoint. For the CST production system this value is `https://alf.hum.ku.dk/korp/backend`, but when running the system locally it must refer to `localhost:1234` instead. Changing this value requires explicitly restarting the affected container; rebuilding will not be enough as only changing `config.js` means the image is still identical.

The ideal development loop consists of running the backend service in a Docker container, while making changes to the frontend project and then copying the relevant files to `korp/frontend/app/` in this project. For production systems, the frontend Dockerfile should point to the latest stable git commit and the `docker-compose.yml` in this outer directory should be used to run the full system (backend + frontend services).

Up-to-date fork
---------------
The old CST installation of Korp is based on the Korp [frontend](https://github.com/CSCfi/Kielipankki-korp-frontend) and [backend](https://github.com/CSCfi/Kielipankki-korp-backend) forks maintained by Kielipankki, the Language Bank of Finland (frontend: [this commit](https://github.com/CSCfi/Kielipankki-korp-frontend/commit/c405880462eae55000fd56c5d039050e132b87f7); backend: [this commit](https://github.com/CSCfi/Kielipankki-korp-backend/commit/c1d6a83f2511e7bbd9dddfa5c0089a13dc687001)). In their frontend README, they explicitly state

> Please fork the original Språkbanken’s korp-frontend GitHub repository instead of this one in the first place.

So this new Docker setup uses the original Språkbanken code as its base instead of Kielipankki's forks. Språkbanken's current instance of Korp is live at: https://spraakbanken.gu.se/korp

### Git branches
For the korp-frontend repo, the CST specific changes are kept in the `cst-setup` branch. The branch is then continuously rebased on top of the `upstream-master-bugfixes` branch which tracks the upstream code changes by Språkbanken and applies a few bugfixes.

### Major changes
* `datasetSelect` replaces the previous `selectType.controller` format.
* Lots of JSON keys have been converted from snake-case to camelCase, e.g. `struct_attributes` -> `structAttributes`
* The language selection menu in `includes/header.pug` has had a line with Danish added.

### Configuration documentation
* https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md

### run_config.json
The documentation for the korp-frontend also specifies that one should [put a run_config.json in the project directory](https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md#configuration) to specify where any custom configuration files are located. Despite its name, this file is _not_ actually used for runtime configuration, but actually contains configurations needed to run the `yarn build` command. We have not found a need for `run_config.json` that wasn't better served by simply patching the `app/` directory recursively. 

Inspiration
-----------
* https://github.com/fau-klue/docker-corpus-tool

TODOS
-----
* [x] Frontend setup (hook up)
  - [x] fork the frontend project, apply changes and use that instead of copying in replacement files
  - [x] update modes from old installation to new Korp (note: complicated by downstream changes)
  - [x] ~~Generate frontend nav automatically (research if feasible)~~ (answer: it mostly is, the one exception being the language selection in `includes/header.pug`)
  - [x] [Danish language support](https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md#adding-languages)
* [x] Database setup (for visualisation and "word pictures")
* [x] Fix docker network issues in nginx setup? why can't I access 0.0.0.0:1234 from frontend container? (answer: in production the JS client is running locally, but the backend of course isn't so the JS frontend cannot access 0.0.0.0:1234)
* [ ] ~~Generate datasets from input data and data description, research if feasible~~ (answer: still need more info, but it does not seems so)
* [x] Research korp cgi script: What is the purpose? Still relevant? (answer: seems to be the old korp.py)
* [ ] **Create outer shell docker-compose.yml for serving korp and voyant together** (currently done using nginx on alf)
    - [ ] Is kddata/[kd-demo](https://alf.hum.ku.dk/kd-demo/) still needed? See `/etc/nginx/includes` and https://cst.dk/dokuwiki/doku.php?id=kd_demo
    - [ ] FCS setup
        * [ ] ~~FCS data should be generated automatically~~ (not feasible)
        * [ ] run korp-fcs-endpoint in Docker too
