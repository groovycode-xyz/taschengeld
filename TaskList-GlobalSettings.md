# Global App Settings Implementation Checklist

## Phase 1: UI Framework (Current)

- [x] Add Role Enforcement toggle with hint text
- [x] Add conditional PIN input field
- [x] Add currency selector dropdown (USD, EUR, GBP, CHF)
- [ ] Add warning messages for reset buttons
- [ ] Add confirmation dialogs for reset actions
- [ ] Remove duplicate PIN section (currently showing twice)
- [ ] Add proper hint text for all reset options
- [ ] Add loading states for all reset buttons
- [ ] Add proper error handling UI components
- [ ] Add success notification components

## Phase 2: Database Setup (Future)

- [ ] Create app_settings table `sql
CREATE TABLE app_settings (
  setting_id SERIAL PRIMARY KEY,
  enforce_roles BOOLEAN DEFAULT false,
  global_pin VARCHAR(4),
  currency_code VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);  `
- [ ] Create database migration script
- [ ] Create app_settings repository
- [ ] Add API endpoints for settings CRUD operations

## Phase 3: Backend Integration (Future)

- [ ] Implement settings fetch on app load
- [ ] Implement settings update functionality
- [ ] Implement table-specific reset functionality
- [ ] Add backup/restore functionality for:
  - [ ] Users table
  - [ ] Tasks table
  - [ ] Accounts table
  - [ ] Transactions table
- [ ] Add proper error handling and validation

## Phase 4: Testing & Documentation (Future)

- [ ] Add unit tests for settings components
- [ ] Add integration tests for settings API
- [ ] Update ARCHITECTURE.md
- [ ] Update API documentation
- [ ] Add migration documentation
