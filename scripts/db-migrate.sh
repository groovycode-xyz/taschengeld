#!/bin/bash

# Function to wait for database to be ready
wait_for_db() {
    echo "Waiting for database to be ready..."
    while ! pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" > /dev/null 2>&1; do
        echo "Database is not ready - sleeping"
        sleep 1
    done
    echo "Database is ready!"
}

# Main migration logic
main() {
    wait_for_db

    echo "Running database migrations..."
    
    # Generate the migration if it doesn't exist
    npx prisma generate
    
    # Apply migrations
    npx prisma migrate deploy

    # Seed the database if SEED_DATABASE is set to true
    if [ "${SEED_DATABASE}" = "true" ]; then
        echo "Seeding database..."
        npx prisma db seed
    fi

    echo "Database migration completed successfully!"
}

main
