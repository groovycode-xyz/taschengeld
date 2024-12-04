API Documentation

## Overview

This document describes all API endpoints in the Taschengeld application. Each endpoint's behavior, parameters, and response format are detailed below.

## Piggy Bank Endpoints

## GET /api/piggy-bank/dashboard

Retrieves all user accounts with their current balances and recent transactions.

Response Format:
PiggyBankUser[] // Array of user accounts with transactions

interface PiggyBankUser {
user_id: number;
name: string;
icon: string;
account: {
account_id: number;
account_number: string;
balance: string;
};
recent_transactions: {
transaction_id: number;
amount: string;
description: string;
transaction_date: string;
transaction_type: 'deposit' | 'withdrawal';
task_title?: string;
}[];
}

## POST /api/piggy-bank

Creates a new transaction (deposit or withdrawal) for a user's account.

Request Body:
{
account_id: number;
amount: number; // Positive for deposits, negative for withdrawals
transaction_type: 'deposit' | 'withdrawal';
description: string;
photo?: string | null; // Optional photo attachment
}

Response:

- 200: Transaction successful
- 400: Invalid request (e.g., insufficient funds)
- 500: Server error

## GET /api/piggy-bank/transactions

Retrieves transaction history for a specific account.

Query Parameters:

- account_id: number (required)
- limit?: number (optional, defaults to 10)
- offset?: number (optional, defaults to 0)

Response Format:
{
transactions: {
transaction_id: number;
amount: string;
description: string;
transaction_date: string;
transaction_type: 'deposit' | 'withdrawal';
task_title?: string;
}[];
total_count: number;
}

## Database Schema

piggybank_accounts:
CREATE TABLE piggybank_accounts (
account_id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(user_id),
account_number VARCHAR(20) NOT NULL UNIQUE,
balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT positive_balance CHECK (balance >= 0)
);

piggybank_transactions:
CREATE TABLE piggybank_transactions (
transaction_id SERIAL PRIMARY KEY,
account_id INTEGER NOT NULL REFERENCES piggybank_accounts(account_id),
amount DECIMAL(10,2) NOT NULL,
description TEXT,
transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
completed_task_id INTEGER REFERENCES completed_tasks(task_id),
photo TEXT
);

completed_tasks:
CREATE TABLE completed_tasks (
task_id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(user_id),
task_title VARCHAR(255) NOT NULL,
completion_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
payment_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid'))
);

Key Relationships:

- Each piggybank_account belongs to one user (via user_id)
- Each piggybank_transaction belongs to one account (via account_id)
- Transactions can optionally link to completed tasks (via completed_task_id)
- The payment_status in completed_tasks tracks which tasks have been paid through the piggy bank

Data Integrity:

- Account balances cannot be negative (enforced by CHECK constraint)
- Transaction types are restricted to 'deposit' or 'withdrawal'
- All monetary values use DECIMAL(10,2) for precision
- Timestamps include timezone information for global consistency

## Error Handling

All endpoints follow a consistent error response format:
{
error: string; // Human-readable error message
code: string; // Machine-readable error code
details?: unknown; // Optional additional error details
}

Common error codes:

- INSUFFICIENT_FUNDS: Withdrawal amount exceeds available balance
- INVALID_AMOUNT: Transaction amount is invalid (e.g., negative deposit)
- ACCOUNT_NOT_FOUND: Specified account does not exist
- DATABASE_ERROR: Internal database error occurred

## Rate Limiting

Currently not implemented. Future implementation planned.

## Authentication

All endpoints require authentication through the application's session middleware.
Unauthorized requests will receive a 401 response.

## Changelog

See CHANGELOG.md for API-related changes and updates.

## Database Queries

1. Dashboard Query (GET /api/piggy-bank/dashboard)

---

Purpose: Retrieves all user accounts with their recent transactions

Query:
WITH recent*transactions AS (
SELECT
t.*,
ct.task*title,
ROW_NUMBER() OVER (
PARTITION BY t.account_id
ORDER BY t.transaction_date DESC
) as rn
FROM piggybank_transactions t
LEFT JOIN completed_tasks ct ON t.completed_task_id = ct.task_id
WHERE t.transaction_date >= NOW() - INTERVAL '30 days'
)
SELECT
u.user_id,
u.name,
u.icon,
json_build_object(
'account_id', pa.account_id,
'account_number', pa.account_number,
'balance', pa.balance
) as account,
COALESCE(
json_agg(
rt.* ORDER BY rt.transaction_date DESC
) FILTER (WHERE rt.rn <= 5),
'[]'::json
) as recent_transactions
FROM users u
JOIN piggybank_accounts pa ON u.user_id = pa.user_id
LEFT JOIN recent_transactions rt ON pa.account_id = rt.account_id
GROUP BY u.user_id, u.name, u.icon, pa.account_id, pa.account_number, pa.balance;

Parameters: None
Returns: Array of user accounts with their 5 most recent transactions

2. Transaction Creation (POST /api/piggy-bank)

---

Purpose: Creates a new transaction and updates account balance

Query:
BEGIN;
-- Update account balance
UPDATE piggybank_accounts
SET balance = balance + $1
WHERE account_id = $2
RETURNING balance;

        -- Create transaction record
        INSERT INTO piggybank_transactions (
            account_id,
            amount,
            description,
            transaction_type,
            completed_task_id,
            photo
        ) VALUES (
            $2,    -- account_id
            $1,    -- amount
            $3,    -- description
            $4,    -- transaction_type
            $5,    -- completed_task_id
            $6     -- photo
        );
    COMMIT;

Parameters:
$1: amount (DECIMAL) - Transaction amount (positive for deposits, negative for withdrawals)
$2: account_id (INTEGER) - Target account ID
$3: description (TEXT) - Transaction description
$4: transaction_type (VARCHAR) - Either 'deposit' or 'withdrawal'
$5: completed_task_id (INTEGER, optional) - Related task ID if applicable
$6: photo (TEXT, optional) - Base64 encoded photo data

3. Transaction History Query (GET /api/piggy-bank/transactions)

---

Purpose: Retrieves paginated transaction history for an account

Query:
SELECT
t.\*,
ct.task_title
FROM piggybank_transactions t
LEFT JOIN completed_tasks ct ON t.completed_task_id = ct.task_id
WHERE t.account_id = $1
ORDER BY t.transaction_date DESC
LIMIT $2 OFFSET $3;

Parameters:
$1: account_id (INTEGER) - Account to fetch transactions for
$2: limit (INTEGER) - Number of transactions to return
$3: offset (INTEGER) - Number of transactions to skip
