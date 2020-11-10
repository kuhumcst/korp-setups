#!/bin/bash

cp -r /opt/korp-frontend/config/* /opt/korp-frontend/app/ &&

yarn build &&
yarn start:dist
