#!/bin/bash

# Cloudflare Pages build script
echo "Starting Cloudflare Pages build..."

# Copy production config
cp next.config.production.js next.config.js

# Install dependencies
npm install

# Build the application
npm run build:dev

echo "Build completed successfully!"