# Pre-Migration Checklist

Complete this checklist before migrating to the new GitHub repository.

## 🔍 Code Verification

- [x] All cleanup phases completed successfully
- [x] Application tested and working
- [x] No uncommitted changes (`git status` is clean)
- [x] All changes pushed to current repository

## 💾 Backup Requirements

### Database Backup
- [x] Create full backup via Settings → Global App Settings → Backup & Restore
- [x] Download backup SQL file
- [x] Verify backup file size (should be > 0 bytes)
- [x] Store backup in safe location
- [x] Test backup can be opened/read

### Code Backup
- [x] Current repository pushed to GitHub
- [x] Tag created: `pre-migration-backup`
- [x] All branches preserved

### Environment Backup
- [x] Copy `.env` file to safe location
- [x] Document any custom environment variables
- [x] Note current Docker volume names:
  ```bash
  docker volume ls | grep tgeld
  ```

## 📋 Documentation Review

- [x] CLEANUP_SUMMARY.md reviewed
- [x] GITHUB_MIGRATION_GUIDE.md reviewed
- [x] DOCKER_DATA_PERSISTENCE.md understood
- [x] README.md ready for update

## 🐳 Docker Status

- [x] All containers running normally
- [x] No pending database migrations
- [x] Docker volumes healthy
- [x] Recent backup tested

## 🚀 Deployment Preparation

- [x] List all active deployments
- [x] Document deployment URLs
- [x] Note any CI/CD configurations
- [x] Identify webhook dependencies

## ✅ Final Checks

### Functionality Test
- [x] User creation works
- [x] Task creation works
- [x] Task completion works
- [x] Payday process works
- [x] Piggy bank transactions work
- [x] Backup/restore works
- [x] Settings changes persist

### Technical Verification ✅
```bash
# Run these commands and verify output

# Check current branch
git branch --show-current
# Expected: cleanup-phase-1-retry ✅

# Check git status
git status
# Expected: nothing to commit, working tree clean ✅

# Check Docker status
docker compose -f docker-compose.dev.yml ps
# Expected: all services healthy ✅

# Check application health
curl http://localhost:3001/api/health
# Expected: {"status":"ok"} ✅
```

## 🎯 Migration Readiness

### Required Information
- [x] GitHub account has repository creation permissions
- [x] New repository name confirmed: `taschengeld`
- [x] Team members identified for access (single member)
- [x] Migration date/time scheduled (now)

### Risk Assessment
- [x] Rollback plan understood (git history preserved)
- [x] Team notified of migration (single member)
- [x] Downtime window identified (if needed) - N/A for dev environment
- [x] Support contact available (self)

## 📝 Sign-off

By checking this box, I confirm all items above are complete:
- [x] Ready to proceed with migration

---

**Migration Date**: 2025-06-21  
**Performed By**: barneephife  
**Backup Location**: Pre-migration tag: `pre-migration-backup`  

## Notes

_Add any additional notes or concerns here:_

### Docker Volumes (as of migration date):
- **taschengeld_postgres_dev_data** - Development database data (NEW - currently in use after folder rename)
- **tgeld_postgres_dev_data** - Development database data (OLD - from before folder rename)
- **tgeld_postgres_data** - Production database data
- **tgeld_postgres_prod_data** - Another production database volume
- **tgeld_app_data** - Application data
- **tgeld_app_uploads** - Uploaded files
- **tgeld_uploads** - Additional uploads volume
- **tgeld_next_cache** - Next.js cache
- **tgeld_node_modules** - Node modules cache

### Deployment Information:
- **Active Deployments**: Development environment only (localhost)
- **URLs**: http://localhost:3001 (app), localhost:5433 (database)
- **CI/CD**: None configured
- **Webhooks**: None found