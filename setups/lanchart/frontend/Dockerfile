FROM korp_frontend_base

COPY app/ /opt/korp-frontend/app/

# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh

# Debugging: Keep running and enter using `docker-compose exec frontend bash`
#CMD tail -f /dev/null