KORP
====
This is a custom Docker setup of KORP: a web interface ([frontend](https://github.com/spraakbanken/korp-frontend) and [backend](https://github.com/spraakbanken/korp-backend)) to the beta version of [CWB (IMS Corpus Workbench)](http://cwb.sourceforge.net/beta.php).

TODOS
-----
* [x] Frontend setup (hook up)
  - [x] fork the frontend project, apply changes and use that instead of copying in replacement files
  - [x] update modes from old installation to new KORP (note: complicated by downstream changes)
  - [ ] Generate frontend nav automatically (research if feasible)
  - [x] [Danish language support](https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md#adding-languages)
* [x] Database setup (for visualisation and "word pictures")
* [ ] Generate datasets from input data and data description (research if feasible)
* [ ] FCS setup
    - [ ] ~~FCS data should be generated automatically~~ (not feasible)
    - [ ] run korp-fcs-endpoint in Docker too
* [ ] research korp cgi script: What is the purpose? Still relevant?
* [ ] create outer shell docker-compose.yml for serving korp and voyant together (currently done using nginx on alf)
    - [ ] Is kddata/[kd-demo](https://alf.hum.ku.dk/kd-demo/) still needed? See `/etc/nginx/includes` and https://cst.dk/dokuwiki/doku.php?id=kd_demo

Build, test, deploy
===================
Note: the following environment variables must be set

* `$CORPORA_DIR` _must_ be set for the backend service to work properly. Contains the corpora-related subfolders such as registry, data, etc.
* `$KORP_FRONTEND_CONFIG_DIR` _must_ be set for the frontend service to work properly. Contains .js/.json files that are patched in before building the project, e.g. config.js, modes/*, translations/*. Should mirror the layout of the `app` folder in the korp-frontend project. The contents of `korp/frontend/app/` in this repository serves as a version-controlled example of this sort of config directory and is used in production for the CST corpora. The relevant changes exist in the `cst-setup` branch of the `kuhumcst/korp-frontend` project too.

```
# Build image(s) and run container(s) in a detached state with `docker-compose`
docker-compose up -d --build

# Enter the running containers
docker-compose exec backend bash
docker-compose exec frontend bash

# Stop the running container(s)
docker-compose stop

# If you want to prune the volumes too
docker-compose down --remove-orphans --volumes

```

The `docker-compose.yml` in this directory will start both the backend and frontend services. The backend service starts very quickly, while the frontend service starts a little slower due to having to run the build step dynamically too. 

In case _only_ the backend service needs to be started, use the `docker-compose.yml` in the backend subdirectory. The frontend can then be run independently, e.g. from a checked out `korp-frontend` git repo, using the following commands:

```
yarn
yarn build
yarn start:dist
```

The ideal development loop consists of running the backend service in a Docker container, while making changes to the frontend project and then copying the relevant files to `korp/frontend/app/` in this project. For production systems, the frontend Dockerfile should point to the latest stable git commit and the `docker-compose.yml` in this outer directory should be used to run the full system (backend + frontend services).

Up-to-date fork
---------------
The old - and current as of now - CST installation of KORP is based on the KORP [frontend](https://github.com/CSCfi/Kielipankki-korp-frontend) and [backend](https://github.com/CSCfi/Kielipankki-korp-backend) forks maintained by  Kielipankki, the Language Bank of Finland (frontend: [this commit](https://github.com/CSCfi/Kielipankki-korp-frontend/commit/c405880462eae55000fd56c5d039050e132b87f7); backend: [this commit](https://github.com/CSCfi/Kielipankki-korp-backend/commit/c1d6a83f2511e7bbd9dddfa5c0089a13dc687001)). In their frontend README, they explicitly state

> Please fork the original Språkbanken’s korp-frontend GitHub repository instead of this one in the first place.

So this new Docker setup uses the original Språkbanken code as its base instead of Kielipankki's forks.

### Major changes
* `datasetSelect` replaces the previous `selectType.controller` format.
* Lots of JSON keys have been converted from snake-case to camelCase, e.g. `struct_attributes` -> `structAttributes`

### Git branches
For both the frontend and backend, the CST specific changes are kept in the `master` branch and development branches must branch out from this. The master branch is then continuously rebased on top of the `upstream-master` branch which tracks the upstream code changes by Språkbanken.

Similarly, `upstream-dev` tracks the upsteam `dev` branch, while `upstream-dev-bugfixes` contain our own fixes that we hope to get merged upstream. The motivation is to keep the CST forks as close as possible to the upstream repositories while being able to submit patches upstream when need be.

### Configuration documentation
* https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md

### run_config.json
The documentation for the korp-frontend also specifies that one should [put a run_config.json in the project directory](https://github.com/spraakbanken/korp-frontend/blob/dev/doc/frontend_devel.md#configuration) to specify where any custom configuration files are located. Despite its name, this file is _not_ actually for runtime configuration, but actually contains configurations needed to run the `yarn build` command. This makes it quite pointless to actually have custom configuration files as they need to be compiled into the final build anyway. Instead of using a `run_config.json` file, we make the necessary changes directly in the source code.

Inspiration
-----------
* https://github.com/fau-klue/docker-corpus-tool
