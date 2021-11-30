FROM korp_frontend_base

COPY app/ /opt/korp-frontend/app/

# TODO: needed since the dev branch didn't have common.js - revisit later
# Temporary hotfix that downloads the latest upstream common.js from master.
# ADD https://raw.githubusercontent.com/spraakbanken/korp-frontend/master/app/modes/common.js /opt/korp-frontend/app/modes/common.js
# PD: common.js is no longer on github. Added to app/modes/ in the general frontend image.

# The current-as-of-writing-this version of Korp requires a dummy HTML file.
RUN touch /opt/korp-frontend/app/modes/glen.html

# Build the project from the patched korp-frontend source code (and its deps)
RUN yarn build

# Start the main process
COPY start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh

# Debugging: Keep running and enter using `docker-compose exec frontend bash`
#CMD tail -f /dev/null
