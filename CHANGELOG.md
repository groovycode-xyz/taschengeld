# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New Interface Component Structure guidelines in frontend instructions
- Implemented filtering of users to show only child users in the Payday interface

### Changed

- Refactored Payday interface by merging PaydayInterface into a single Payday component
- Updated Payday interface to use mock database for fetching users and completed tasks
- Modified the user filter in Payday interface to only show users with the role of 'child'
- Added visual indicator (green icon) to the Payday interface
- Updated task mapping to ensure compatibility with CompletedTaskCard component
- Adjusted task handling to use 'id' instead of 'c_task_id'

### Fixed

- Resolved issue where all users were being displayed in the Payday interface instead of only child users
- Fixed runtime error related to undefined 'completedAt' property

### Improved

- Enhanced code organization and reduced prop drilling in Payday component
- Improved readability and maintainability of the Payday feature

## [0.1.0] - 2024-XX-XX
