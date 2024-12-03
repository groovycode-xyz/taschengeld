# Database Schema and Design

## Overview
The application uses PostgreSQL as its database system. The schema is designed to support task management, user roles, and piggy bank functionality with a focus on data integrity and consistency.

## Tables

### users
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  soundurl VARCHAR(255),
  birthday TIMESTAMP WITH TIME ZONE,
  role VARCHAR(10) CHECK (role IN ('parent', 'child')),
  piggybank_account_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_piggybank_account 
    FOREIGN KEY (piggybank_account_id) 
    REFERENCES piggybank_accounts(account_id)
);
```

### tasks
```sql
CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  sound_url VARCHAR(255),
  payout_value NUMERIC(15,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### completed_tasks
```sql
CREATE TABLE completed_tasks (
  c_task_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  description TEXT,
  payout_value NUMERIC(15,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  comment TEXT,
  attachment VARCHAR(255),
  payment_status VARCHAR(10) CHECK (payment_status IN ('Paid', 'Unpaid')),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);
```

### piggybank_accounts
```sql
CREATE TABLE piggybank_accounts (
  account_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  balance NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### piggybank_transactions
```sql
CREATE TABLE piggybank_transactions (
  transaction_id SERIAL PRIMARY KEY,
  account_id INTEGER,
  amount NUMERIC(15,2) NOT NULL,
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('deposit', 'withdrawal')),
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  photo VARCHAR(255),
  completed_task_id INTEGER,
  FOREIGN KEY (account_id) REFERENCES piggybank_accounts(account_id) ON DELETE CASCADE,
  FOREIGN KEY (completed_task_id) REFERENCES completed_tasks(c_task_id) ON DELETE SET NULL
);
```

### app_settings
```sql
CREATE TABLE app_settings (
  setting_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Key Features

### Data Integrity
- All timestamps use `TIMESTAMP WITH TIME ZONE` for consistent timezone handling
- Numeric values use standardized precision (15,2) for currency amounts
- Foreign key constraints ensure referential integrity
- Check constraints enforce valid values for status fields

### Circular References
The schema handles a circular reference between `users` and `piggybank_accounts`:
1. `users.piggybank_account_id` references `piggybank_accounts(account_id)`
2. `piggybank_accounts.user_id` references `users(user_id)`

This is managed during backup/restore operations by:
1. Temporarily disabling the foreign key constraint
2. Performing the restore in the correct order
3. Re-establishing the constraint

### Backup and Restore
The database supports full and partial backup/restore operations:
- Tasks backup: Tasks and completed tasks
- Piggybank backup: Accounts and transactions
- Full system backup: All tables with proper relationship handling

### Cascading Deletes
- Deleting a user cascades to their completed tasks and piggybank account
- Deleting a task cascades to its completed tasks
- Deleting an account cascades to its transactions
- Completed task deletion sets related transaction references to NULL

### Status Constraints
- Payment status: Limited to 'Paid' or 'Unpaid'
- Transaction type: Limited to 'deposit' or 'withdrawal'
- User role: Limited to 'parent' or 'child'

## TypeScript Integration
The database schema is reflected in TypeScript interfaces (see `types/database.ts`), ensuring type safety throughout the application. These types are used for:
- API request/response typing
- Data validation
- Backup/restore operations

## Migrations
Database changes are managed through numbered migration files in the `migrations/` directory. The current schema was standardized in `001_schema_consistency.sql`, which:
1. Standardized timestamp fields
2. Fixed numeric precision
3. Added proper constraints
4. Cleaned up status values
