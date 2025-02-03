# Docker Development Guide

This guide covers development-specific Docker workflows and best practices.

## Development Environment Setup

### Prerequisites

- Docker Engine 24.0.0 or later
- Docker Compose V2 or later
- Git
- Your favorite code editor (VS Code recommended)

### Initial Setup

1. Clone and setup:

```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
cp .env.example .env.local
```

2. Start development environment:

```bash
docker compose -f docker-compose.dev.yml up -d
```

### Development Workflow

#### Hot Reload

The development environment is configured for hot reload:

- Next.js changes are automatically detected
- Changes to server-side code trigger automatic rebuilds
- Database changes are reflected immediately

#### Running Tests

```bash
# Run all tests
docker compose -f docker-compose.test.yml up --abort-on-container-exit

# Run specific test file
docker compose exec app npm test -- path/to/test
```

#### Database Development

1. Access PostgreSQL CLI:

```bash
docker compose exec db psql -U postgres tgeld
```

2. Run migrations:

```bash
docker compose exec app npm run migrate
```

3. Reset database:

```bash
docker compose down -v
docker compose -f docker-compose.dev.yml up -d
```

### Debugging

#### VS Code Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Node",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

#### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db
```

### Common Development Tasks

#### Installing New Dependencies

1. Add to package.json
2. Rebuild container:

```bash
docker compose -f docker-compose.dev.yml build app
docker compose -f docker-compose.dev.yml up -d
```

#### Database Schema Changes

1. Create migration:

```bash
docker compose exec app npm run migrate:create
```

2. Apply migration:

```bash
docker compose exec app npm run migrate:up
```

3. Rollback migration:

```bash
docker compose exec app npm run migrate:down
```

### Best Practices

1. **Environment Variables**

   - Never commit `.env.local`
   - Keep `.env.example` updated
   - Use development-specific values in `.env.development`

2. **Volume Management**

   - Use named volumes for persistence
   - Clean up unused volumes regularly
   - Back up important data

3. **Performance**

   - Use volume mounts for development
   - Keep image sizes small
   - Use multi-stage builds

4. **Security**
   - Never commit sensitive data
   - Use secrets management
   - Keep dependencies updated

### Troubleshooting Development Issues

1. **Container Won't Start**

   - Check logs: `docker compose logs app`
   - Verify port availability
   - Check environment variables

2. **Hot Reload Not Working**

   - Verify volume mounts
   - Check file permissions
   - Restart containers

3. **Database Connection Issues**
   - Check network connectivity
   - Verify credentials
   - Ensure database is initialized

### Cleanup

```bash
# Remove containers keeping volumes
docker compose down

# Remove everything including volumes
docker compose down -v

# Remove unused images
docker image prune

# Remove all unused Docker resources
docker system prune
```
