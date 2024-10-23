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

### Changed

- Updated User Management interface to handle automatic Piggy Bank account creation
- Modified Piggy Bank interface to display grouped accounts
- Updated TransactionsModal to handle multiple accounts per user

### Fixed

- Resolved issue with multiple accounts appearing for the same user in the Piggy Bank interface

## [0.1.5] - 2024-10-23
