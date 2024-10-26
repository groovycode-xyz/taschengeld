# Piggy Bank Component Deprecation Plan

## Completed Phases

### Phase 1: Preparation ✓

- [x] Created deprecate-old-piggy-bank branch
- [x] Verified piggy-bank-v2.tsx working
- [x] Confirmed all routes using new component

### Phase 2: Component Renaming ✓

- [x] Renamed PiggyBankV2 component to PiggyBank
- [x] Renamed piggy-bank-v2.tsx to piggy-bank.tsx
- [x] Updated all imports

### Phase 3: Remove Deprecated Files ✓

- [x] Moved old piggy-bank.tsx to deprecated/
- [x] Removed account-card.tsx
- [x] Removed transactions-modal.tsx
- [x] Removed unused types

### Phase 4: API and Types Cleanup ✓

- [x] Reviewed /api/piggy-bank endpoint usage
- [x] Moved PiggyBankUser interface to its own type file
- [x] Updated imports

### Phase 5: Testing ✓

- [x] Fixed layout structure
- [x] Tested all functionality
- [x] Verified error states
- [x] Tested loading states
- [x] Tested responsive design

### Phase 6: Documentation ✓

- [x] Updated CHANGELOG.md
- [x] Created comprehensive API.txt
- [x] Documented API changes

### Phase 7: Final Cleanup ✓

- [x] Removed deprecated directory
- [x] Fixed all type errors
- [x] Verified no remaining linter warnings

### Phase 8: Navigation Cleanup ✓

- [x] Removed navigation.tsx
- [x] Verified sidebar.tsx implementation
- [x] Updated layout.tsx

### Phase 9: Final Tasks ✓

- [x] Deprecate mockDb.ts
  - [x] Identify all uses of mockDb
  - [x] Replace mock data with proper database calls
  - [x] Remove mockDb.ts
- [x] Documentation
  - [x] Remove mockDb references from documentation
  - [x] Update API documentation

## Rollback Plan

If issues are encountered:

1. Revert component rename
2. Restore removed files from `deprecated` directory
3. Switch back to old implementation
4. Document issues encountered

## Notes

- Each step should be committed separately for easy rollback if needed
- Test after each significant change
- Keep `deprecated` directory until successful production deployment
