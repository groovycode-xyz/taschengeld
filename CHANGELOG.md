# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Sound effects for Add Funds and Withdraw Funds actions in the Piggy Bank feature
- Balance calculation and display for each transaction in the Transactions modal
- User icons displayed in Add Funds, Withdraw Funds, and Transactions modals

### Changed

- Updated Transaction interface to include a balance field
- Refactored AddFundsModal and WithdrawFundsModal for consistent sound playback
- Improved TransactionsModal to show balance for each transaction
- Adjusted timing to ensure sound plays fully before modal closes
- Updated PiggyBank component to handle new balance calculations

### Fixed

- Resolved issues with file paths for sound effects
- Improved error handling for audio playback

## [0.1.0] - 2024-XX-XX

- Initial release

[Unreleased]: https://github.com/yourusername/tascheged/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/tascheged/releases/tag/v0.1.0
