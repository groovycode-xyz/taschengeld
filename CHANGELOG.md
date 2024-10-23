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

### Changed

- Updated User Management interface to handle automatic Piggy Bank account creation
- Modified Piggy Bank interface to display grouped accounts
- Updated TransactionsModal to handle multiple accounts per user
- Improved UI for account cards in the Piggy Bank interface
- Restricted Piggy Bank interface to show only children's accounts
- Enhanced Task Completion process to include more detailed information

### Fixed

- Resolved issue with multiple accounts appearing for the same user in the Piggy Bank interface
- Corrected age-based sorting in Children's Piggy Bank interface
- Fixed apostrophe rendering issue in "Children's Piggy Bank Accounts" title
- Addressed issue with payout values not displaying correctly in the Payday interface

### Improved

- Enhanced type safety in piggyBankAccountRepository by supporting both Pool and PoolClient types
- Optimized data fetching and state management in the Task Completion interface
- Improved error handling and data validation in API routes and repositories

## [0.1.5] - 2024-10-23
