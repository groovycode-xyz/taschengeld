# 🏠 Taschengeld Installation Guide

Taschengeld is a family allowance tracker that runs completely on your own computer or home server using Docker. Your family's data stays private and secure in your home.

## 📋 Prerequisites

Before installing Taschengeld, ensure you have:

### Required Software

- **Docker Desktop** (includes Docker Compose)
  - Windows: [Download Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)
  - macOS: [Download Docker Desktop](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: [Install Docker Engine + Docker Compose](https://docs.docker.com/engine/install/)

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Ports**: 8071 (web interface) and 5432 (database) must be available

### Supported Platforms

- ✅ Windows 10/11 with WSL2
- ✅ macOS 10.15+ (Intel and Apple Silicon)
- ✅ Linux (any modern distribution)

## 🚀 Quick Installation

### Step 1: Create Project Directory

```bash
mkdir taschengeld
cd taschengeld
```

### Step 2: Download Configuration Files

```bash
# Download docker-compose.yml
curl -o docker-compose.yml https://raw.githubusercontent.com/groovycode-xyz/taschengeld/main/docker-compose.prod.yml

# Download environment template
curl -o .env.example https://raw.githubusercontent.com/groovycode-xyz/taschengeld/main/.env.example.prod
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your preferred text editor
# IMPORTANT: Set a strong DB_PASSWORD (letters and numbers only)
```

**Example .env file:**

```env
DB_USER=postgres
DB_PASSWORD=MySecurePassword123
DB_DATABASE=tgeld
```

### Step 4: Start Taschengeld

```bash
# Pull the latest images and start
docker compose pull
docker compose up -d

# Check status
docker compose ps
```

### Step 5: Access Your Application

Open your web browser and go to: **http://localhost:8071**

## 🔧 Management Commands

### Daily Operations

```bash
# Start Taschengeld
docker compose up -d

# Stop Taschengeld
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### Updates

```bash
# Update to latest version
docker compose pull
docker compose up -d
```

### Backup & Restore

```bash
# Backup database
docker compose exec db pg_dump -U postgres tgeld > backup.sql

# Restore database (stop app first)
docker compose down
docker compose up -d db
docker compose exec -T db psql -U postgres tgeld < backup.sql
docker compose up -d app
```

## 📁 Data Persistence

Your data is automatically saved in Docker volumes:

- **Database**: All your family's tasks, transactions, and settings
- **Uploads**: Photos and attachments
- **Application Data**: Logs and temporary files

### Volume Locations

- **Windows**: `\\wsl$\docker-desktop-data\data\docker\volumes\`
- **macOS**: `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/`
- **Linux**: `/var/lib/docker/volumes/`

**Data persists through:**

- ✅ Application restarts
- ✅ Computer reboots
- ✅ Docker updates
- ✅ Taschengeld version updates

## 🛠️ Troubleshooting

### Application Won't Start

```bash
# Check logs for errors
docker compose logs app

# Common issues:
# 1. Port 8071 already in use
# 2. Database password contains special characters
# 3. Insufficient system resources
```

### Database Issues

```bash
# Reset database (⚠️ DELETES ALL DATA)
docker compose down -v
docker compose up -d

# Check database status
docker compose exec db pg_isready -U postgres
```

### Port Conflicts

If port 8071 is already in use, modify your `.env` file:

```env
APP_PORT=8080
```

Then update docker-compose.yml ports section:

```yaml
ports:
  - '8080:3000'
```

## 🔒 Security Considerations

### Database Password

- Use a strong password with letters and numbers only
- Avoid special characters (Docker + PostgreSQL compatibility)
- Example: `MySecure123Password`

### Network Access

- By default, Taschengeld is only accessible from your local computer
- To allow family access from other devices on your network, bind to all interfaces:
  ```yaml
  ports:
    - '0.0.0.0:8071:3000'
  ```

### Data Privacy

- All data stays on your computer/server
- No external services or cloud storage
- Complete family privacy

## 📞 Support

- **Documentation**: https://taschengeld.groovycode.xyz
- **GitHub Issues**: https://github.com/groovycode-xyz/taschengeld/issues
- **Email Support**: support@groovycode.xyz

---

Made with ❤️ for families everywhere
