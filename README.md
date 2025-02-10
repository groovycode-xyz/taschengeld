# Tgeld Task Management System

A modern task management system built with Next.js, PostgreSQL, and Docker.

## Features

- Task creation and management
- Task completion tracking
- Payout value tracking
- Docker-based production deployment
- PostgreSQL database for data persistence

## Prerequisites

For Development:
- Node.js 18+ (for local development)
- PostgreSQL 16
- Git

For Production:
- Docker and Docker Compose
- Git

## Quick Start

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/barneephife/tgeld.git
   cd tgeld
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local PostgreSQL configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### Production Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/barneephife/tgeld.git
   cd tgeld
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your production configuration.

3. Start the application:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:3000`.

## Environment Configuration

### Development Environment

```bash
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tgeld?schema=public
```

### Production Environment

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_PORT=21971

# Database
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=tgeld

# Upload Configuration
UPLOAD_PATH=/app/uploads

# Prisma
DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/tgeld?schema=public
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Build Docker image:
   ```bash
   docker build -t tgeld/tgeld:latest -f Dockerfile.prod .
   ```

2. Push to Docker Hub:
   ```bash
   docker push tgeld/tgeld:latest
   ```

3. Deploy using docker-compose:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Database Management

### Development

Create a database backup:
```bash
pg_dump -U postgres tgeld > backup.sql
```

Restore from backup:
```bash
psql -U postgres -d tgeld < backup.sql
```

### Production

Create a database backup:
```bash
docker-compose exec db pg_dump -U postgres tgeld > backup.sql
```

Restore from backup:
```bash
cat backup.sql | docker-compose exec -T db psql -U postgres -d tgeld
```

## Updating the Application

### Development
1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Update dependencies:
   ```bash
   npm install
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Production
1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart:
   ```bash
   docker-compose down
   docker-compose pull
   docker-compose up -d
   ```

## API Documentation

### Tasks

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/active-tasks` - List active tasks

## Project Structure

```
tgeld/
├── app/                 # Next.js application
│   ├── api/            # API routes
│   ├── lib/            # Shared libraries
│   └── types/          # TypeScript types
├── components/         # React components
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── docker/            # Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details
