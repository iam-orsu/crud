#!/bin/bash

# Create directory for local certs
mkdir -p nginx/certs

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/privkey.pem \
  -out nginx/certs/fullchain.pem \
  -subj "/C=US/ST=Dev/L=Locality/O=Dev/CN=localhost"

echo "Self-signed certificates generated in nginx/certs/"
