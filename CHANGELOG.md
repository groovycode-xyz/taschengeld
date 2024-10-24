# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Default icon "user" for new users in the Add User Modal
- Reset all functionality in Global App Settings

### Changed

- Improved touch-friendly design for sidebar navigation
- Updated Piggy Bank icon to "hand-coins" in sidebar and interface
- Enhanced visual appeal of completed task cards in Payday interface

### Removed

- "Clear Completed Tasks" button from Task Completion component (development testing feature)
- Search functionality from the header component

### Fixed

- Ensured icon is never empty when adding or editing a user
- Resolved linter errors in Task Completion component
- Corrected type issues in Add User Modal

## [0.1.6] - 2024-10-24

### Technical Details

- Added `completed_task_id` column to piggybank_transactions table
- Implemented proper table JOINs between piggybank_transactions, completed_tasks, and tasks tables
- Updated type definitions to support task reference in transactions
