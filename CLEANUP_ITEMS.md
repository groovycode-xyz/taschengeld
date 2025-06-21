# Identified Cleanup Items

**Date**: 2025-06-20  
**Source**: Analysis from pre-cleanup-backup branch

## Phase 2A: Documentation Cleanup

### To Remove (67 files):

1. **`/docs/99-archived/`** - Old documentation migrated to GitHub Wiki
   - Contains outdated architectural docs
   - Old user guides and PDFs
   - Legacy development docs
2. **`/docs/refactoring/`** - Abandoned cross-platform migration plans

   - DATABASE_MIGRATION_GUIDE.md
   - PHASE_IMPLEMENTATION_GUIDES.md
   - PROJECT_PLAN.md
   - QUICK_REFERENCE.md
   - TECHNICAL_DECISIONS.md

3. **Port notes files** - Discontinued cross-platform port

   - port-notes-api-endpoints.md
   - port-notes-database-schema.md
   - port-notes-migration-plan.md
   - port-notes-new-PRD.md
   - port-notes-overview.md
   - port-notes-tech-stack-recommendations.md
   - port-notes-ui-components.md

4. **Backup files**
   - `/docs/.$docker-development-principles.drawio.bkp`

## Phase 2B: Scripts & Tools Cleanup

### To Remove:

1. **`/tools/db-dump.sh`**

   - Contains hardcoded database credentials (SECURITY RISK!)
   - Redundant with backup API

2. **`/scripts/generate-migration.sh`**

   - Redundant with Prisma's built-in `npx prisma migrate`

3. **`/scripts/db-migrate.sh`**

   - Redundant with Prisma's built-in migration commands

4. **`/switch-mode.sh`**
   - References non-existent .env files
   - Functionality replaced by in-app mode switching

## Phase 2C: Code Cleanup

### Potential Issues to Review:

1. **Confirmation Dialog Components**

   - `confirm-dialog.tsx` - Used for general confirmations
   - `confirmation-dialog.tsx` - Used for specific delete confirmations
   - Review if both are necessary

2. **Commented Code**

   - Search for large commented blocks
   - Remove if no longer needed

3. **Console Logs**

   - Remove debug console.log statements
   - Keep only necessary error logging

4. **Unused Imports**
   - Clean up any unused import statements

## Phase 2D: Dependencies

### To Check:

1. Run `npm prune` to remove unused packages
2. Check for duplicate dependencies
3. Review outdated packages (cautiously)
4. Verify all dependencies are actually used

## Files Already Marked as Unused

From the backup branch analysis:

- Components marked with `.unused` suffix
- Empty files that were identified
- Legacy implementations replaced by newer versions

## Security Concerns

**IMMEDIATE ATTENTION REQUIRED:**

- `/tools/db-dump.sh` contains hardcoded database credentials
- Must be removed for security reasons

## Testing Requirements

Before removing each item:

1. Verify it's not imported anywhere
2. Check it's not referenced in documentation
3. Ensure no active code depends on it
4. Test application still works after removal

## Rollback Plan

If any removal causes issues:

1. `git checkout pre-cleanup-backup -- [filename]`
2. Or fully revert: `git checkout pre-cleanup-backup`
3. Identify why it was still needed
4. Document the dependency
