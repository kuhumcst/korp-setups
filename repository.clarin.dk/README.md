Dockerfile
----------

Build from Dockerfile:

```
docker build -t repo .
```

Kill any existing container and run the latest build:

```
docker run -dt repo:latest
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
docker-compose exec repo /bin/bash
```

Stop the running container(s) if detached

```
docker-compose stop
```
