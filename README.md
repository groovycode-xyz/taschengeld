# Taschengeld - Allowance Tracker

## Project Overview

Taschengeld is an allowance tracker application designed to help families manage chores, tasks, and allowances for children. It features a user-friendly interface for both parents and children to interact with.

## Running with Docker

This application is containerized using Docker. Choose your environment below:

### Prerequisites
- Docker Engine 24.0.0 or later
- Docker Compose V2 or later

### Option 1: Development Environment
Use this if you're developing or contributing to the project.

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. Set up environment:
```bash
cp .env.example .env.local
# Edit .env.local with your development settings
```

3. Start the development environment:
```bash
docker compose -f docker-compose.dev.yml up -d
```

4. Access the application at `http://localhost:21971`

Development features:
- Hot reload: Changes to code automatically update in the browser
- Local database: PostgreSQL with persistent storage
- File uploads: Stored in local `uploads` directory

### Option 2: Production Environment
Use this for deploying the application.

1. Set up environment:
```bash
cp .env.example .env
# Edit .env with your production settings
```

2. Start the production environment:
```bash
docker compose up -d
```

## Database Options

### Default: Built-in Database
By default, the application uses a containerized PostgreSQL database with data automatically persisted in Docker volumes.

### Alternative: External Database
To use your own database server:

1. Update these variables in your `.env` file:
```env
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```

2. Start without the database container:
```bash
docker compose up -d app
```

## Configuration

All configuration is done through environment variables. Copy `.env.example` and modify as needed:
- `.env.local` for development
- `.env` for production

See `.env.example` for all available options.

## Additional Documentation

For more detailed information:
- [Installation Guide](docs/getting-started/INSTALLATION.md) - Manual installation without Docker
- [Contributing Guidelines](docs/getting-started/CONTRIBUTING.md)
- [API Documentation](docs/architecture/API.md)