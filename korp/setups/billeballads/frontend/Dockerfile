FROM korp_frontend_base

# Make sure to remove "modes" dir before copying "app" (in order to REPLACE "modes").
# Complementing files in "modes" with local mode files is not sufficient:
# Error "r.corpora not defined" if mode files specify corpora that are not in the backend.
RUN rm -r /opt/korp-frontend/app/modes
RUN ls /opt/korp-frontend/app

# Next, copy files in local "app" to corresponding paths in "/opt/korp-frontend/app",
# without substituting existing dirs. (config.js will be replaced, modes dir will be added,
# and files in translations will be replaced if files with corresponding file names are present
# in local app/translations -- the whole translations dir is NOT replaced).
COPY app /opt/korp-frontend/app

# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
