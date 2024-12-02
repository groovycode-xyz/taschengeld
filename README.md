# Taschengeld - Allowance Tracker

## Project Overview

Taschengeld is an allowance tracker application designed to help families manage chores, tasks, and allowances for children. It features a user-friendly interface for both parents and children to interact with.

[![PDF Preview](tg_ug_v2.jpg)](Taschengeld-User_Guide_v2.pdf)

## Quick Start

For detailed installation instructions, see [Installation Guide](docs/getting-started/INSTALLATION.md).

## Documentation

### Getting Started
- [Installation Guide](docs/getting-started/INSTALLATION.md)
- [Contributing Guidelines](docs/getting-started/CONTRIBUTING.md)

### Architecture
- [System Overview](docs/architecture/OVERVIEW.md)
- [Database Schema](docs/architecture/DATABASE.md)
- [API Documentation](docs/architecture/API.md)

### Design
- [Color System](docs/design/COLOR_SYSTEM.md)
- [Theme System](docs/design/THEMES.md)

### Development
- [Project Status](docs/development/PROJECT_STATUS.md)
- [Changelog](docs/CHANGELOG.md)

## Environment Configuration

The project uses different environment configurations for various stages:
- `.env.example` - Template with all possible variables
- `.env.development` - Development environment defaults
- `.env.test` - Test environment configuration
- `.env.production` - Production environment configuration

Copy the appropriate .env file for your environment:
```bash
# For development
cp .env.example .env.local
```

## License

[Include license information]