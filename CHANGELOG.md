# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New Sparkässeli (Piggy Bank) dashboard interface with improved UX
  - Clean card-based layout showing all child accounts
  - Direct deposit and withdrawal actions for each account
  - New transaction history modal with weekly grouping
  - Improved transaction display with color-coding and clear timestamps
- Enhanced SQL queries using CTEs and JSON aggregation for better performance
- Weekly grouping for transaction history ("This Week", "Last Week", "n Weeks Ago")
- New PiggyBankUser type with improved structure
- Dedicated transaction history modal component
- Consistent styling with shadcn/ui components
- Direct PostgreSQL database integration for task toggle endpoint
- Comprehensive API documentation in API.txt
- New Global App Settings interface with improved UX
  - Role enforcement toggle with PIN input
  - Currency selection (USD, EUR, GBP, CHF)
  - Reset options with confirmation dialogs
  - Backup and Restore functionality for Tasks, Users, and Piggy Bank data
  - JSON file download/upload for data backup
  - Section-specific warning messages and confirmations
- Toast notification system using shadcn/ui
  - Success notifications for settings changes
  - Error handling with descriptive messages
  - Auto-dismiss functionality
  - Proper TypeScript support
  - Custom styling and positioning
- Enhanced PIN management in Global Settings
  - Added PIN confirmation field for validation
  - Added show/hide PIN toggle
  - Added PIN test functionality
  - Added PIN clear button
  - Added confirmation dialog for disabling role enforcement
- Improved backup/restore interface
  - Added dedicated section with clear visual hierarchy
  - Added file download/upload functionality
  - Added loading states and progress indicators
  - Added success/error notifications
  - Added type validation for backup files
- Enhanced accessibility in Global Settings
  - Added ARIA labels for all interactive elements
  - Added keyboard navigation support
  - Added focus indicators for interactive elements
  - Added screen reader support for PIN validation
  - Added descriptive ARIA labels for buttons and inputs
  - Added proper focus management for modals

### Changed

- Refactored piggy bank interface to use a more efficient single-query approach
- Improved transaction handling with proper database transaction support
- Updated UI to show cleaner, more focused user information
- Simplified navigation and interaction patterns
- Migrated PiggyBank component to new implementation
  - Improved UI with responsive grid layout (1/2/3 columns)
  - Enhanced transaction history view with user icons
  - Added consistent AppShell/MainContent layout
  - Improved modal interactions for deposits/withdrawals
  - Added loading and error states
- Updated task toggle endpoint to use real database
- Improved type consistency across user management
- Enhanced birthday validation in user modals
- Updated API routes to handle number types consistently
- Consolidated API documentation into single source of truth
- Improved UI feedback with loading states and confirmation dialogs
- Enhanced user experience with interactive feedback
- Updated layout structure to support toast notifications
- Enhanced Global Settings UI/UX
  - Added section icons for better visual hierarchy
  - Improved spacing and layout consistency
  - Added loading states for all actions
  - Enhanced button feedback with spinners
  - Added clear section dividers
  - Improved warning message visibility
  - Added PIN management controls
  - Added role enforcement safeguards
  - Added visual feedback for interactive elements
  - Enhanced keyboard navigation support
  - Improved focus states for better accessibility

### Database Changes

- Added `payment_status` column (varchar(20)) to `completed_tasks` table with default value 'Unpaid'
- Removed unused columns `task_title` and `task_icon` from `piggybank_transactions` table

### Technical Details

- Added new `piggyBankDashboardRepository` for optimized data fetching
- Implemented proper transaction handling in repositories
- Added detailed logging throughout the transaction process
- Created new types and interfaces for improved type safety
- Fixed component import paths
- Fixed type definitions for better TypeScript support
- Implemented proper toast context and provider
- Added type-safe toast notifications
- Improved component organization for settings
- Added file handling for backup/restore operations
- Enhanced error handling with proper TypeScript types

### Removed

- Deprecated old PiggyBank component
- Removed unused AccountCard component
- Removed old TransactionsModal component
- Removed unused PiggyBankAccount type
- Deprecated mockDb.ts and all related code
- Removed mockDb references from documentation
- Removed redundant API.md in favor of API.txt
- Removed unused navigation component in favor of Sidebar

### Fixed

- Fixed layout consistency with AppShell wrapper
- Fixed navigation behavior in sidebar
- Type consistency for user_id (now using number throughout)
- Repository method signatures to match database types

### Documentation

- Updated ARCHITECTURE.md to reflect current implementation
- Updated frontend_instructions.md to remove mock database references
- Created comprehensive DEPRECATION_PLAN.md tracking all changes
- Consolidated API documentation into API.txt

## [0.1.7] - 2024-10-25

### Technical Details

- Added `completed_task_id` column to piggybank_transactions table
- Implemented proper table JOINs between piggybank_transactions, completed_tasks, and tasks tables
- Updated type definitions to support task reference in transactions
