# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added .env.local file for local environment variables

### Changed

- Migrated Database Credentials: Moved sensitive database configuration details (user, host, database, password, port) from hardcoded values to environment variables using process.env.
- Port Conversion: Ensured the port is correctly interpreted as a number by wrapping process.env.DB_PORT with Number().

### Fixed

- Database credentials were hardcoded in the /app/lib/db.ts file.

### Improved

- Improved security by moving database credentials to .env.local

## [0.1.1] - 2024-10-20
