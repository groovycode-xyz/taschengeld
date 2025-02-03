# Quick Start Guide

This guide will help you get Taschengeld up and running quickly using Docker.

## Prerequisites

- Docker Engine 24.0.0 or later
- Docker Compose V2 or later
- Git

## Quick Setup

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. **Set Up Environment**

```bash
# Copy example environment file
cp .env.example .env.local

# Required minimal configuration in .env.local:
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=tgeld
JWT_SECRET=your_secret_key
```

3. **Start the Application**

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up -d
```

4. **Access the Application**

- Open [http://localhost:21971](http://localhost:21971) in your browser
- Default admin credentials:
  - Username: `admin`
  - Password: `admin123`
  - **Important**: Change these credentials immediately after first login

## Verify Installation

1. **Check Services**

```bash
docker compose ps
```

You should see these services running:

- `tgeld-app` (Next.js application)
- `tgeld-db` (PostgreSQL database)

2. **Check Logs**

```bash
docker compose logs -f
```

## Next Steps

1. [Complete Installation Guide](installation.md) - For detailed setup options
2. [Configuration Guide](configuration.md) - For customizing your installation
3. [User Management](../4-features/user-management.md) - Set up users and permissions
4. [Task Management](../4-features/task-management.md) - Start creating tasks

## Common Issues

1. **Port Conflicts**

   - Error: `port 21971 already in use`
   - Solution: Change the port in `docker-compose.dev.yml`

2. **Database Connection**

   - Error: `connection refused`
   - Solution: Check database credentials in `.env.local`

3. **Permission Issues**
   - Error: `permission denied`
   - Solution: Check file permissions in mounted volumes

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](../5-maintenance/troubleshooting.md)
2. Review [Common Issues](#common-issues) above
3. Search or create an issue on [GitHub](https://github.com/yourusername/tgeld/issues)

Last Updated: December 4, 2024
