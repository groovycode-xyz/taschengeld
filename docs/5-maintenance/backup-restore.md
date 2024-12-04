# Backup and Restore

This document outlines the backup and restore procedures for Taschengeld.

## Overview

The backup system ensures data safety through automated and manual backup procedures, with reliable restore capabilities.

## Backup Types

### Full Backup
- Complete database dump
- File system backup
- Configuration backup
- Logs archive

### Incremental Backup
- Transaction logs
- Changed files only
- Differential backups
- Point-in-time recovery

### System State
- Environment variables
- Configuration files
- SSL certificates
- System logs

## Backup Schedule

### Automated Backups
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-daily.sh

# Weekly backup on Sunday at 3 AM
0 3 * * 0 /usr/local/bin/backup-weekly.sh

# Monthly backup on 1st at 4 AM
0 4 1 * * /usr/local/bin/backup-monthly.sh
```

### Retention Policy
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months
- Yearly: 7 years

## Backup Procedures

### Database Backup
```bash
#!/bin/bash
# Database backup script

# Set variables
BACKUP_DIR="/backup/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="tgeld"
DB_USER="postgres"

# Create backup
pg_dump -U $DB_USER -d $DB_NAME -F c -f "$BACKUP_DIR/db_$DATE.backup"

# Compress backup
gzip "$BACKUP_DIR/db_$DATE.backup"

# Clean old backups
find $BACKUP_DIR -name "db_*.backup.gz" -mtime +7 -delete
```

### File System Backup
```bash
#!/bin/bash
# File system backup script

# Set variables
BACKUP_DIR="/backup/files"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/app"

# Create backup
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" \
    --exclude="node_modules" \
    --exclude="*.log" \
    $APP_DIR

# Clean old backups
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +7 -delete
```

## Restore Procedures

### Database Restore
```bash
#!/bin/bash
# Database restore script

# Set variables
BACKUP_FILE=$1
DB_NAME="tgeld"
DB_USER="postgres"

# Stop application
docker-compose down

# Restore database
pg_restore -U $DB_USER -d $DB_NAME -c -F c $BACKUP_FILE

# Start application
docker-compose up -d
```

### File System Restore
```bash
#!/bin/bash
# File system restore script

# Set variables
BACKUP_FILE=$1
RESTORE_DIR="/app"

# Stop application
docker-compose down

# Restore files
tar -xzf $BACKUP_FILE -C $RESTORE_DIR

# Fix permissions
chown -R app:app $RESTORE_DIR

# Start application
docker-compose up -d
```

## Verification Procedures

### Backup Verification
```bash
#!/bin/bash
# Backup verification script

# Test database backup
pg_restore --list $BACKUP_FILE > /dev/null
if [ $? -eq 0 ]; then
    echo "Database backup is valid"
else
    echo "Database backup is corrupted"
fi

# Test file archive
tar -tzf $BACKUP_FILE > /dev/null
if [ $? -eq 0 ]; then
    echo "File backup is valid"
else
    echo "File backup is corrupted"
fi
```

### Restore Testing
1. Restore to test environment
2. Run integrity checks
3. Verify application startup
4. Test core functionality
5. Validate data consistency

## Storage Management

### Storage Locations
- Local backup directory
- Remote backup server
- Cloud storage (AWS S3)
- Offsite storage

### Space Management
```bash
#!/bin/bash
# Storage management script

# Check disk space
SPACE=$(df -h | grep '/backup' | awk '{print $5}' | cut -d'%' -f1)
if [ $SPACE -gt 80 ]; then
    echo "Backup disk space critical"
    # Clean old backups
    find /backup -mtime +30 -delete
fi
```

## Disaster Recovery

### Recovery Plan
1. Assess data loss
2. Select restore point
3. Stop services
4. Restore data
5. Verify integrity
6. Start services
7. Run tests

### Recovery Time Objectives
- Database: < 1 hour
- Files: < 2 hours
- Full system: < 4 hours
- Point-in-time: < 6 hours

## Monitoring

### Backup Monitoring
- Backup completion
- Storage space
- Backup integrity
- Transfer rates
- Error logging

### Alert Configuration
```yaml
alerts:
  backup_failed:
    condition: "exit_code != 0"
    severity: "critical"
    notification:
      - email: "admin@taschengeld.com"
      - slack: "#backup-alerts"
```

## Security

### Encryption
- AES-256 encryption
- Key management
- Secure transfer
- Access control
- Audit logging

### Access Control
```yaml
backup_permissions:
  admin:
    - create_backup
    - restore_backup
    - verify_backup
  operator:
    - create_backup
    - verify_backup
  viewer:
    - view_backup_status
```

## Best Practices

### Backup Best Practices
1. Regular testing
2. Multiple locations
3. Encryption
4. Documentation
5. Automation

### Restore Best Practices
1. Regular drills
2. Documented procedures
3. Access control
4. Testing environment
5. Verification steps

## Troubleshooting

### Common Issues
1. Backup failure
2. Storage full
3. Corruption
4. Permission errors
5. Network issues

### Solutions
1. Retry mechanism
2. Space cleanup
3. Integrity check
4. Permission fix
5. Network test

## Additional Resources

1. [Monitoring Guide](monitoring.md)
2. [Troubleshooting Guide](troubleshooting.md)
3. [Security Guidelines](../2-architecture/security.md)
4. [Database Schema](../2-architecture/database-schema.md)

Last Updated: December 4, 2024 