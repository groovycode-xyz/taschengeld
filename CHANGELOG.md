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
- Toggle button for theme switching at the bottom of the sidebar
- Global App Settings component with role enforcement toggle and reset options
- Settings icon in the navbar for quick access to Global App Settings
- New page for Global App Settings (/global-settings)

### Changed
- Updated theme toggle in sidebar to switch between "Parent" and "Child" modes
- Removed theme-related icons (Sun/Moon) from the toggle switch
- Refactored `components/sidebar.tsx` to reflect the new Parent/Child mode toggle
- Replaced theme toggle button with a switch in the sidebar
- Added visual indicator for current theme (Light/Dark) in the sidebar
- Updated `components/sidebar.tsx` to include state management for theme toggle
- Refined AddUserModal and EditUserModal components
- Improved UX with consistent layout across user modals
- Updated UserManagement component to use API endpoints
- Removed "Features" heading from the sidebar in `components/sidebar.tsx`.
- Adjusted positioning of menu items in the sidebar for a more compact layout.
- Updated sidebar layout in `components/sidebar.tsx` to accommodate the new toggle button
- Adjusted sidebar structure to use flexbox for vertical layout control
- Updated AppShell component to include Settings icon in the header
- Modified MainContent component to render Global App Settings page

### Fixed
- Reset form fields in AddUserModal when opened
- Ensured 'Role' field is mandatory in user forms
- Set default icon to 'user' for new users

### Changed
- Updated routing structure to use consistent AppShell component across all pages
- Modified MainContent component to render appropriate content based on current route
- Created individual page files for each menu item in the app directory

### Changed
- Removed user icon from the navbar in the AppShell component

## [0.1.0] - 2023-05-XX

### Added
- Initial project setup
- Basic application shell with header and sidebar navigation
- Task Management Interface (list view, CRUD operations, visibility toggle)
- Integration of shadcn/ui components for consistent styling
- Initial unit tests for TaskManagement component

[Unreleased]: https://github.com/yourusername/tascheged/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/tascheged/releases/tag/v0.1.0