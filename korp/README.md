KORP
====
This is a custom Docker setup of KORP: a web interface ([frontend](https://github.com/spraakbanken/korp-frontend) and [backend](https://github.com/spraakbanken/korp-backend)) to the beta version of [CWB (IMS Corpus Workbench)](http://cwb.sourceforge.net/beta.php).

* A live version of this frontend is available at: https://alf.hum.ku.dk/korp
* The backend API is available at: https://alf.hum.ku.dk/korp/backend
* The old, non-Dockerised setup is still temporarily available at: https://alf.hum.ku.dk/korp-old
* Språkbanken's own up-to-date implementation is available at: https://spraakbanken.gu.se/korp

Build, test, deploy
------------------
Deployment consists of

* fetching the infrastructure repository on the production server
* building and running the full system using docker-compose

This will start two local server processes serving the frontend and backend. The production server (Alf) is currently running an nginx server which serves as a gateway for both of these to the public Internet. In the future it might make sense to run this nginx server in a separate Docker container too (see [TODOS](#TODOS) below).

Docker commands
---------------
_NOTE: the following environment variables must be set up correctly before building/running the system_

* `$CORPORA_DIR` _must_ be set for the backend service to work properly. Contains the corpora-related subfolders such as registry, data, etc.
* `$KORP_FRONTEND_CONFIG_DIR` _must_ be set for the frontend service to work properly. Contains .js/.json files that are patched in before building the project, e.g. config.js, modes/*, translations/*. Should mirror the layout of the `app` folder in the korp-frontend project. The contents of `korp/frontend/app/` in this repository serves as a version-controlled example of this sort of config directory and is used in production for the CST corpora. The relevant changes exist in the `cst-setup` branch of the `kuhumcst/korp-frontend` project too.

The `.env` file in this repo contains default values, but they may need to be changed.

```
# Build image(s) and run container(s) in a detached state with `docker-compose`
docker-compose up -d --build

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

_NOTE: all commands must be run in a directory containing a `docker-compose.yml` file!_

The `docker-compose.yml` in this directory will start both the backend and frontend services. The backend service starts very quickly, while the frontend service starts a little slower due to having to run the build step dynamically too.

### Running the frontend independently 
In case _only_ the backend service needs to be started, use the `docker-compose.yml` in the backend subdirectory. The frontend can then be run independently, e.g. from a checked out `korp-frontend` git repo, using the following commands:

```
yarn
yarn build
yarn start:dist
```

The `config.js` must contain a valid `korpBackendURL` endpoint. For the CST production system this value is `https://alf.hum.ku.dk/korp/backend`, but when running the system locally it must refer to `localhost:1234` instead. Changing this value requires explicitly restarting the affected container, rebuilding will not be enough as only changing `config.js` means the image is still identical.

The ideal development loop consists of running the backend service in a Docker container, while making changes to the frontend project and then copying the relevant files to `korp/frontend/app/` in this project. For production systems, the frontend Dockerfile should point to the latest stable git commit and the `docker-compose.yml` in this outer directory should be used to run the full system (backend + frontend services).

### Git branches
For the korp-frontend repo, the CST specific changes are kept in the `cst-setup` branchs. The branch is then continuously rebased on top of the `upstream-master-bugfixes` branch which tracks the upstream code changes by Språkbanken and applies a few bugfixes.

Up-to-date fork
---------------
The old CST installation of KORP is based on the KORP [frontend](https://github.com/CSCfi/Kielipankki-korp-frontend) and [backend](https://github.com/CSCfi/Kielipankki-korp-backend) forks maintained by Kielipankki, the Language Bank of Finland (frontend: [this commit](https://github.com/CSCfi/Kielipankki-korp-frontend/commit/c405880462eae55000fd56c5d039050e132b87f7); backend: [this commit](https://github.com/CSCfi/Kielipankki-korp-backend/commit/c1d6a83f2511e7bbd9dddfa5c0089a13dc687001)). In their frontend README, they explicitly state

> Please fork the original Språkbanken’s korp-frontend GitHub repository instead of this one in the first place.

So this new Docker setup uses the original Språkbanken code as its base instead of Kielipankki's forks.

### Major changes
* `datasetSelect` replaces the previous `selectType.controller` format.
* Lots of JSON keys have been converted from snake-case to camelCase, e.g. `struct_attributes` -> `structAttributes`
* The language selection menu in `includes/header.pug` has had a line with Danish added.

### Configuration documentation
* https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md

### run_config.json
The documentation for the korp-frontend also specifies that one should [put a run_config.json in the project directory](https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md#configuration) to specify where any custom configuration files are located. Despite its name, this file is _not_ actually used for runtime configuration, but actually contains configurations needed to run the `yarn build` command.

Currently, instead of using a `run_config.json` file, custom frontend configuration is applied dynamically as an input argument to the Docker container by running the final build step as part of the container start-up process. This a trade-off over running this step as part of the image build process: start-up time increases substantially (taking 1 minute or 2 Vs. a few seconds), but in return the user can dynamically alter any part of Korp frontend.

Inspiration
-----------
* https://github.com/fau-klue/docker-corpus-tool

TODOS
-----
* [x] Frontend setup (hook up)
  - [x] fork the frontend project, apply changes and use that instead of copying in replacement files
  - [x] update modes from old installation to new KORP (note: complicated by downstream changes)
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