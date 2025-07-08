#!/bin/sh
set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment variables
validate_env() {
    required_vars="DB_USER DB_PASSWORD DB_HOST DB_PORT DB_DATABASE"
    for var in $required_vars; do
        if [ -z "$(eval echo \$$var)" ]; then
            echo "Error: Required environment variable $var is not set"
            exit 1
        fi
    done
}

# Function to validate database connection string
validate_db_url() {
    if [ -z "${DATABASE_URL}" ]; then
        echo "Constructing DATABASE_URL from environment variables..."
        export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"
    fi

    # Validate DATABASE_URL format
    if ! echo "$DATABASE_URL" | grep -qE "^postgresql://[^:]+:[^@]+@[^:]+:[0-9]+/[^?]+(\?.*)?$"; then
        echo "Error: Invalid DATABASE_URL format"
        exit 1
    fi
}

# Function to wait for database with improved retry logic
wait_for_db() {
    echo "Waiting for database to be ready..."
    max_retries=30
    retry_interval=2
    retries=0

    while [ $retries -lt $max_retries ]; do
        if pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" >/dev/null 2>&1; then
            echo "Database is ready!"
            return 0
        fi

        retries=$((retries + 1))
        remaining=$((max_retries - retries))
        echo "Waiting for database... (Attempt $retries/$max_retries, $remaining attempts remaining)"
        sleep $retry_interval
    done

    echo "Error: Database connection timeout after $((max_retries * retry_interval)) seconds"
    exit 1
}

# Function to verify application health with improved error handling
verify_app_health() {
    echo "Verifying application health..."
    max_retries=30
    retry_interval=2
    retries=0

    while [ $retries -lt $max_retries ]; do
        if curl -s -f "http://localhost:${PORT:-3000}/api/health" >/dev/null 2>&1; then
            echo "Application is healthy!"
            return 0
        fi

        retries=$((retries + 1))
        remaining=$((max_retries - retries))
        echo "Waiting for application to be healthy... (Attempt $retries/$max_retries, $remaining attempts remaining)"
        sleep $retry_interval
    done

    echo "Error: Application health check failed after $((max_retries * retry_interval)) seconds"
    exit 1
}

# Function to generate Prisma client at runtime
generate_prisma_client() {
    echo "Generating Prisma client..."
    if ! npx prisma generate 2>&1 | tee /tmp/prisma_generate.log; then
        echo "Warning: Prisma client generation failed. Error details:"
        cat /tmp/prisma_generate.log
        echo "This may cause issues with database operations."
        # Continue anyway as the client might already exist
    else
        echo "Prisma client generated successfully!"
    fi
}

# Function to handle Prisma migrations with intelligent fallback
run_migrations() {
    echo "Running database migrations..."
    max_retries=3
    retries=0

    # Enable Prisma query and debug logging
    export DEBUG="prisma:*,prisma-client:*"
    export PRISMA_CLIENT_ENGINE_TYPE="binary"
    export PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

    # Print environment information
    echo "Environment Info:"
    echo "NODE_ENV: $NODE_ENV"
    echo "DATABASE_URL: ${DATABASE_URL//:*@/:***@}"  # Mask password
    echo "Platform: $(uname -a)"
    echo "OpenSSL version: $(openssl version)"
    echo "Prisma binary platform: $(ls -la /app/node_modules/.prisma/client/ 2>/dev/null | head -10)"

    # Check if migration files exist (excluding lock file)
    if [ -z "$(ls -A /app/prisma/migrations 2>/dev/null | grep -v migration_lock.toml)" ]; then
        echo "No migration files found, using schema push approach..."
        
        # Try prisma db push as fallback when no migrations exist
        if npx prisma db push --skip-generate 2>&1 | tee /tmp/schema_push.log; then
            echo "Schema push completed successfully!"
            return 0
        else
            echo "Error: Schema push failed"
            cat /tmp/schema_push.log
            exit 1
        fi
    fi

    # Migration files exist, try standard migration deployment
    while [ $retries -lt $max_retries ]; do
        echo "Attempting migration deployment (attempt $((retries + 1))/$max_retries)..."
        
        # Run migration without deprecated --preview-feature flag
        if npx prisma migrate deploy 2>&1 | tee /tmp/migration.log; then
            echo "Migrations completed successfully!"
            return 0
        fi

        # Log the error details
        echo "Migration attempt failed. Error details:"
        cat /tmp/migration.log
        
        # Check for specific error conditions and provide helpful diagnostics
        if grep -q "ENOENT\|binary.*not found\|spawn.*ENOENT" /tmp/migration.log; then
            echo "Error: Binary not found - checking Prisma installation:"
            ls -la /app/node_modules/.prisma/client 2>/dev/null || echo "Prisma client directory not found"
            echo "Node modules prisma:"
            ls -la /app/node_modules/prisma 2>/dev/null || echo "Prisma CLI not found"
        fi
        
        if grep -q "SSL\|TLS\|certificate" /tmp/migration.log; then
            echo "Error: SSL/TLS-related error detected"
            echo "OpenSSL configuration:"
            openssl version -a 2>/dev/null || echo "OpenSSL version check failed"
        fi

        if grep -q "Connection refused\|timeout\|unreachable" /tmp/migration.log; then
            echo "Error: Database connection issue detected"
            echo "Checking database connectivity:"
            pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" || echo "Database not ready"
        fi

        retries=$((retries + 1))
        if [ $retries -lt $max_retries ]; then
            echo "Waiting before retry..."
            sleep 5
        fi
    done

    # If migration deploy failed, try db push as final fallback
    echo "Migration deployment failed, trying schema push as fallback..."
    if npx prisma db push --skip-generate 2>&1 | tee /tmp/fallback_push.log; then
        echo "Fallback schema push completed successfully!"
        return 0
    fi

    # Both approaches failed
    echo "Error: Both migration deployment and schema push failed"
    echo "Migration log:"
    cat /tmp/migration.log 2>/dev/null
    echo "Schema push log:"
    cat /tmp/fallback_push.log 2>/dev/null
    echo "System diagnostics:"
    echo "Directory contents:"
    ls -la /app/node_modules/.prisma/client 2>/dev/null || echo "Prisma client not found"
    echo "System information:"
    uname -a
    exit 1
}

# Function to initialize application data with error handling
initialize_app_data() {
    echo "Checking and initializing default data..."
    if ! node /app/scripts/initialize-data.js; then
        echo "Warning: Default data initialization failed"
        # Don't exit, as this is not critical
        return 1
    fi
    echo "Default data initialization completed!"
    return 0
}

# Verify required commands
for cmd in curl pg_isready npx node; do
    if ! command_exists $cmd; then
        echo "Error: Required command '$cmd' is not available"
        exit 1
    fi
done

# Check if we're running a utility command (not the server)
# This allows commands like "node --version" or "ls" to run without database config
if [ "$#" -gt 0 ] && [ "$1" != "node" ] || ([ "$1" = "node" ] && [ "$2" != "server.js" ]); then
    echo "Running utility command: $@"
    exec "$@"
fi

# Only validate environment and run database setup for server startup
validate_env
validate_db_url

# Wait for database
wait_for_db

# Generate Prisma client at runtime
generate_prisma_client

# Run migrations with retry logic
run_migrations

# Initialize application data
initialize_app_data

# Start the application
echo "Starting the application..."
exec node server.js -H "${HOST:-0.0.0.0}"
