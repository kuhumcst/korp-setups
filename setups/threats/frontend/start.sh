#!/bin/bash

# Meta-note: patching using sync.sh will likely not work if no frontend volumes are set up.
# Note: Code can also be patched in a running system using sync.sh, but only for
# the translations/ and modes/ directories. See the relevant README section:
# https://github.com/kuhumcst/infrastructure/tree/master/korp#updating-modes-and-translations

yarn start:dist
