# Database Schema and Server-Side Data Management Plan

Created: 2024-07-23
Last Updated: 2024-10-17

This document serves as a comprehensive plan for the server-side database and data management system for the Taschengeld project.

- Database connection file is located at /app/lib/db.ts
- user: tged_admin
- Related environment variables: DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT are defined in .env.local

## 1. Current Data Structure

Implemented tables:

- users
- tasks

Tables to be implemented:

- completed_tasks
- piggybank_accounts
- piggybank_transactions

## 2. Existing Interfaces and Components

Fully Implemented:

- User Management
- Task Management

To be implemented: (also see PROJECT_STATUS.md, **Upcoming Tasks**)

- Task Completion
- Piggy Bank Interface
- Payday Interface

## 3. Actual Database Schema

### users Table

sql
CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
birthday DATE,
role VARCHAR(20) NOT NULL,
soundurl VARCHAR(255),
icon VARCHAR(50)
);

### tasks Table

sql
CREATE TABLE tasks (
task_id SERIAL PRIMARY KEY,
title VARCHAR(100) NOT NULL,
description TEXT,
icon_name VARCHAR(50),
sound_url VARCHAR(255),
payout_value DECIMAL(10,2) NOT NULL,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### completed_tasks Table

sql
CREATE TABLE completed_tasks (

### piggybank_accounts Table

sql

### piggybank_transactions Table

sql

# Additional Information

The repository pattern is used, encapsulating all database operations related to tasks in one place.

The use of a connection pool (imported from './db') suggests efficient database connection management.

The mapping function (mapTaskFromDb) ensures that data from the database is correctly formatted for use in the application, handling type conversions and naming conventions.

The repository methods return Promises, allowing for asynchronous operations.

The update method uses COALESCE in the SQL query, allowing for partial updates of task properties.

The create method omits task_id, created_at, and updated_at, relying on the database to handle these fields.

The getAll method orders tasks by creation date, which aligns with displaying the most recent tasks first in the UI.

The use of parameterized queries enhances security by preventing SQL injection attacks.

## Content of app/lib/db.ts

Import:

It imports the Pool class from the 'pg' package, which is the PostgreSQL client for Node.js.
Pool Configuration:

A new Pool instance is created with specific configuration parameters.

Export:

The pool instance is exported as the default export, allowing it to be imported and used in other parts of the application.

## Key Observations:

The application is using PostgreSQL as its database system.

The database connection is set up using a connection pool, which is a good practice for managing database connections efficiently.

The database is running locally (host: 'localhost'), which is typical for development environments. In a production environment, this would likely be changed to a remote database server.

The database name 'tgeld' aligns with the application name we've seen before.

The use of a specific user 'tgeld_admin' suggests proper database user management.

The password is hardcoded in the .env.local file.

The default PostgreSQL port (5432) is being used.
