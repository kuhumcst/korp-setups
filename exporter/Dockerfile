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

# Copy the application code etc. to the container
COPY app.py .
COPY requirements.txt .
COPY download_utils download_utils
COPY korpexport_overrides korpexport_overrides
COPY templates templates
COPY static static

# Install Python dependencies
RUN git clone https://github.com/phildiderichsen/Kielipankki-korp-backend-fork.git
RUN pip install Kielipankki-korp-backend-fork/
RUN pip install -r requirements.txt

# Run the Flask app
CMD ["python3", "app.py"]
