# Taschengeld - Allowance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

## Quick Start

### Development (Local)

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb tgeld

# Set up environment
cp .env.example .env.local

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Start development server
npm run dev

# Access the application
open http://localhost:21971
```

### Production (Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Set up environment
cp .env.example .env

# Start the application
docker compose up -d

# Access the application
open http://localhost:21971
```

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
