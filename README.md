# Taschengeld - Allowance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Set up environment
cp .env.example .env.local

# Start with Docker
docker compose -f docker-compose.dev.yml up -d

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
- Docker Engine 24.0.0 or later
- Docker Compose V2 or later
- Node.js 18+ (for local development)

### Environment Options

1. **Development Environment**
```bash
docker compose -f docker-compose.dev.yml up -d
```

2. **Production Environment**
```bash
docker compose up -d
```

### Database Options

- **Default**: Built-in PostgreSQL database
- **Alternative**: External database (configure in .env)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/3-development/contributing.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Need help? Check out our:
- [Documentation](docs/README.md)
- [Troubleshooting Guide](docs/5-maintenance/troubleshooting.md)
- [GitHub Issues](https://github.com/yourusername/tgeld/issues)