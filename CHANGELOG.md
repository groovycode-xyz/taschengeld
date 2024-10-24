# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Automatic creation of Piggy Bank account when a new user is created
- Cascading deletion of Piggy Bank account and transactions when a user is deleted
- Sorting options for Piggy Bank accounts (by name and age)
- Filtering option for Piggy Bank accounts by user name
- Grouped view of Piggy Bank accounts for users with multiple accounts
- Display of user icons in the Transactions modal
- Immediate update of completed tasks in the Task Completion interface without page refresh
- Added completed task reference to Piggy Bank transactions
- Added task title and payout value display in transaction history
- Implemented JOIN queries to fetch task details with transactions
- Enhanced transaction history UI with color-coded entries and status icons
- Added user identification header in transaction modal
- Added scrollable transaction history with fixed height modal
- Added comprehensive DATABASE_SCHEMA.md documentation
- Documented all database tables, relationships, and cascading deletions
- Added detailed column descriptions for all database tables

### Changed

- Updated User Management interface to handle automatic Piggy Bank account creation
- Modified Piggy Bank interface to display grouped accounts
- Updated TransactionsModal to handle multiple accounts per user
- Improved UI for account cards in the Piggy Bank interface
- Restricted Piggy Bank interface to show only children's accounts
- Enhanced Task Completion process to include more detailed information
- Updated PiggyBankTransaction type to include optional task-related fields
- Modified transaction repository to include task information in queries
- Enhanced transaction display formatting in TransactionsModal component
- Updated transaction display to show proper task titles from completed tasks
- Modified Payday interface to create properly linked transactions
- Enhanced transaction repository to include task information in queries
- Improved transaction modal layout with better spacing and visual hierarchy

### Fixed

- Resolved issue with multiple accounts appearing for the same user in the Piggy Bank interface
- Corrected age-based sorting in Children's Piggy Bank interface
- Fixed apostrophe rendering issue in "Children's Piggy Bank Accounts" title
- Addressed issue with payout values not displaying correctly in the Payday interface
- Corrected `payment_status` case in Task Completion interface to display only tasks with status "Unpaid".
- Ensured `icon_name` and `user_icon` are included in Completed Task API responses for accurate icon rendering.
- Resolved issue where task and user icons were not displaying for existing completed tasks after page refresh.
- **Fixed user deletion issue in User Management interface by implementing cascading deletions for associated Piggy Bank accounts and transactions.**
- Addressed accessibility warnings by adding `aria-describedby` to DialogContent components.
- Corrected date format issues in User Management modals to adhere to "yyyy-MM-dd" format
- Fixed "undefined" task reference in transaction history by properly joining completed_tasks and tasks tables
- Corrected transaction description display to show task title when available
- Resolved database column reference issues in transaction queries
- Fixed modal overflow issues with scrollable transaction history

### Improved

- Enhanced type safety in piggyBankAccountRepository by supporting both Pool and PoolClient types
- Optimized data fetching and state management in the Task Completion interface
- Improved error handling and data validation in API routes and repositories

## [0.1.5] - 2024-10-23

### Technical Details

- Added `completed_task_id` column to piggybank_transactions table
- Implemented proper table JOINs between piggybank_transactions, completed_tasks, and tasks tables
- Updated type definitions to support task reference in transactions
