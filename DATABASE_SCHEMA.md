# Database Schema Documentation

This document provides a comprehensive overview of the database schema for the Taschengeld project.
As of 2024-10-24

## Tables Overview

The database consists of five main tables:

- users
- tasks
- completed_tasks
- piggybank_accounts
- piggybank_transactions

## Detailed Table Structures

### Users Table

**Table:** `public.users`

| Column               | Type         | Nullable | Default                      | Description                            |
| -------------------- | ------------ | -------- | ---------------------------- | -------------------------------------- |
| user_id              | integer      | not null | nextval('users_user_id_seq') | Primary key                            |
| name                 | varchar(100) | not null | -                            | User's name                            |
| icon                 | varchar(50)  | not null | -                            | User's icon identifier                 |
| soundurl             | varchar(255) | yes      | -                            | URL to user's sound effect             |
| birthday             | date         | not null | -                            | User's birth date                      |
| role                 | varchar(20)  | not null | -                            | User's role (e.g., 'parent', 'child')  |
| piggybank_account_id | integer      | yes      | -                            | Reference to user's piggy bank account |
| created_at           | timestamp    | yes      | CURRENT_TIMESTAMP            | Record creation timestamp              |
| sound                | text         | yes      | -                            | Legacy sound field                     |

**Indexes:**

- PRIMARY KEY on (user_id)
- UNIQUE CONSTRAINT on (piggybank_account_id)

**Foreign Keys:**

- piggybank_account_id REFERENCES piggybank_accounts(account_id)

### Tasks Table

**Table:** `public.tasks`

| Column       | Type          | Nullable | Default                      | Description               |
| ------------ | ------------- | -------- | ---------------------------- | ------------------------- |
| task_id      | integer       | not null | nextval('tasks_task_id_seq') | Primary key               |
| title        | varchar(100)  | not null | -                            | Task title                |
| description  | text          | yes      | -                            | Task description          |
| icon_name    | varchar(50)   | yes      | -                            | Task icon identifier      |
| sound_url    | varchar(255)  | yes      | -                            | URL to task sound effect  |
| payout_value | numeric(10,2) | not null | -                            | Task completion reward    |
| is_active    | boolean       | yes      | true                         | Task availability status  |
| created_at   | timestamp     | yes      | CURRENT_TIMESTAMP            | Record creation timestamp |
| updated_at   | timestamp     | yes      | CURRENT_TIMESTAMP            | Record update timestamp   |

**Indexes:**

- PRIMARY KEY on (task_id)

### Completed Tasks Table

**Table:** `public.completed_tasks`

| Column         | Type          | Nullable | Default                                  | Description                  |
| -------------- | ------------- | -------- | ---------------------------------------- | ---------------------------- |
| c_task_id      | integer       | not null | nextval('completed_tasks_c_task_id_seq') | Primary key                  |
| user_id        | integer       | yes      | -                                        | Reference to completing user |
| task_id        | integer       | yes      | -                                        | Reference to completed task  |
| description    | text          | yes      | -                                        | Completion description       |
| payout_value   | numeric(15,2) | yes      | -                                        | Actual payout amount         |
| created_at     | timestamp     | yes      | CURRENT_TIMESTAMP                        | Completion timestamp         |
| comment        | text          | yes      | -                                        | Additional comments          |
| attachment     | varchar(255)  | yes      | -                                        | Path to attached file        |
| payment_status | varchar(20)   | yes      | 'Unpaid'                                 | Payment status               |

**Foreign Keys:**

- user_id REFERENCES users(user_id) ON DELETE CASCADE
- task_id REFERENCES tasks(task_id)

### Piggy Bank Accounts Table

**Table:** `public.piggybank_accounts`

| Column         | Type          | Nullable | Default                                      | Description                |
| -------------- | ------------- | -------- | -------------------------------------------- | -------------------------- |
| account_id     | integer       | not null | nextval('piggybank_accounts_account_id_seq') | Primary key                |
| user_id        | integer       | yes      | -                                            | Reference to account owner |
| account_number | varchar(20)   | not null | -                                            | Unique account number      |
| balance        | numeric(15,2) | yes      | 0                                            | Current account balance    |
| created_at     | timestamp     | yes      | CURRENT_TIMESTAMP                            | Account creation timestamp |

**Indexes:**

- PRIMARY KEY on (account_id)
- UNIQUE CONSTRAINT on (account_number)

**Foreign Keys:**

- user_id REFERENCES users(user_id) ON DELETE CASCADE

### Piggy Bank Transactions Table

**Table:** `public.piggybank_transactions`

| Column            | Type          | Nullable | Default                                              | Description                     |
| ----------------- | ------------- | -------- | ---------------------------------------------------- | ------------------------------- |
| transaction_id    | integer       | not null | nextval('piggybank_transactions_transaction_id_seq') | Primary key                     |
| account_id        | integer       | yes      | -                                                    | Reference to piggy bank account |
| amount            | numeric(15,2) | not null | -                                                    | Transaction amount              |
| transaction_type  | varchar(10)   | not null | -                                                    | Type of transaction             |
| transaction_date  | timestamp     | yes      | CURRENT_TIMESTAMP                                    | Transaction timestamp           |
| description       | text          | yes      | -                                                    | Transaction description         |
| photo             | varchar(255)  | yes      | -                                                    | Path to transaction photo       |
| completed_task_id | integer       | yes      | -                                                    | Reference to completed task     |

**Foreign Keys:**

- account_id REFERENCES piggybank_accounts(account_id) ON DELETE CASCADE
- completed_task_id REFERENCES completed_tasks(c_task_id)

## Relationships

1. Users can have one Piggy Bank Account (one-to-one)
2. Users can complete many Tasks (many-to-many through completed_tasks)
3. Piggy Bank Accounts can have many Transactions (one-to-many)
4. Completed Tasks can be linked to Transactions (one-to-many)

## Cascading Deletions

The following cascading deletions are configured:

- When a user is deleted, their completed tasks are deleted
- When a user is deleted, their piggy bank account is deleted
- When a piggy bank account is deleted, all its transactions are deleted
