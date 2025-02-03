# Docker Setup Guide

## Prerequisites

- Docker Engine 24.0.0 or later
- Docker Compose V2 or later
- Git

## Quick Start

### Development Environment

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Start the development environment:

```bash
docker compose -f docker-compose.dev.yml up -d
```

The application will be available at `http://localhost:21971`

### Production Environment

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. Configure production environment:

```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

3. Start the production environment:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Database Configuration

### Using the Built-in Database

By default, the application uses a containerized PostgreSQL database. The data is persisted in a Docker volume.

### Using an External Database

To use an external database:

1. Update the following variables in your environment file:

```env
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name
```

2. Start the application without the database service:

```bash
docker compose -f docker-compose.prod.yml up -d app
```

## Development Workflow

### Hot Reload

The development environment supports hot reload. Changes to your source code will automatically trigger a rebuild.

### Running Tests

```bash
docker compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Database Management

#### Backup

```bash
docker compose exec db pg_dump -U postgres tgeld > backup.sql
```

#### Restore

```bash
docker compose exec -T db psql -U postgres tgeld < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**

   - Check if ports 21971 or 5432 are already in use
   - Modify the port mappings in docker-compose files if needed

2. **Database Connection Issues**

   - Verify database environment variables
   - Check network connectivity between containers
   - Ensure database initialization completed

3. **Volume Permissions**
   - Run `chmod -R 777 uploads/` if upload directory has permission issues

### Logs

View application logs:

```bash
docker compose logs -f app
```

View database logs:

```bash
docker compose logs -f db
```

## Maintenance

### Updating the Application

1. Pull the latest changes:

```bash
git pull origin main
```

2. Rebuild containers:

```bash
docker compose -f docker-compose.prod.yml build
```

3. Restart services:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Cleaning Up

Remove all containers and volumes:

```bash
docker compose down -v
```

Remove only containers, keeping data:

```bash
docker compose down
```
