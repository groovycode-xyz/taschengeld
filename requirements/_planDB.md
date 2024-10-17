# Database Schema and Server-Side Data Management Plan

Created: 2024-07-23
Last Updated: 2024-10-17

This document serves as a comprehensive plan for the server-side database and data management system for the Taschengeld project.

## 1. Current Data Structure

Implemented tables:

- users
- tasks

Tables to be implemented:

- completed_tasks
- piggybank_accounts
- piggybank_transactions

## 2. Existing Interfaces and Components

Implemented:

- User Management
- Task Management

To be implemented:

- Task Completion
- Payday Interface
- Piggy Bank Interface

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
