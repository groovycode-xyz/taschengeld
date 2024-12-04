# Installation Guide

This guide provides detailed installation instructions for Taschengeld in various environments.

## Table of Contents
- [Docker Installation](#docker-installation)
- [Manual Installation](#manual-installation)
- [Production Setup](#production-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)

## Docker Installation

### Prerequisites
- Docker Engine 24.0.0+
- Docker Compose V2+
- Git
- 2GB RAM minimum
- 10GB disk space

### Development Environment

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. **Configure Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:
```env
# Database Configuration
DB_HOST=tgeld-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=tgeld

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:21971
JWT_SECRET=your_secure_jwt_secret

# Optional Features
ENABLE_FILE_UPLOAD=true
MAX_UPLOAD_SIZE=5242880
```

3. **Start Services**
```bash
docker compose -f docker-compose.dev.yml up -d
```

4. **Initialize Database**
```bash
docker compose exec app npm run db:migrate
docker compose exec app npm run db:seed
```

### Production Environment

1. **Configure Production Environment**
```bash
cp .env.example .env
```

Edit `.env` with production settings:
```env
NODE_ENV=production
# ... (other settings as above, with secure production values)
```

2. **Start Production Services**
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Manual Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local as needed
```

3. **Initialize Database**
```bash
npm run db:migrate
npm run db:seed
```

4. **Build and Start**
```bash
npm run build
npm start
```

## Database Setup

### Built-in PostgreSQL (Docker)
- Automatically configured with Docker Compose
- Data persisted in Docker volume
- Accessible on port 5432

### External Database
1. Create database:
```sql
CREATE DATABASE tgeld;
```

2. Configure connection:
```env
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=tgeld
```

## Environment Configuration

### Required Variables
- `DB_*`: Database connection settings
- `JWT_SECRET`: Authentication secret
- `NODE_ENV`: Application environment

### Optional Variables
- `ENABLE_FILE_UPLOAD`: Enable/disable file uploads
- `MAX_UPLOAD_SIZE`: Maximum upload file size
- `LOG_LEVEL`: Logging detail level

### Environment Files
- `.env.local`: Development settings
- `.env`: Production settings
- `.env.test`: Testing settings

## Post-Installation

1. **Verify Installation**
```bash
# Check application status
curl http://localhost:21971/api/health

# Check database connection
npm run db:check
```

2. **Create Admin User**
```bash
npm run create-admin
```

3. **Security Checklist**
- [ ] Change default admin password
- [ ] Configure secure JWT secret
- [ ] Set up SSL/TLS
- [ ] Configure backup system

## Troubleshooting

See [Troubleshooting Guide](../5-maintenance/troubleshooting.md) for common issues and solutions.

## Next Steps

1. [Configuration Guide](configuration.md)
2. [Deployment Guide](deployment.md)
3. [Security Guide](../2-architecture/security.md)

Last Updated: December 4, 2024 