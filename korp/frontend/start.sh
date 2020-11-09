#!/bin/bash

cp -r /opt/korp-frontend/config/* /opt/korp-frontend/app/ &&

# korp-frontend stupidly requires these optional directories to exist too..
mkdir -p "/opt/korp-frontend/config/styles" &&
mkdir -p "/opt/korp-frontend/config/scripts" &&

yarn build &&
yarn start:dist
