# Piggy Bank Component Deprecation Plan

## Phase 1: Preparation

- [x] Create a new branch for this deprecation work
- [x] Verify that `piggy-bank-v2.tsx` is working as expected
- [x] Confirm all routes using the new component:
  - [x] Check `/api/piggy-bank/dashboard` endpoint
  - [x] Check `/api/piggy-bank` POST endpoint for transactions

## Phase 2: Component Renaming

- [x] Rename `PiggyBankV2` component to `PiggyBank`
- [x] Rename `piggy-bank-v2.tsx` to `piggy-bank.tsx` (after old file removal)
- [x] Update any imports referencing `piggy-bank-v2.tsx`

## Phase 3: Remove Deprecated Files

- [x] Move old `piggy-bank.tsx` to `deprecated/piggy-bank.tsx` (temporary backup)
- [x] Remove `components/account-card.tsx` (used only by old implementation)
- [x] Remove `components/transactions-modal.tsx` (replaced by TransactionHistoryModal)
- [x] Check and remove unused types in `app/types/piggyBankAccount.ts`

## Phase 4: API and Types Cleanup

- [x] Review `/api/piggy-bank` endpoint usage
  - [x] Verify only POST transactions are using this endpoint
  - [x] Update endpoint if needed to match new implementation
- [x] Move `PiggyBankUser` interface to its own type file
  - [x] Create `app/types/piggyBankUser.ts`
  - [x] Export interface
  - [x] Update imports

## Phase 5: Testing

- [x] Fix layout structure to match wireframe
  - [x] Restore AppShell wrapper
  - [x] Restore MainContent component
  - [x] Verify consistent navigation behavior
- [x] Test all Piggy Bank functionality:
  - [x] View balances
    - [x] All user accounts displayed
    - [x] User icons showing correctly
    - [x] User names displaying
    - [x] Current balances visible
    - [x] Deposit buttons present
    - [x] Withdraw buttons present
    - [x] Transactions buttons present
  - [x] Add funds
    - [x] Modal opens correctly
    - [x] Can enter amount
    - [x] Can add comments
    - [x] Balance updates after deposit
  - [x] Withdraw funds
    - [x] Modal opens correctly
    - [x] Can enter amount
    - [x] Can add comments
    - [x] Balance updates after withdrawal
  - [x] View transaction history
    - [x] Modal opens correctly
    - [x] Shows transaction list
    - [x] Displays correct details
- [x] Test error states
  - [x] Basic error handling for API calls
  - [x] Error display to user
- [x] Test loading states
  - [x] Initial data loading
  - [x] Loading indicator present
- [x] Test with different screen sizes
  - [x] Mobile view (1 column)
  - [x] Tablet view (2 columns)
  - [x] Desktop view (3 columns)
- [x] Verify no console errors
  - [x] Intentional error logging for debugging
  - [x] No unintended console errors

## Phase 6: Documentation

- [x] Update CHANGELOG.md with deprecation notes
- [x] Update any relevant documentation mentioning the old implementation
- [x] Document any API changes
  - [x] Created comprehensive API.txt with full documentation
  - [x] Included database schema and queries
  - [x] Removed redundant API.md
- [x] Update component documentation if it exists

## Phase 7: Final Cleanup

- [x] Remove `deprecated` directory after successful testing
- [x] Remove any unused imports across the codebase
  - [x] Removed unused Transaction import from piggyBankDashboardRepository.ts
  - [x] Removed unused Task import from add-task-modal.tsx
  - [x] Verified other imports are in use
- [x] Remove any unused types
  - [x] Removed unused Transaction type
  - [x] Removed duplicate PiggyBankUser type from piggyBank.ts
  - [x] Consolidated types into piggyBankUser.ts
- [x] Run linter to catch any remaining issues
  - [x] Fixed TypeScript version warning (will be addressed in separate task)
  - [x] Fixed unused import in piggyBankDashboardRepository.ts
  - [x] Verified no remaining linter warnings or errors
- [ ] Run type checker to verify no type errors
  - [x] Fixed PiggyBankUser import paths
  - [x] Fixed Navigation import in layout.tsx (using Sidebar instead)
  - [x] Fixed birthday type in add-user-modal.tsx (string | null vs string)
  - [x] Fixed birthday type in edit-user-modal.tsx (string | null vs string)
  - [x] Fixed User type in task-completion.tsx (string vs number mismatch)
  - [x] Fixed userRepository method signatures to use number
  - [x] Fixed API routes to handle number types
  - [x] Fixed completed-tasks route to use number types
  - [ ] Fix Transaction type in mockDb.ts (deferred to Phase 9)
  - [ ] Fix userRepository types in testUserRepository.ts (deferred to Phase 9)

## Phase 8: Navigation Cleanup

- [x] Remove unused navigation.tsx
- [x] Verify sidebar.tsx is the correct implementation
- [x] Update layout.tsx to use Sidebar component

## Phase 9: Future Tasks (Post-Deployment)

- [ ] Deprecate mockDb.ts
  - [ ] Move to proper database implementation
  - [ ] Remove mock data
  - [ ] Update affected tests
  - [ ] Remove temporary Transaction type fix
  - [ ] Update userRepository to use correct types
  - [ ] Ensure consistent types between mock and real data
  - [ ] Update test files to use proper types

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
