#!/bin/sh

echo "Starting build process..."

# Run lint and build
npm run lint && npm run build

# Start the application
exec node .next/standalone/server.js
