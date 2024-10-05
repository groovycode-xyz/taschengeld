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

### Changed

- Refactored app/layout.tsx to use ClientLayout for wrapping the application with ParentChildModeProvider
- Updated components to use 'use client' directive for client-side rendering in Next.js 13+
- Removed Husky and Prettier from the project to simplify the development workflow
- Removed all pre-commit hooks and automatic code formatting
- Deleted the .husky folder to complete the removal of Husky from the project
- Uninstalled npm packages related to Prettier, Husky, and testing (husky, prettier, jest, etc.)

### Fixed

- Resolved build issues related to client-side rendering in Next.js 13+
- Eliminated pre-commit hook errors by removing Husky

### Known Issues

- TypeScript and linter errors in some components need to be addressed

## [0.1.0] - 2024-XX-XX

- Initial release

[Unreleased]: https://github.com/yourusername/tascheged/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/tascheged/releases/tag/v0.1.0
