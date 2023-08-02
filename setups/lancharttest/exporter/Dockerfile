FROM ubuntu:focal

# Set the working directory in the container
WORKDIR /app

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    python3 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies - so few we don't care about requirements.txt
RUN git clone https://github.com/phildiderichsen/Kielipankki-korp-backend-fork.git
RUN pip install Kielipankki-korp-backend-fork/
RUN pip install flask==2.3.2 Flask-SocketIO==5.3.5 requests gevent==23.7.0 gevent-websocket==0.10.1 httpx


# Copy the application code and the templates dir to the container
COPY app.py .
COPY templates templates

# Run the Flask app
CMD ["python3", "app.py"]
