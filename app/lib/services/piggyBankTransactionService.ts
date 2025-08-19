import { prisma } from '@/app/lib/prisma';
import {
  PiggyBankTransaction,
  CreateTransactionInput,
  TransactionType,
} from '@/app/types/piggyBankTransaction';
import { Prisma } from '@prisma/client';

export const piggyBankTransactionService = {
  async create(input: CreateTransactionInput): Promise<PiggyBankTransaction> {
    // Use a database transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // First verify the account exists
      const account = await tx.piggybankAccount.findUnique({
        where: { account_id: input.account_id },
      });

      if (!account) {
        throw new Error('Account not found');
      }

      // For withdrawals, check if sufficient balance
      if (input.transaction_type === 'withdrawal' && Number(account.balance) < input.amount) {
        throw new Error('Insufficient balance');
      }

      // Create the transaction
      const transaction = await tx.piggybankTransaction.create({
        data: {
          account_id: input.account_id,
          amount: new Prisma.Decimal(input.amount),
          transaction_type: input.transaction_type,
          description: input.description,
          photo: input.photo,
          completed_task_id: input.completed_task_id,
        },
      });

      // Update account balance atomically
      if (input.transaction_type === 'deposit' || input.transaction_type === 'payday') {
        await tx.piggybankAccount.update({
          where: { account_id: input.account_id },
          data: {
            balance: {
              increment: input.amount,
            },
          },
        });
      } else if (input.transaction_type === 'withdrawal') {
        await tx.piggybankAccount.update({
          where: { account_id: input.account_id },
          data: {
            balance: {
              decrement: input.amount,
            },
          },
        });
      }

      return transaction;
    });

    return {
      transaction_id: result.transaction_id,
      account_id: result.account_id,
      amount: Number(result.amount),
      transaction_type: result.transaction_type as TransactionType,
      transaction_date: result.transaction_date,
      description: result.description,
      photo: result.photo,
      completed_task_id: result.completed_task_id,
    };
  },

  async getTransactionsByAccountId(accountId: number): Promise<PiggyBankTransaction[]> {
    const transactions = await prisma.piggybankTransaction.findMany({
      where: { account_id: accountId },
      orderBy: { transaction_date: 'desc' },
    });

    return transactions.map((t) => ({
      transaction_id: t.transaction_id,
      account_id: t.account_id,
      amount: Number(t.amount),
      transaction_type: t.transaction_type as TransactionType,
      transaction_date: t.transaction_date,
      description: t.description,
      photo: t.photo,
      completed_task_id: t.completed_task_id,
    }));
  },

  async getTransactionsByUserId(userId: number): Promise<PiggyBankTransaction[]> {
    const account = await prisma.piggybankAccount.findFirst({
      where: { user_id: userId },
    });

    if (!account) {
      return [];
    }

    return this.getTransactionsByAccountId(account.account_id);
  },

  async getUserBalance(userId: number): Promise<number> {
    const account = await prisma.piggybankAccount.findFirst({
      where: { user_id: userId },
    });

    if (!account) {
      return 0;
    }

    return Number(account.balance);
  },

  async clearAllTransactions(): Promise<void> {
    // Clear all transactions and reset balances
    await prisma.$transaction([
      prisma.piggybankTransaction.deleteMany({}),
      prisma.piggybankAccount.updateMany({
        data: { balance: 0 },
      }),
    ]);
  },

  // Create transaction record only (no balance update) - for external services like savings goals
  async createTransactionOnly(
    input: CreateTransactionInput,
    tx?: Prisma.TransactionClient
  ): Promise<PiggyBankTransaction> {
    const client = tx || prisma;

    const transaction = await client.piggybankTransaction.create({
      data: {
        account_id: input.account_id,
        amount: new Prisma.Decimal(input.amount),
        transaction_type: input.transaction_type,
        description: input.description,
        photo: input.photo,
        completed_task_id: input.completed_task_id,
      },
    });

    return {
      transaction_id: transaction.transaction_id,
      account_id: transaction.account_id,
      amount: Number(transaction.amount),
      transaction_type: transaction.transaction_type as TransactionType,
      transaction_date: transaction.transaction_date,
      description: transaction.description,
      photo: transaction.photo,
      completed_task_id: transaction.completed_task_id,
    };
  },
};
