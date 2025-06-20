# Docker Data Persistence Guide

## Overview

This guide explains how database data persistence works in Taschengeld and how to avoid accidental data loss when using Docker.

## Understanding Docker Volumes

Taschengeld uses Docker named volumes to persist database data between container restarts:

- **Development**: `tgeld_postgres_dev_data`
- **Production**: `tgeld_postgres_data`

These volumes store your PostgreSQL database files separately from the containers, ensuring data survives container recreation.

## Critical Warning: The `-v` Flag

The `-v` flag in `docker compose down -v` means "remove volumes" and will **DELETE ALL YOUR DATA**.

## Safe Docker Commands

### Development Environment

```bash
# ✅ SAFE - Restart containers (keeps data)
npm run dev:docker:restart

# ✅ SAFE - Stop containers (keeps data)
npm run dev:docker:stop

# ✅ SAFE - Start stopped containers
npm run dev:docker:start

# ✅ SAFE - Manual restart
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d

# ❌ DANGEROUS - Deletes all data
npm run dev:docker:clean  # Uses down -v internally
docker compose -f docker-compose.dev.yml down -v
```

### Production Environment

```bash
# ✅ SAFE - Stop containers (keeps data)
docker compose down

# ✅ SAFE - Restart containers
docker compose down
docker compose up -d

# ✅ SAFE - Update to new version
docker compose pull
docker compose up -d

# ❌ DANGEROUS - Deletes all data
docker compose down -v
docker volume rm tgeld_postgres_data
```

## When to Use Clean Restart

The `npm run dev:docker:clean` command should only be used when:

1. You want to start with a completely fresh database
2. You're testing database migrations from scratch
3. You've corrupted your development database
4. You're switching between major versions with incompatible schemas

**Always backup your data first if it contains anything important!**

## Data Backup Strategies

### Built-in Backup (Recommended)

1. Access the app in your browser
2. Switch to Parent Mode (if enabled)
3. Go to Settings → Global App Settings
4. Use the "Backup and Restore" section
5. Click "Create Backup" to download a SQL file

### Manual Docker Backup

```bash
# Development
docker compose -f docker-compose.dev.yml exec db pg_dump -U postgres tgeld > backup_$(date +%Y%m%d_%H%M%S).sql

# Production
docker compose exec db pg_dump -U postgres tgeld > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Checking Volume Status

```bash
# List all volumes
docker volume ls | grep tgeld

# Inspect a volume
docker volume inspect tgeld_postgres_dev_data

# Check volume size
docker system df -v | grep tgeld
```

## Recovery from Accidental Deletion

If you accidentally deleted your data:

1. **Stop immediately** - Don't run any more Docker commands
2. Check for backup files:
   - Look for `backup.sql` files in your project directory
   - Check your browser downloads for backup files
3. If you have a backup:
   - Start fresh containers: `docker compose up -d`
   - Wait for startup to complete
   - Use Settings → Backup & Restore → Upload to restore

## Best Practices

1. **Regular Backups**: Set a reminder to backup weekly or before major changes
2. **Test Restores**: Periodically test that your backups can be restored
3. **Separate Dev/Prod**: Use different volume names for development and production
4. **Document Your Setup**: Keep notes on your specific configuration
5. **Version Control**: Never commit `.env` files with real passwords

## Common Mistakes to Avoid

1. Using `down -v` thinking it's a "thorough" cleanup
2. Deleting volumes to "save space" without backing up first
3. Not testing backups until you need them
4. Sharing volume names between different projects
5. Running clean commands from muscle memory

## Quick Reference Card

```
SAFE COMMANDS:
✅ docker compose down
✅ docker compose restart
✅ npm run dev:docker:restart
✅ npm run dev:docker:stop/start

DANGEROUS COMMANDS:
❌ docker compose down -v
❌ npm run dev:docker:clean
❌ docker volume rm <volume_name>
❌ docker system prune -a --volumes
```

Remember: When in doubt, make a backup first!