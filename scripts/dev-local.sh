#!/bin/bash

# Local Development Helper Script
# Ensures local database is running before starting npm run dev

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Taschengeld Local Development${NC}"

# Fix .env.local if it has wrong database connection
if [[ -f .env.local ]] && grep -q "postgres123@localhost:5432" .env.local; then
    echo -e "${YELLOW}🔧 Fixing .env.local database connection...${NC}"
    sed -i '' 's/postgres:postgres123@localhost:5432/postgres:TGeld2025DB@localhost:5433/g' .env.local
fi

# Check if local database is running
if ! docker ps | grep -q tgeld-db-local; then
    echo -e "${YELLOW}📦 Starting local PostgreSQL database...${NC}"
    
    # Stop Docker development environment if running (it uses same port)
    if docker ps | grep -q taschengeld-db-1; then
        echo -e "${YELLOW}⏹️  Stopping Docker development environment (port conflict)...${NC}"
        docker compose -f docker-compose.dev.yml down >/dev/null 2>&1
    fi
    
    # Remove existing container if it exists but is stopped
    if docker ps -a | grep -q tgeld-db-local; then
        docker rm -f tgeld-db-local >/dev/null 2>&1
    fi
    
    # Start fresh database container
    docker run -d \
        --name tgeld-db-local \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=TGeld2025DB \
        -e POSTGRES_DB=tgeld \
        -p 5433:5432 \
        postgres:16-alpine
    
    echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
    sleep 5
    
    # Wait for database to be ready
    for i in {1..30}; do
        if docker exec tgeld-db-local pg_isready -U postgres -d tgeld >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Database is ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
else
    echo -e "${GREEN}✅ Local database is already running${NC}"
fi

# Run Prisma migrations to ensure schema is up to date
echo -e "${YELLOW}🔧 Applying database migrations...${NC}"
npx prisma migrate deploy

# Kill any existing processes on port 3300
if lsof -i :3300 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3300 is in use. Killing existing processes...${NC}"
    lsof -ti :3300 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo -e "${GREEN}🎯 Starting Next.js development server on port 3300...${NC}"
echo -e "${GREEN}🌐 Access the app at: http://localhost:3300${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop${NC}"
echo ""

# Start the development server
npm run dev