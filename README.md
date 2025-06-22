# 💰 Taschengeld - Family Allowance Tracker

Taschengeld is a family allowance tracker application that runs on your own computer or home server using Docker. Your family's data stays private and secure in your home.

**Taschengeld** is the German word for "pocket money" and was developed for a family in Switzerland. The app also uses "Sparkässeli" which means "Piggy-Bank".

## 🚀 Quick Start

```bash
# Simple installation
mkdir taschengeld && cd taschengeld
curl -o docker-compose.yml https://raw.githubusercontent.com/barneephife/taschengeld/main/docker-compose.prod.yml
curl -o .env.example https://raw.githubusercontent.com/barneephife/taschengeld/main/.env.example.prod
cp .env.example .env
# Edit .env with your database password
docker compose up -d
```

**Access your application**: http://localhost:3000

📖 **[Complete Installation Guide](INSTALLATION.md)**

## ✨ Features

- 👨‍👩‍👧‍👦 **Family Management**: Multiple family member profiles
- ✅ **Task Management**: Define tasks with values and completion tracking  
- 💰 **Piggy Bank**: Virtual accounts with transaction history
- 🎯 **Payday System**: Bulk approval/rejection of completed tasks
- 📱 **Kiosk Interface**: PIN-protected parent mode and simplified child mode
- 🏠 **Privacy First**: All data stays on your computer/server

## 🐳 Docker Images

**Multi-Architecture Support:**
- `docker pull tgeld/taschengeld:latest` (AMD64 + ARM64)
- `docker pull tgeld/taschengeld:v1.0.5` (Specific version)
- `docker pull tgeld/taschengeld:stable` (Latest stable release)

**Supported Platforms:**
- ✅ Intel/AMD processors (linux/amd64)
- ✅ Apple Silicon (linux/arm64)  
- ✅ ARM devices (linux/arm64)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL 16 with Prisma ORM
- **Deployment**: Docker (multi-architecture support)
- **State Management**: React Context API

## Features

- 👥 **User Management**

  - Create accounts for family members
  - User profiles and preferences
  - Access control

- 📋 **Task Management**

  - Create and manage tasks
  - Set task values and descriptions
  - Track task completion

- 💵 **Payout System**

  - Review completed tasks and allocate payment to accounts
  - Bulk transaction processing

- 💰 **Piggy-Bank Account System**

  - Track account balances and transaction history
  - Manually credit and debit accounts

- 🖥️ **Optimized for Desktop & Tablets**
  - Minimum viewport of 768px (tablets and larger)
  - Responsive sidebar that collapses on tablets
  - Enhanced hover effects and tooltips on desktop
  - Touch-optimized with 48px minimum touch targets
  - Not designed for mobile phones

## Device Compatibility

Taschengeld is optimized for desktop/laptop computers and tablets:

- **Minimum screen width**: 768px (iPad portrait and larger)
- **Recommended devices**: Desktop/laptop computers, iPads, Android tablets
- **Not supported**: Mobile phones (screens smaller than 768px)

### Desktop Features (1024px+)

- Full sidebar navigation always visible
- Rich hover effects with tooltips
- Keyboard navigation optimized
- Enhanced visual feedback on interactions

### Tablet Features (768-1023px)

- Collapsible sidebar with hamburger menu
- Larger touch targets (48px minimum)
- Touch-optimized interactions
- 2-column layouts for better space usage

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- 1GB free RAM
- 2GB free disk space

The application is available as a multi-architecture Docker image supporting both ARM64 (e.g., Apple Silicon) and AMD64 (Intel/AMD) platforms. Docker will automatically select the correct version for your system.

## Quick Start Guide

1. Create a new directory for Taschengeld:

   ```bash
   mkdir tgeld && cd tgeld
   mkdir -p ./data/postgres
   ```

2. Create `.env` file:

   ```bash
   # Copy this template and save as .env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password  # Change this!
   POSTGRES_DB=tgeld
   DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/tgeld?schema=public
   POSTGRES_DATA_DIR=./data/postgres
   ```

   ⚠️ Replace `your_secure_password` with your chosen password in BOTH places
   ⚠️ Password Requirements:

   - Use only alphanumeric characters (a-z, A-Z, 0-9)
   - Avoid special characters (!@#$%^&\*) as they may cause issues with the PostgreSQL connection string
   - Example of a good password: TGeld2025DB

3. Create `docker-compose.yml`:

   ```yaml
   services:
     app:
       image: tgeld/tgeld:latest
       ports:
         - '8071:3000' # Change 8071 if needed
       environment:
         - DATABASE_URL=${DATABASE_URL}
       depends_on:
         - db
     db:
       image: postgres:16-alpine
       environment:
         - POSTGRES_USER=${POSTGRES_USER}
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
         - POSTGRES_DB=${POSTGRES_DB}
       volumes:
         - ${POSTGRES_DATA_DIR}:/var/lib/postgresql/data
   ```

4. Start the application:

   ```bash
   docker compose up -d
   ```

5. Access the application at `http://localhost:8071` (or your configured port)

## Directory Structure

After setup, your directory should look like this:

```
tgeld/
├── data/
│   └── postgres/          # Database files (created by PostgreSQL)
│       └── [db files]     # Various PostgreSQL data files
├── .env                   # Environment configuration
└── docker-compose.yml     # Docker configuration

Additional files created during use:
├── backup.sql            # Database backup (if created)
└── logs/                 # Log files (if enabled)
```

⚠️ Important Notes:

- Never delete the `data/postgres` directory while the application is running
- Always back up your data before major updates

## ⚠️ DATABASE DATA PERSISTENCE - CRITICAL

### Keeping Your Data Safe

Your family's data is stored in Docker volumes. To avoid accidental data loss:

**SAFE Commands (preserve data):**

```bash
# Stop containers (data preserved)
docker compose down

# Restart containers (data preserved)
docker compose down
docker compose up -d

# Update to new version (data preserved)
docker compose pull
docker compose up -d
```

**DANGEROUS Commands (will DELETE all data):**

```bash
# ⚠️ NEVER use these unless you want to start fresh:
docker compose down -v  # The -v flag DELETES volumes/data!
docker volume rm tgeld_postgres_data  # Directly removes data!
```

### Best Practices

1. **Regular Backups**: Use the built-in backup feature in Settings → Backup & Restore
2. **Before Updates**: Always create a backup before updating the application
3. **Development**: If you're a developer, use separate volume names for dev/prod

### Data Recovery

If you accidentally deleted your data:

1. Stop immediately - don't run any more commands
2. Check if you have a recent backup file (`backup.sql`)
3. If yes, you can restore it through Settings → Backup & Restore

- Always backup both `.env` and `data/postgres` directory
- The `logs` directory is created automatically if logging is enabled

## Important Configuration Notes

### Port Configuration

- Default port is 8071
- To use a different port, change the first number in `docker-compose.yml`:
  ```yaml
  ports:
    - '8072:3000' # Changed from 8071 to 8072
  ```

### Data Storage

- Database files are stored in `./data/postgres` by default
- Change `POSTGRES_DATA_DIR` in `.env` to use a different location
- Ensure the directory exists before starting
- Include this directory in your backup strategy

### Security

- Always change the default password in `.env`
- Use a strong password (12+ characters, mixed case, numbers, symbols)
- Keep your `.env` file secure and never share it
- Back up your `.env` file - you need it to restore the application

## Maintenance

### Backup Database

Option 1: Command Line

```bash
docker compose exec db pg_dump -U postgres tgeld > backup.sql
```

Option 2: Web Interface

1. Click Global App Settings (top right)
2. Go to Backup and Restore
3. Click "Download" under Full Database Backup

### Restore Database

Option 1: Command Line

```bash
cat backup.sql | docker compose exec -T db psql -U postgres -d tgeld
```

Option 2: Web Interface

1. Click Global App Settings (top right)
2. Go to Backup and Restore
3. Click "Upload" under Full Database Backup

### Update Application

```bash
# Stop application
docker compose down

# Get latest version
docker compose pull

# Start updated application
docker compose up -d
```

### Free Up Disk Space

Remove old, unused Docker images:

```bash
docker image prune -f
```

## Troubleshooting

### Application Won't Start

1. Check if containers are running:

   ```bash
   docker compose ps
   ```

2. Check logs:

   ```bash
   docker compose logs
   ```

3. Verify port availability:
   ```bash
   # On Linux/Mac
   lsof -i :8071
   # On Windows
   netstat -ano | findstr :8071
   ```

### Database Connection Issues

1. Verify environment variables:

   ```bash
   docker compose config
   ```

2. Check database logs:
   ```bash
   docker compose logs db
   ```

### Need More Help?

- Check our [GitHub Issues](https://github.com/barneephife/tgeld/issues)
- Submit a new issue if you can't find a solution

## For Developers

If you're a developer wanting to contribute or modify the application, please see [README_DEV.md](README_DEV.md).

## License

MIT License - See LICENSE file for details
