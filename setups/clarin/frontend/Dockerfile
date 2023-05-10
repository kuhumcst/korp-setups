FROM korp_frontend_base

COPY app/ /opt/korp-frontend/app/

# TODO: needed since the dev branch didn't have common.js - revisit later
# Temporary hotfix that downloads the latest upstream common.js from master.
# ADD https://raw.githubusercontent.com/spraakbanken/korp-frontend/master/app/modes/common.js /opt/korp-frontend/app/modes/common.js
# PD: common.js is no longer on github. Added to app/modes/ in the general frontend image.

# The current-as-of-writing-this version of Korp requires a dummy HTML file.
RUN touch /opt/korp-frontend/app/modes/glen.html


# Copy markdown user guides organized for the mkdocs static site generator.
COPY --from=korp_docs /userguides /opt/korp-frontend/userguides
WORKDIR /opt/korp-frontend/userguides

# Add navigation to mkdocs user guide.
COPY mkdocs_yml_extension.txt ./
RUN cat mkdocs_yml_extension.txt >> mkdocs.yml

# Remove unwanted mkdocs pages, e.g.:
RUN rm docs/lanchart-*.md

# Build mkdocs user guide.
RUN mkdocs build


# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

RUN mv userguides/site dist/userguide

# Start the main process
CMD yarn start:dist

# Debugging: Keep running and enter using `docker-compose exec frontend bash`
#CMD tail -f /dev/null
