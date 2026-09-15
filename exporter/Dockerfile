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

# Install Python dependencies.
# gevent 23.7 has no binary wheel for Python 3.8 on arm64 (Apple Silicon dev
# machines), so pip builds it from source; that needs Cython 3.0 and fails
# on Cython 3.1+ (2026-09). The build constraint pins it. On x86_64
# production hosts a wheel is used and the constraint is idle. pip 25
# dropped Python 3.8, hence "<25".
RUN pip install --upgrade "pip<25"
RUN printf 'cython>=3.0,<3.1\n' > /tmp/build-constraints.txt
ENV PIP_CONSTRAINT=/tmp/build-constraints.txt
RUN git clone https://github.com/phildiderichsen/Kielipankki-korp-backend-fork.git
RUN pip install Kielipankki-korp-backend-fork/
RUN pip install -r requirements.txt
RUN python3 -c "import gevent, flask_socketio, korpexport; print('exporter deps ok, gevent', gevent.__version__)"

# Run the Flask app
CMD ["python3", "app.py"]
