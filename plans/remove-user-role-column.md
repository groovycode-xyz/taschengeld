# Plan: Remove Role Column from Users Table

## Overview
Remove the 'role' column from the users table and update all dependent code. Development environment changes only - no data migration required.

## Prerequisites
- [ ] Take fresh database backup
- [ ] Run schema dump for documentation
- [ ] Ensure all services are stopped

## Implementation Steps

### 1. Type Definition Updates (Must be done first to catch TypeScript errors)
- [ ] Locate and update `PiggyBankUser` interface:
  ```typescript
  // Remove role field
  interface PiggyBankUser {
    user_id: number;
    name: string;
    icon: string;
    soundurl: string | null;
    birthday: Date;
    account: {
      account_id: number;
      balance: string;
    };
  }
  ```
- [ ] Update any dependent interfaces
- [ ] Run TypeScript compiler to identify affected files

### 2. Database Changes
- [ ] Create SQL migration file with:
  ```sql
  -- Drop foreign key constraints
  ALTER TABLE piggybank_accounts 
    DROP CONSTRAINT piggybank_accounts_user_id_fkey;
  ALTER TABLE completed_tasks 
    DROP CONSTRAINT completed_tasks_user_id_fkey;
  ALTER TABLE users 
    DROP CONSTRAINT fk_piggybank_account;
  
  -- Remove role column
  ALTER TABLE users 
    DROP COLUMN role;
  
  -- Recreate foreign key constraints
  ALTER TABLE piggybank_accounts 
    ADD CONSTRAINT piggybank_accounts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
  
  ALTER TABLE completed_tasks 
    ADD CONSTRAINT completed_tasks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
  
  ALTER TABLE users 
    ADD CONSTRAINT fk_piggybank_account 
    FOREIGN KEY (piggybank_account_id) REFERENCES piggybank_accounts(account_id);
  ```
- [ ] Test migration in development environment
- [ ] Document any errors/rollback steps

### 3. API Route Updates
- [ ] Update `/api/backup/all/route.ts`:
  ```typescript
  // Update user query to remove role filter and field
  const users = await client.query(`
    SELECT 
      name,
      icon,
      soundurl,
      birthday
    FROM users
    ORDER BY name;
  `);
  ```

- [ ] Update `/api/restore/all/route.ts`:
  ```typescript
  // Update user insertion
  await client.query(
    `INSERT INTO users (name, icon, soundurl, birthday)
     VALUES ($1, $2, $3, $4)`,
    [user.name, user.icon, user.soundurl, user.birthday]
  );
  ```

- [ ] Update `/api/reset/all/route.ts`:
  ```typescript
  // Replace role-based delete with truncate
  await client.query(`
    TRUNCATE TABLE users CASCADE;
  `);
  ```

### 4. Frontend Component Updates
- [ ] Update PiggyBank component (`components/piggy-bank.tsx`):
  - [ ] Remove role-based class conditionals:
    ```typescript
    // Remove
    ${user.role === 'parent' ? 'text-blue-700' : 'text-green-700'}
    ```
  - [ ] Update card styling to use single style
  - [ ] Remove role checks from component logic

- [ ] Update user selection components:
  - [ ] Remove role-based filtering from queries
  - [ ] Update UI to use consistent styling
  - [ ] Remove role-based conditionals

- [ ] Update ChildUserSelectionModal (`components/child-user-selection-modal.tsx`):
  - [ ] Rename to UserSelectionModal since it's no longer child-specific
  - [ ] Update props to remove child-specific naming
  - [ ] Update component to show all users without filtering

- [ ] Update EditUserModal (`components/edit-user-modal.tsx`):
  - [ ] Remove role state:
    ```typescript
    // Remove
    const [role, setRole] = useState(user.role);
    ```
  - [ ] Remove role selection UI:
    ```typescript
    // Remove entire role selection section
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='role' className='text-right'>
        Role
      </Label>
      <Select onValueChange={(value: 'parent' | 'child') => setRole(value)} value={role}>
        ...
      </Select>
    </div>
    ```
  - [ ] Remove role from form submission data

- [ ] Update AddUserModal (`components/add-user-modal.tsx`):
  - [ ] Remove role from defaultUserState
  - [ ] Remove role state and setRole
  - [ ] Remove role selection UI section
  - [ ] Remove role from CreateUserInput type
  - [ ] Remove role from form submission data

- [ ] Update UserCard (`components/user-card.tsx`):
  - [ ] Remove role-based styling:
    ```typescript
    // Remove
    const bgColor = user.role === 'parent' ? 'bg-blue-100' : 'bg-green-100';
    const iconColor = user.role === 'parent' ? 'text-blue-700' : 'text-green-700';
    ```
  - [ ] Remove role display from card
  - [ ] Implement consistent styling for all users

- [ ] Update Payday component (`components/payday.tsx`):
  - [ ] Update any role-based filtering or display logic
  - [ ] Ensure user grouping/sorting works without role dependency

- [ ] Update TaskCompletion component (`components/task-completion.tsx`):
  - [ ] Update user fetching to remove role filtering
  - [ ] Update any role-based display logic
  - [ ] Ensure task completion works for all users

### Additional Type Updates
- [ ] Update User interface:
  ```typescript
  interface User {
    user_id: number;
    name: string;
    icon: string;
    soundurl: string | null;
    birthday: Date;
    // Remove role field
  }
  ```
- [ ] Update CreateUserInput type:
  ```typescript
  interface CreateUserInput {
    name: string;
    icon: string;
    soundurl: string | null;
    birthday: string;
    // Remove role field
  }
  ```

### API Route Additional Updates
- [ ] Update `/api/child-users` route:
  - [ ] Rename to `/api/users`
  - [ ] Remove role-based filtering
  - [ ] Update any dependent components to use new endpoint

### File Renames
- [ ] Rename `child-user-selection-modal.tsx` to `user-selection-modal.tsx`
- [ ] Update all imports referencing the renamed file

### 5. Testing Checklist
- [ ] Database:
  - [ ] Verify column removal
  - [ ] Test foreign key constraints
  - [ ] Check cascade operations

- [ ] API Routes:
  - [ ] Test backup creation
  - [ ] Test backup restore
  - [ ] Test database reset
  - [ ] Verify user operations (create/edit/delete)

- [ ] Frontend:
  - [ ] Verify PiggyBank display
  - [ ] Check user selection functionality
  - [ ] Test user management features
  - [ ] Verify PIN-based access still works

### 6. Documentation Updates
- [ ] Update schema documentation with new users table structure
- [ ] Update API documentation to remove role references
- [ ] Update component documentation to remove role-based styling notes
- [ ] Update README if needed
- [ ] Remove role-related sections from PRD.md

## Rollback Plan
If issues occur during implementation:
1. Restore database from backup
2. Revert code changes using version control
3. Run previous schema migration

## Success Verification
- [ ] Database schema verified
- [ ] All TypeScript errors resolved
- [ ] API routes functioning
- [ ] Frontend components displaying correctly
- [ ] Access management system working
- [ ] All tests passing

## Notes
- Keep PIN-based access management system unchanged
- Development environment only - no production data concerns
- Changes can be made in single deployment
- All changes should be committed in single PR