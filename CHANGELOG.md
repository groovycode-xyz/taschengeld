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

### Changed

- Refactored piggy bank interface to use a more efficient single-query approach
- Improved transaction handling with proper database transaction support
- Updated UI to show cleaner, more focused user information
- Simplified navigation and interaction patterns

### Database Changes

- Added `payment_status` column (varchar(20)) to `completed_tasks` table with default value 'Unpaid'
- Removed unused columns `task_title` and `task_icon` from `piggybank_transactions` table

### Technical Details

- Added new `piggyBankDashboardRepository` for optimized data fetching
- Implemented proper transaction handling in repositories
- Added detailed logging throughout the transaction process
- Created new types and interfaces for improved type safety

### Removed

### Fixed

## [0.1.7] - 2024-10-25

### Technical Details

- Added `completed_task_id` column to piggybank_transactions table
- Implemented proper table JOINs between piggybank_transactions, completed_tasks, and tasks tables
- Updated type definitions to support task reference in transactions
