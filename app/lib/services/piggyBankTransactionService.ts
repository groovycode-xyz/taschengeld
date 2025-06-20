import { prisma } from '@/app/lib/prisma';
import { PiggyBankTransaction, CreateTransactionInput } from '@/app/types/piggyBankTransaction';
import { Prisma } from '@prisma/client';

export const piggyBankTransactionService = {
  async create(input: CreateTransactionInput): Promise<PiggyBankTransaction> {
    // First, get the account for this user
    const account = await prisma.piggybankAccount.findFirst({
      where: { user_id: input.user_id },
    });

    if (!account) {
      throw new Error('No piggy bank account found for this user');
    }

    // Create the transaction
    const transaction = await prisma.piggybankTransaction.create({
      data: {
        account_id: account.account_id,
        amount: new Prisma.Decimal(input.amount),
        transaction_type: input.transaction_type,
        description: input.description,
        photo: input.photo,
      },
    });

    // Update account balance
    if (input.transaction_type === 'deposit' || input.transaction_type === 'payday') {
      await prisma.piggybankAccount.update({
        where: { account_id: account.account_id },
        data: {
          balance: {
            increment: input.amount,
          },
        },
      });
    } else if (input.transaction_type === 'withdrawal') {
      await prisma.piggybankAccount.update({
        where: { account_id: account.account_id },
        data: {
          balance: {
            decrement: input.amount,
          },
        },
      });
    }

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
};
