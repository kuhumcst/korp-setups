FROM korp_frontend_base

COPY app /opt/korp-frontend/app

# The current-as-of-writing-this version of Korp requires a dummy HTML file.
RUN touch /opt/korp-frontend/app/modes/glen.html

# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
