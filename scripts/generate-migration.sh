#!/bin/sh

# This script generates the initial migration for the database schema
# It should be run once to create the migration files that will be included in the repository

set -e

# Ensure the script is run from the project root
cd "$(dirname "$0")/.."

# Start a clean database
docker-compose down -v
docker-compose up db -d

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Build and run the migration container
echo "Building migration container..."
docker build -f Dockerfile.migration -t tgeld-migration .

echo "Running migration..."
docker run --rm \
  --network tgeld_default \
  -e DATABASE_URL=postgresql://postgres:tgeld_secure_password_2024@db:5432/tgeld \
  -v $(pwd)/prisma:/app/prisma \
  tgeld-migration

# Clean up
docker-compose down -v

echo "Migration generated successfully!"
