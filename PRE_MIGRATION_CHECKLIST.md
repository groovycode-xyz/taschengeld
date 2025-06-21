# Pre-Migration Checklist

Complete this checklist before migrating to the new GitHub repository.

## 🔍 Code Verification

- [ ] All cleanup phases completed successfully
- [ ] Application tested and working
- [ ] No uncommitted changes (`git status` is clean)
- [ ] All changes pushed to current repository

## 💾 Backup Requirements

### Database Backup
- [ ] Create full backup via Settings → Global App Settings → Backup & Restore
- [ ] Download backup SQL file
- [ ] Verify backup file size (should be > 0 bytes)
- [ ] Store backup in safe location
- [ ] Test backup can be opened/read

### Code Backup
- [ ] Current repository pushed to GitHub
- [ ] Tag created: `pre-migration-backup`
- [ ] All branches preserved

### Environment Backup
- [ ] Copy `.env` file to safe location
- [ ] Document any custom environment variables
- [ ] Note current Docker volume names:
  ```bash
  docker volume ls | grep tgeld
  ```

## 📋 Documentation Review

- [ ] CLEANUP_SUMMARY.md reviewed
- [ ] GITHUB_MIGRATION_GUIDE.md reviewed
- [ ] DOCKER_DATA_PERSISTENCE.md understood
- [ ] README.md ready for update

## 🐳 Docker Status

- [ ] All containers running normally
- [ ] No pending database migrations
- [ ] Docker volumes healthy
- [ ] Recent backup tested

## 🚀 Deployment Preparation

- [ ] List all active deployments
- [ ] Document deployment URLs
- [ ] Note any CI/CD configurations
- [ ] Identify webhook dependencies

## ✅ Final Checks

### Functionality Test
- [ ] User creation works
- [ ] Task creation works
- [ ] Task completion works
- [ ] Payday process works
- [ ] Piggy bank transactions work
- [ ] Backup/restore works
- [ ] Settings changes persist

### Technical Verification
```bash
# Run these commands and verify output

# Check current branch
git branch --show-current
# Expected: cleanup-phase-1-retry

# Check git status
git status
# Expected: nothing to commit, working tree clean

# Check Docker status
docker compose -f docker-compose.dev.yml ps
# Expected: all services healthy

# Check application health
curl http://localhost:3001/api/health
# Expected: {"status":"ok"}
```

## 🎯 Migration Readiness

### Required Information
- [ ] GitHub account has repository creation permissions
- [ ] New repository name confirmed: `taschengeld`
- [ ] Team members identified for access
- [ ] Migration date/time scheduled

### Risk Assessment
- [ ] Rollback plan understood
- [ ] Team notified of migration
- [ ] Downtime window identified (if needed)
- [ ] Support contact available

## 📝 Sign-off

By checking this box, I confirm all items above are complete:
- [ ] Ready to proceed with migration

---

**Migration Date**: ________________  
**Performed By**: ________________  
**Backup Location**: ________________  

## Notes

_Add any additional notes or concerns here:_