# Port Configuration for Celebration Toggle Branch

## Current Port Assignments

- **Application**: Port **3002** (http://localhost:3002)
- **Database**: Port **5433** (PostgreSQL)

## Why Port 3002?

Ports 3000 and 3001 were already in use by other development environments on this machine. Port 3002 was the first available port in the 3000-3010 range.

## How to Access

1. **Application**: http://localhost:3002
2. **API Health Check**: http://localhost:3002/api/health
3. **Settings API**: http://localhost:3002/api/settings
4. **Global Settings Page**: http://localhost:3002/global-settings

## Docker Commands

```bash
# Start development environment
npm run dev:docker

# Restart (keeps data)
npm run dev:docker:restart

# Stop
npm run dev:docker:stop

# Clean restart (deletes data)
npm run dev:docker:clean
```

## Testing the Celebration Toggle

Run the test script:

```bash
./test-celebration.sh
```

Or manually test:

1. Open http://localhost:3002 in a browser
2. Navigate to Global Settings
3. Find the "Experience" section
4. Toggle "Task Completion Celebration" on/off
5. Complete tasks to verify celebration behavior

## Configuration File

The port is configured in `docker-compose.dev.yml`:

```yaml
services:
  app:
    ports:
      - '3002:3000' # External:Internal
```

To change the port, edit this file and restart Docker.
