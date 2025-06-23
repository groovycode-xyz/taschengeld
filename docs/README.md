# Taschengeld Documentation

The main documentation for Taschengeld has been moved to our [GitHub Wiki](https://github.com/groovycode-xyz/taschengeld/wiki).

## Documentation Structure

Our documentation is organized into these main sections:

- [Getting Started](https://github.com/groovycode-xyz/taschengeld/wiki/Getting-Started)
- [Architecture](https://github.com/groovycode-xyz/taschengeld/wiki/Architecture)
- [Development](https://github.com/groovycode-xyz/taschengeld/wiki/Development)
- [Features](https://github.com/groovycode-xyz/taschengeld/wiki/Features)
- [Maintenance](https://github.com/groovycode-xyz/taschengeld/wiki/Maintenance)

## Recent Architecture Updates

We've recently updated our architecture to use a single-container approach that includes:

- Next.js application server
- PostgreSQL database
- Prisma ORM

For detailed information about these changes, please see:

- [Container Architecture](https://github.com/groovycode-xyz/taschengeld/wiki/Architecture#container-architecture)
- [Development Setup](https://github.com/groovycode-xyz/taschengeld/wiki/Development#development-environment)
- [Production Deployment](https://github.com/groovycode-xyz/taschengeld/wiki/Deployment)

## Archived Documentation

The original documentation has been archived in the [99-archived](99-archived) directory for historical reference.

Please visit our [GitHub Wiki](https://github.com/groovycode-xyz/taschengeld/wiki) for the current documentation.

## Quick Links

- [Getting Started](1-getting-started/quick-start.md)

  - Development setup with Docker
  - Production deployment
  - Environment configuration

- [Architecture](2-architecture/overview.md)

  - Single-container design
  - Next.js and PostgreSQL integration
  - Data persistence and backups

- [Development](3-development/setup.md)

  - Docker development environment
  - Hot reloading setup
  - Database management
  - Testing and debugging

- [Features](4-features/task-management.md)

  - Task management
  - User profiles
  - Payment tracking
  - Sound effects

- [Maintenance](5-maintenance/backup-restore.md)
  - Database backups
  - Container management
  - Troubleshooting
  - Updates and migrations

## Container Architecture

Taschengeld uses a single-container approach that includes:

- Next.js application server
- PostgreSQL database
- Prisma ORM
- Development tools (in dev environment)

### Development Container

- Hot reloading enabled
- Source code mounted
- Development dependencies included
- PostgreSQL in same container

### Production Container

- Optimized build
- Minimal dependencies
- Production-ready PostgreSQL
- Health monitoring

## Environment Configuration

The application supports multiple environment configurations:

- Development: `docker-compose.dev.yml`
- Production: `docker-compose.yml`

Use the `switch-mode.sh` script to switch between environments:

```bash
./switch-mode.sh [local|docker]
```

## Need Help?

If you need help, please:

1. Check the relevant documentation section
2. Look for troubleshooting guides
3. Create an issue on GitHub

## Contributing

See our [Contributing Guide](3-development/contributing.md) for details on how to contribute to the documentation.
