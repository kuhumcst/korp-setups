Korp
====
This is a custom Docker setup of Korp: a web interface ([frontend](https://github.com/spraakbanken/korp-frontend) and [backend](https://github.com/spraakbanken/korp-backend)) for the eternal beta version of [CWB (IMS Corpus Workbench)](http://cwb.sourceforge.net/beta.php). Two Docker images ([korp_backend_base](/backend) and [korp_frontend_base](/frontend)) form the foundation of a selection of individual [Korp setups](/setups) maintained by the [Department of Nordic Studies and Linguistics](https://nors.ku.dk/english/) at the University of Copenhagen.

> The original intent was to replace Clarin.dk's ailing instance of Korp with a more [up-to-date, Dockerised version](https://alf.hum.ku.dk/korp) (this is now the [Clarin setup](/setups/clarin)).

Build, deploy, debug
--------------------
> NOTE: you will need to have `git` and `docker` installed on the host machine.

Deployment currently consists of:

1. Cloning this repository on the production server.
2. Building the base images using `docker-compose`.
3. Building and running a specific setup using `docker-compose`.

This will start (at least) two local Docker containers serving the frontend and backend. In some setups additional containers are also in use.

### HTTPS gateway setup
None of the setups come with any kind of SSL certificate support, thus it becomes necessary to install a reverse proxy/gateway in order to serve Korp as HTTPS. The production server of the Clarin setup (Alf) is currently located behind an nginx server which serves as its gateway to the public Internet.

Docker commands
---------------
> _NOTE: all commands must be run in a directory containing a `docker-compose.yml` file!_
> 
> _It is likely that the filesystem permissions are set up in such a way that these commands must be run as a superuser, e.g by prepending them with `sudo`._

### Building base images
To build image(s) and store them in the local Docker repo, but _not_ run them:

```shell
# building parent images
docker-compose build
```

This command is mostly just used to build the base images from inside the root directory. Typically, you will run this once (successfully) and then *only* rerun it when upstream changes to these base Docker configurations land on your branch.

### Running a setup
To build and run a specific setup in a detached state with `docker-compose`:

```shell
# building + running a setup
docker-compose up -d --build
```
> Note: Omit the `-d` to get command-line feedback.

This is the most common way to build _and_ run a setup.

### Debugging
Of course, in the real world, you will need to debug the system.

When something is misbehaving, get feedback by rerunning in a non-detached state. This means omitting the `-d` option - and optionally the `--build` option to skip the build step:

```shell
# running with command-line output
docker-compose up --build

# running with command-line output without rebuilding
docker-compose up
```

This is helpful in cases where the container keeps crashing and you want to see if some error message is written to standard output.

---

In certain cases you might want to restart - but not rebuild - a single container:

```shell
docker-compose restart backend
docker-compose restart frontend
```

This is needed if `Dockerfile`/`docker-compose.yml` are untouched, but changes still exist in files that are loaded dynamically.

---

Very often, you will need to enter a running container to see what it looks from the inside:

```shell
docker-compose exec backend bash
docker-compose exec frontend bash
```
___

In some cases you just want to kill stuff (perhaps you're running multiple Docker containers that are interfering with each other):

```shell
# Stop the running container(s)
docker-compose stop

# If you want to prune the volumes too
docker-compose down --remove-orphans --volumes
```

Creating setups that inherit from parent images
-----------------------------------------------
The [setups](/setups) directory contains custom setups used in different contexts. As an example,
the setup in [setups/clarin](/setups/clarin) is the Korp instance available at [clarin.dk](https://alf.hum.ku.dk/korp). 

A Dockerfile file cannot extend another Dockerfile, only Docker images. These images can either be pulled from a Docker repository or pulled from the local repository on your machine. Once built, the image is globally available and can be used as a parent image of another Dockerfile, e.g. an example Dockerfile might extend the frontend base:

```Dockerfile
FROM korp_frontend_base

CMD yarn start:dist
```

However, before we can create Dockerfiles that extend `korp_frontend_base` or `korp_backend_base` we must first build these images. That is accomplished by running `docker-compose build` inside the root directory where the `docker-compose.yml` creating the base images is located.

### Editing Korp templates
Korp uses [AngularJS](https://angularjs.org/) to generate HTML in the frontend (note that this is different from _Angular_). In some cases you will also run into [JSP syntax](https://www.tutorialspoint.com/jsp/jsp_syntax.htm), e.g. in some of the files located in `modes`. To edit these templates strings you will thus need to familiarise yourself with both template languages used.

Running the frontend independently
----------------------------------
In case _only_ the backend service needs to be started, make sure the relevant `docker-compose.yml` does not start a frontend container, e.g. by commenting out the relevant code or by using a `docker-compose.yml` that doesn't explicitly start the Korp frontend. The frontend can then be run independently, e.g. from a checked out `korp-frontend` git repo, using the following commands:

```shell
yarn
yarn build
yarn start:dist
```

The `config.js` must contain a valid `korpBackendURL` endpoint. For the CST production system this value is `https://alf.hum.ku.dk/korp/backend`, but when running the system locally it must refer to `localhost:1234` instead. Changing this value requires explicitly restarting the affected container; rebuilding will not be enough as only changing `config.js` means the image is still identical.

The ideal development loop consists of running the backend service in a Docker container, while making changes to the frontend project and then copying the relevant files to [frontend/app/](/frontend/app) in this project. For production systems, the frontend Dockerfile should point to the latest stable git commit and the `docker-compose.yml` in this outer directory should be used to run the full system (backend + frontend services).

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
* https://github.com/spraakbanken/korp-frontend-sb
