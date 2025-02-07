# Taschengeld - Allowance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

## Development Environments

This project supports two development environments, both using Docker with a single-container approach that includes Next.js, PostgreSQL, and Prisma:

### 1. Development Environment

Uses Docker for development with hot reloading:

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Start development environment
docker compose -f docker-compose.dev.yml up

# Access the application
open http://localhost:21971
```

The development environment includes:
- Next.js in development mode with hot reloading
- PostgreSQL database in the same container
- Source code mounted for live updates
- Development tools and dependencies

### 2. Production Environment

Uses Docker for production deployment:

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Set up environment
cp .env.example .env
# Edit .env and set a secure password

# Start production environment
docker compose up -d

# Access the application
open http://localhost:21971
```

The production environment includes:
- Optimized Next.js build
- PostgreSQL database in the same container
- Production-ready configuration
- Health monitoring

## Environment Setup

The application uses different environment files for different purposes:

- `.env.example` - Template file, copy to create other env files
- `.env` - Production environment configuration
- `.env.docker` - Production Docker configuration
- `.env.local` - Local development configuration (if needed)

### Environment Switching

Use the provided script to switch between environments:

```bash
# Switch to development mode
./switch-mode.sh local

# Switch to production mode
./switch-mode.sh docker
```

### Database Configuration

The database runs in the same container as the application. Configuration includes:

- PostgreSQL 17.2
- Automatic database initialization
- Persistent data storage
- Health checks

### Security Notes

1. Database Password:
   - Set a secure password in your `.env` file
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and special characters
   - Avoid characters that need URL escaping

2. Port Exposure:
   - Next.js: 21971 (required)
   - PostgreSQL: 5432 (optional, can be disabled)

## Documentation

📚 [View Full Documentation](docs/README.md)

### Key Documentation Sections

- 🚀 [Getting Started Guide](docs/1-getting-started/quick-start.md)
- 🏗️ [Architecture Overview](docs/2-architecture/overview.md)
- 💻 [Development Guide](docs/3-development/setup.md)
- ✨ [Feature Documentation](docs/4-features/task-management.md)
- 🛠️ [Maintenance Guide](docs/5-maintenance/backup-restore.md)

## Features

- 📋 Task Management

  - Create and manage tasks
  - Set task values and requirements
  - Track task completion

- 👥 User Management

  - Parent and child accounts
  - User profiles and preferences
  - Access control

- 💰 Payment System
  - Track allowances and payments
  - Manage task rewards
  - Payment history

## Development

### Prerequisites

For local development:

- Node.js 20 or later
- PostgreSQL 16 or later
- npm 10 or later

For production:

- Docker Engine 24.0.0 or later
- Docker Compose V2 or later

### Deployment Options

1. **Development (Recommended)**

   - Local setup without Docker
   - Direct PostgreSQL connection
   - Fastest feedback loop
   - Best for development

2. **Production**
   - Docker Compose deployment
   - Includes both application and database
   - Optional backup service
   - Production-ready configuration

### Database Options

The default docker-compose configuration includes PostgreSQL. For detailed information about database configuration options and backup strategies, see our [Database Management](docs/3-development/database-management.md) and [Backup and Restore](docs/5-maintenance/backup-restore.md) documentation.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/3-development/contributing.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Need help? Check out our:

- [Documentation](docs/README.md)
- [Troubleshooting Guide](docs/5-maintenance/troubleshooting.md)
- [GitHub Issues](https://github.com/yourusername/tgeld/issues)

For detailed documentation, please refer to the `docs` directory:

- Getting Started: `docs/1-getting-started/`
- Architecture: `docs/2-architecture/`
- Development: `docs/3-development/`
  - [Database Management](docs/3-development/database-management.md)
- Features: `docs/4-features/`
- Maintenance: `docs/5-maintenance/`
