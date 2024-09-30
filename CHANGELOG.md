# Changelog

All notable changes to the Tascheged Allowance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- User Management Interface with CRUD operations
- API endpoints for user management (GET, POST, PUT, DELETE)
- Icon selection functionality for user profiles
- DeleteConfirmationModal for user deletion

### Changed
- Refined AddUserModal and EditUserModal components
- Improved UX with consistent layout across user modals
- Updated UserManagement component to use API endpoints

### Fixed
- Reset form fields in AddUserModal when opened
- Ensured 'Role' field is mandatory in user forms
- Set default icon to 'user' for new users

## [0.1.0] - 2023-05-XX

### Added
- Initial project setup
- Basic application shell with header and sidebar navigation
- Task Management Interface (list view, CRUD operations, visibility toggle)
- Integration of shadcn/ui components for consistent styling
- Initial unit tests for TaskManagement component

[Unreleased]: https://github.com/yourusername/tascheged/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/tascheged/releases/tag/v0.1.0