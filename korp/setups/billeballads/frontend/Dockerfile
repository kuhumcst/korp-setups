FROM korp_frontend_base

# Recursively patch korp-frontend source code with local setup files
COPY app/* /opt/korp-frontend/config/
RUN cp -r /opt/korp-frontend/config/* /opt/korp-frontend/app/

# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
