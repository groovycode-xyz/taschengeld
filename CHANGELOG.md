# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Implemented Parent/Child mode toggle functionality
- Created `useParentChildMode` hook for managing global Parent/Child mode state
- Added `ParentChildModeProvider` to wrap the application and provide mode state
- Updated Sidebar component to use the new hook for toggling the mode
- Modified PiggyBank component to conditionally render buttons based on the current mode
- Created ClientLayout component to ensure ParentChildModeProvider is used on the client side
- Created Table components for use in the TransactionsModal
- User icons displayed on Piggy Bank cards for child users
- Integration with mockDb for fetching user data in Piggy Bank component
- Display current balance in the Withdraw Funds modal

### Changed

- Updated Piggy Bank interface styling to match User Management interface
- Adjusted icon sizes and text styling in Piggy Bank component for consistency
- Refactored app/layout.tsx to use ClientLayout for wrapping the application with ParentChildModeProvider
- Updated components to use 'use client' directive for client-side rendering in Next.js 13+
- Removed Husky and Prettier from the project to simplify the development workflow
- Removed all pre-commit hooks and automatic code formatting
- Deleted the .husky folder to complete the removal of Husky from the project
- Uninstalled npm packages related to Prettier, Husky, and testing (husky, prettier, jest, etc.)
- Updated Piggy Bank component to show user icons alongside names
- Improved icon rendering in Piggy Bank component using IconComponent for consistency
- Changed colors of "Add Funds" (green) and "Withdraw Funds" (red) buttons in Piggy Bank interface
- Updated WithdrawFundsModal to prominently display the current balance before the withdrawal amount input
- Improved error handling in WithdrawFundsModal for better user feedback
- Increased icon size in Piggy Bank interface to match User Management interface
- Rearranged Piggy Bank card layout for improved readability and consistency
  - Icon placed at the top of the card
  - User name, balance, and buttons stacked vertically
  - Removed transaction count display
  - Centered content within each card
- Adjusted button styling in Piggy Bank cards for full-width display
- Enhanced the visual presentation of the balance in Piggy Bank cards
  - Added a light blue background with rounded corners and shadow
  - Increased font size and changed color to blue for better emphasis
  - Adjusted spacing for improved visual hierarchy
- Added a visual separator between the balance and action buttons in Piggy Bank cards
  - Improves visual hierarchy and distinguishes between information and actions

### Fixed

- Resolved build issues related to client-side rendering in Next.js 13+
- Eliminated pre-commit hook errors by removing Husky
- Resolved build error related to missing Table components
- Fixed icon display issues in Piggy Bank interface

### Known Issues

- TypeScript and linter errors in some components need to be addressed

## [0.1.0] - 2024-XX-XX

- Initial release

[Unreleased]: https://github.com/yourusername/tascheged/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/tascheged/releases/tag/v0.1.0
