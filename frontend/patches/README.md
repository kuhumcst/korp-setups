# frontend patches

Each *.patch here is applied with `git apply --3way` on top of the upstream
korp-frontend tag checked out in ../Dockerfile. The base image build fails if a
patch no longer applies, which is the intended signal on every upstream bump.

Keep every patch small, name it NNNN-what-it-does.patch, and start it with a
comment line saying why it exists and whether it has been proposed upstream.
