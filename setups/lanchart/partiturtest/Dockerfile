FROM ubuntu:focal

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends -y \
    python3.9 \
    python3-pip \
    sqlite3 \
    mysql-client \
    git \
    vim \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Get partitur code
RUN echo blaaaia
RUN mkdir /opt/partiturtest
WORKDIR /opt/partiturtest
RUN git clone https://philip_diderichsen@bitbucket.org/philip_diderichsen/lanchart_partitur.git
WORKDIR lanchart_partitur
RUN git fetch --all
# Checkout branch with experimental code
RUN git checkout wavesurf

# Start the main process
COPY start.sh /opt/start.sh
RUN chmod +x /opt/start.sh
CMD /opt/start.sh

