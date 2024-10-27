# Role-Based Access Control Implementation Checklist

## Phase 1: Core RBAC Implementation

- [ ] Create mode management system
  - [ ] Add mode state (Parent/Child) using React context
  - [ ] Add mode toggle functionality
  - [ ] Check for existing child users on app startup
  - [ ] Auto-enable Parent mode if no child users exist
  - [ ] Add PIN verification for Parent mode access (UI only initially)

## Phase 2: UI Components

- [ ] Add mode toggle button to sidebar
  - [ ] Position at bottom left
  - [ ] Show current mode state
  - [ ] Add hover/focus states
  - [ ] Add disabled state styling when enforcement is off
  - [ ] Add hint text for disabled state

## Phase 3: Conditional Rendering

- [ ] Implement sidebar menu item visibility
  - [ ] Show all items in Parent mode
  - [ ] Hide Payday/Task Management/Family in Child mode
  - [ ] Always show Settings and Task Completion
- [ ] Implement Piggy Bank button visibility
  - [ ] Show Deposit/Withdraw in Parent mode
  - [ ] Hide Deposit/Withdraw in Child mode

## Phase 4: PIN Management

- [ ] Add PIN setup UI
  - [ ] Add PIN input field with validation
  - [ ] Add PIN confirmation field
  - [ ] Add PIN visibility toggle
  - [ ] Add PIN reset option
- [ ] Add emergency PIN (9991)
  - [ ] Add emergency PIN validation
  - [ ] Add warning about data reset when using emergency PIN

## Phase 5: Database Integration (When Essential)

- [ ] Create app_settings table for persisting:
  - [ ] Role enforcement state
  - [ ] Global PIN
  - [ ] Mode state
- [ ] Add API endpoints for settings

## Phase 6: Testing & Documentation

- [ ] Test all mode transitions
- [ ] Test PIN validation
- [ ] Test emergency PIN
- [ ] Update documentation
