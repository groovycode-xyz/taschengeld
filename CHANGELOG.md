# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Implemented Piggy Bank functionality with real database integration
- Created `piggyBankAccountRepository` and `piggyBankTransactionRepository` for database operations
- Added API routes for fetching and updating Piggy Bank accounts and transactions
- Implemented AddFundsModal and WithdrawFundsModal with error handling and form reset
- Added optimistic updates for better user experience in Piggy Bank transactions

### Changed

- Updated PiggyBank component to use real data from API instead of mock data
- Refactored API routes to handle Piggy Bank operations
- Updated types for PiggyBankAccount and PiggyBankTransaction

### Fixed

- Resolved issues with form field reset and modal closure in AddFundsModal and WithdrawFundsModal
- Fixed error handling for insufficient balance in WithdrawFundsModal

### Improved

- Enhanced error handling and user feedback in Piggy Bank operations
- Optimized database queries for Piggy Bank transactions

## [0.1.4] - 2024-10-22
