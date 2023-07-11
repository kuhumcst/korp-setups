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
RUN pip install flask==2.3.2 requests gunicorn httpx

# Copy the application code to the container
COPY app.py .

# Run the Flask application using Gunicorn
# TODO: Consider asynchronous handling of requests (Flask-Sync, Quart).
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:4000", "--timeout", "3000"]