# Production Deployment Guide

This guide covers deploying Taschengeld in a production environment using Docker.

## Prerequisites

- Docker Engine 24.0.0 or later
- Docker Compose V2 or later
- SSL certificate (recommended)
- Domain name (recommended)

## Deployment Steps

### 1. Initial Server Setup

1. Install Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. Install Docker Compose:

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 2. Application Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tgeld.git
cd tgeld
```

2. Configure environment:

```bash
cp .env.example .env.production
```

Edit `.env.production` with your production values:

```env
NODE_ENV=production
NEXT_PUBLIC_PORT=21971

# Database - Update these for your setup
DB_USER=postgres
DB_PASSWORD=your_secure_production_password
DB_DATABASE=tgeld
DB_HOST=db  # or your external database host
DB_PORT=5432

# Storage
UPLOAD_PATH=/data/uploads

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_BACKUP=true
```

### 3. Database Options

#### Option A: Using Containerized Database

1. Start all services:

```bash
docker compose -f docker-compose.prod.yml up -d
```

2. Initialize database:

```bash
docker compose exec app npm run migrate
```

#### Option B: Using External Database

1. Update `.env.production` with external database details
2. Start application without database service:

```bash
docker compose -f docker-compose.prod.yml up -d app
```

### 4. SSL/TLS Configuration

1. Using Nginx Proxy:

```bash
# Install nginx
sudo apt-get install nginx

# Configure nginx
sudo nano /etc/nginx/sites-available/tgeld
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:21971;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/tgeld /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Backup Configuration

1. Create backup script:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker compose exec -T db pg_dump -U postgres tgeld > "$BACKUP_DIR/db_$DATE.sql"

# Files backup
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" uploads/

# Cleanup old backups (keep last 7 days)
find "$BACKUP_DIR" -type f -mtime +7 -delete
```

2. Set up cron job:

```bash
0 0 * * * /path/to/backup.sh
```

### 6. Monitoring

1. Basic monitoring with Docker:

```bash
# View logs
docker compose logs -f

# Monitor resources
docker stats
```

2. Advanced monitoring (recommended):

- Set up Prometheus and Grafana
- Configure alerting
- Monitor system resources

### 7. Maintenance

#### Updates

1. Pull latest changes:

```bash
git pull origin main
```

2. Rebuild and restart:

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

#### Database Maintenance

1. Backup before maintenance:

```bash
docker compose exec db pg_dump -U postgres tgeld > backup.sql
```

2. Perform maintenance:

```bash
docker compose exec db psql -U postgres tgeld
```

### 8. Security Considerations

1. **Firewall Configuration**

```bash
# Allow only necessary ports
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

2. **Docker Security**

- Use non-root user in containers
- Implement resource limits
- Regular security updates
- Scan images for vulnerabilities

3. **Application Security**

- Keep dependencies updated
- Implement rate limiting
- Use secure headers
- Monitor for suspicious activity

### 9. Troubleshooting

1. **Container Issues**

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f app
```

2. **Database Issues**

```bash
# Check database logs
docker compose logs db

# Verify connectivity
docker compose exec app npm run db:check
```

3. **Performance Issues**

- Monitor resource usage
- Check application logs
- Review database queries
- Analyze network traffic

### 10. Rollback Procedure

1. Stop services:

```bash
docker compose down
```

2. Restore from backup:

```bash
# Restore database
docker compose exec -T db psql -U postgres tgeld < backup.sql

# Restore files
tar -xzf uploads_backup.tar.gz
```

3. Start previous version:

```bash
git checkout <previous-version>
docker compose -f docker-compose.prod.yml up -d
```
