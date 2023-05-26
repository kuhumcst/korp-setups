# Use the official Python base image with Alpine
FROM python:3.9-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the application code to the container
COPY app.py .

# Install dependencies
RUN apk update && apk add --no-cache git

# Install Python dependencies - so few we don't care about requirements.txt
RUN git clone https://github.com/phildiderichsen/Kielipankki-korp-backend-fork.git
RUN pip install Kielipankki-korp-backend-fork/
RUN pip install flask==2.3.2 requests gunicorn

# Run the Flask application using Gunicorn
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:4000"]