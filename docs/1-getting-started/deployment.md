# Deployment Guide

This guide covers deploying Taschengeld to production environments.

## Deployment Options

1. [Docker Deployment](#docker-deployment)
2. [Manual Deployment](#manual-deployment)
3. [Cloud Platforms](#cloud-platforms)

## Prerequisites

- Production server with:
  - 2GB RAM minimum
  - 20GB storage
  - Ubuntu 20.04 or newer
- Domain name (optional)
- SSL certificate (recommended)
- PostgreSQL database
- Node.js 18+ (for manual deployment)

## Docker Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Configure production environment
cp .env.example .env
```

Edit `.env` with production values:
```env
NODE_ENV=production
DB_PASSWORD=secure_password
JWT_SECRET=secure_jwt_secret
# ... other production settings
```

### 3. Start Application

```bash
# Pull and start containers
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose ps
```

### 4. Database Migration

```bash
# Run migrations
docker compose exec app npm run db:migrate

# Verify database
docker compose exec app npm run db:check
```

## Manual Deployment

### 1. Server Prerequisites

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

### 2. Application Setup

```bash
# Create application user
sudo useradd -m -s /bin/bash tgeld
sudo su - tgeld

# Clone and setup
git clone https://github.com/yourusername/tgeld.git
cd tgeld
npm install --production
```

### 3. Database Setup

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE tgeld;
CREATE USER tgeld WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tgeld TO tgeld;
```

### 4. Process Management

Create systemd service file `/etc/systemd/system/tgeld.service`:
```ini
[Unit]
Description=Taschengeld Application
After=network.target

[Service]
Type=simple
User=tgeld
WorkingDirectory=/home/tgeld/tgeld
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=21971

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl enable tgeld
sudo systemctl start tgeld
```

## Cloud Platforms

### Docker-based Platforms

1. **Setup**
   - Configure container registry
   - Set environment variables
   - Configure database connection

2. **Deployment**
```bash
# Build production image
docker build -t tgeld:prod .

# Push to registry
docker tag tgeld:prod registry.example.com/tgeld
docker push registry.example.com/tgeld
```

### Platform-specific Instructions

1. **AWS**
   - Use ECS or EKS for containers
   - RDS for database
   - Route 53 for DNS

2. **Google Cloud**
   - Cloud Run for containers
   - Cloud SQL for database
   - Cloud DNS for domain

3. **Azure**
   - AKS for containers
   - Azure Database for PostgreSQL
   - Azure DNS

## SSL/TLS Setup

### 1. Using Nginx

Install Nginx:
```bash
sudo apt install -y nginx
```

Configure Nginx (`/etc/nginx/sites-available/tgeld`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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

### 2. Let's Encrypt SSL

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## Monitoring Setup

### 1. Basic Monitoring

```bash
# Install monitoring tools
sudo apt install -y prometheus node-exporter

# Configure Prometheus
# Edit /etc/prometheus/prometheus.yml
```

### 2. Log Management

```bash
# Install log management
sudo apt install -y logrotate

# Configure log rotation
# Edit /etc/logrotate.d/tgeld
```

## Backup Strategy

### 1. Database Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker compose exec -T db pg_dump -U postgres tgeld > "$BACKUP_DIR/tgeld_$TIMESTAMP.sql"
EOF

# Schedule backup
chmod +x backup.sh
sudo crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 2. Application Backups

```bash
# Backup uploads directory
tar -czf uploads_backup.tar.gz uploads/
```

## Security Checklist

- [ ] Configure firewall
- [ ] Set up SSL/TLS
- [ ] Secure database access
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Enable automated backups
- [ ] Review permissions
- [ ] Update regularly

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if application is running
   - Verify Nginx configuration
   - Check logs: `journalctl -u tgeld`

2. **Database Connection**
   - Verify credentials
   - Check network access
   - Review connection pool settings

3. **Performance Issues**
   - Monitor resource usage
   - Check database queries
   - Review application logs

## Maintenance

### Regular Tasks

1. **Updates**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update application
git pull
npm install
npm run build
```

2. **Monitoring**
```bash
# Check status
sudo systemctl status tgeld
docker compose ps

# View logs
journalctl -u tgeld -f
```

3. **Backup Verification**
```bash
# Test backup restore
psql -U postgres -d tgeld_test < backup.sql
```

## Next Steps

1. [Monitoring Guide](../5-maintenance/monitoring.md)
2. [Backup Guide](../5-maintenance/backup-restore.md)
3. [Security Guide](../2-architecture/security.md)

Last Updated: December 4, 2024 