FROM korp_frontend_base

COPY app/ /opt/korp-frontend/app/

# Copy markdown user guides organized for the mkdocs static site generator.
COPY --from=korp_docs /userguides /opt/korp-frontend/userguides
WORKDIR /opt/korp-frontend/userguides

# Add navigation to mkdocs user guide.
COPY mkdocs_yml_extension.txt ./
RUN cat mkdocs_yml_extension.txt >> mkdocs.yml

# Remove unwanted mkdocs pages, e.g.:
#RUN rm docs/lanchart-*.md

# Build mkdocs user guide.
RUN mkdocs build


# Build the project from the patched korp-frontend source code (and its deps)
WORKDIR /opt/korp-frontend
RUN yarn build

RUN mv userguides/site dist/userguide

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh

# Debugging: Keep running and enter using `docker-compose exec frontend bash`
#CMD tail -f /dev/null