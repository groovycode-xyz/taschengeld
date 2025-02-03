# Payment System

This document describes the payment and reward system functionality in Taschengeld.

## Overview

The payment system manages task rewards, allowances, and balance tracking for children's accounts.

## Account Types

### Child Account

```typescript
interface ChildAccount {
  id: number;
  userId: number;
  balance: number; // in cents
  pendingBalance: number;
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
}
```

### Parent Account

```typescript
interface ParentAccount {
  id: number;
  userId: number;
  childAccounts: number[]; // Child account IDs
  paymentMethods: PaymentMethod[];
  transactionHistory: Transaction[];
}
```

## Transaction Types

### Task Rewards

```typescript
interface TaskReward {
  type: 'task_reward';
  taskId: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  completedAt: Date;
  verifiedAt?: Date;
}
```

### Regular Allowance

```typescript
interface Allowance {
  type: 'allowance';
  amount: number;
  frequency: 'weekly' | 'monthly';
  nextPaymentDate: Date;
  lastPaymentDate?: Date;
}
```

### Bonus Payments

```typescript
interface Bonus {
  type: 'bonus';
  amount: number;
  reason: string;
  approvedBy: number; // Parent user ID
  createdAt: Date;
}
```

## Payment Processing

### Transaction Flow

1. Transaction initiated
2. Amount validation
3. Balance check
4. Processing
5. Balance update
6. Notification
7. Record keeping

### Processing States

```typescript
type TransactionState =
  | 'initiated'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reversed';
```

## Balance Management

### Balance Operations

```typescript
interface BalanceOperations {
  credit(amount: number): Promise<Transaction>;
  debit(amount: number): Promise<Transaction>;
  hold(amount: number): Promise<void>;
  release(holdId: string): Promise<void>;
  transfer(toAccount: number, amount: number): Promise<Transaction>;
}
```

### Balance Calculations

```typescript
interface BalanceCalculator {
  getCurrentBalance(): number;
  getPendingBalance(): number;
  getAvailableBalance(): number;
  getProjectedBalance(date: Date): number;
}
```

## Savings Goals

### Goal Structure

```typescript
interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  contributions: Contribution[];
}
```

### Goal Features

- Progress tracking
- Auto-contributions
- Parent matching
- Achievement rewards
- Goal sharing

## Payment Schedule

### Allowance Schedule

```typescript
interface AllowanceSchedule {
  frequency: 'weekly' | 'monthly';
  amount: number;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  startDate: Date;
  endDate?: Date;
}
```

### Payment Rules

- Regular payment times
- Minimum balances
- Maximum limits
- Cooling periods
- Hold durations

## Reward System

### Basic Rewards

- Task completion
- Goal achievement
- Bonus payments
- Special occasions
- Milestone rewards

### Bonus System

```typescript
interface BonusSystem {
  calculateBonus(baseAmount: number): number;
  applyMultiplier(streak: number): number;
  checkEligibility(userId: number): boolean;
}
```

## Transaction History

### Transaction Record

```typescript
interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  fromAccount: number;
  toAccount: number;
  status: TransactionState;
  metadata: TransactionMetadata;
  createdAt: Date;
  updatedAt: Date;
}
```

### History Features

- Filtering options
- Export capability
- Search functionality
- Categorization
- Analytics

## Payment Analytics

### Transaction Analytics

- Payment patterns
- Spending trends
- Saving rates
- Goal progress
- Category breakdown

### Reports

- Monthly statements
- Earnings reports
- Goal tracking
- Tax summaries
- Activity logs

## Security Measures

### Transaction Security

- Amount limits
- Velocity checks
- Fraud detection
- Error handling
- Audit trails

### Access Control

- Parent approval
- Child restrictions
- System limits
- Role permissions
- Action logging

## Integration Points

### API Endpoints

- `POST /api/transactions` - Create transaction
- `GET /api/accounts/:id/balance` - Get balance
- `POST /api/goals` - Create savings goal
- `PUT /api/transactions/:id` - Update transaction
- `GET /api/reports` - Generate reports

### External Systems

- Banking systems
- Payment processors
- Notification services
- Analytics platforms
- Backup services

## Notifications

### Event Types

- Transaction completed
- Balance updates
- Goal progress
- Payment due
- Reward earned

### Delivery Methods

- In-app notifications
- Email alerts
- Push notifications
- SMS (optional)
- Weekly summaries

## Error Handling

### Common Errors

1. Insufficient funds
2. Invalid amount
3. Account restrictions
4. Processing failure
5. System limits

### Resolution Steps

1. Error notification
2. Automatic retry
3. Manual review
4. User notification
5. System logging

## Best Practices

### Payment Processing

1. Validate amounts
2. Check balances
3. Handle errors
4. Maintain records
5. Notify users

### Account Management

1. Regular audits
2. Balance reconciliation
3. Limit monitoring
4. Security checks
5. Data backup

## Additional Resources

1. [API Reference](../2-architecture/api-reference.md)
2. [User Management](user-management.md)
3. [Task Management](task-management.md)
4. [Security Guidelines](../2-architecture/security.md)

Last Updated: December 4, 2024
