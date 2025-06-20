import { prisma } from '@/app/lib/prisma';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { Prisma } from '@prisma/client';

export const piggyBankAccountService = {
  async createAccount(
    userId: number,
    accountNumber: string,
    tx?: Prisma.TransactionClient
  ): Promise<PiggyBankAccount> {
    const db = tx || prisma;

    const account = await db.piggybankAccount.create({
      data: {
        user_id: userId,
        account_number: accountNumber,
        balance: 0,
      },
    });

    return {
      account_id: account.account_id,
      user_id: account.user_id,
      account_number: account.account_number,
      balance: Number(account.balance),
      created_at: account.created_at,
    };
  },

  async getByUserId(userId: number): Promise<PiggyBankAccount | null> {
    const account = await prisma.piggybankAccount.findFirst({
      where: { user_id: userId },
    });

    if (!account) return null;

    return {
      account_id: account.account_id,
      user_id: account.user_id,
      account_number: account.account_number,
      balance: Number(account.balance),
      created_at: account.created_at,
    };
  },

  async getById(accountId: number): Promise<PiggyBankAccount | null> {
    const account = await prisma.piggybankAccount.findUnique({
      where: { account_id: accountId },
    });

    if (!account) return null;

    return {
      account_id: account.account_id,
      user_id: account.user_id,
      account_number: account.account_number,
      balance: Number(account.balance),
      created_at: account.created_at,
    };
  },

  async updateBalance(
    accountId: number,
    amount: number,
    operation: 'increment' | 'decrement' | 'set'
  ): Promise<PiggyBankAccount> {
    let updateData: Prisma.PiggybankAccountUpdateInput;

    if (operation === 'set') {
      updateData = { balance: amount };
    } else if (operation === 'increment') {
      updateData = { balance: { increment: amount } };
    } else {
      updateData = { balance: { decrement: amount } };
    }

    const account = await prisma.piggybankAccount.update({
      where: { account_id: accountId },
      data: updateData,
    });

    return {
      account_id: account.account_id,
      user_id: account.user_id,
      account_number: account.account_number,
      balance: Number(account.balance),
      created_at: account.created_at,
    };
  },

  async getAllAccounts(): Promise<PiggyBankAccount[]> {
    const accounts = await prisma.piggybankAccount.findMany({
      include: {
        user: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return accounts.map((account) => ({
      account_id: account.account_id,
      user_id: account.user_id,
      account_number: account.account_number,
      balance: Number(account.balance),
      created_at: account.created_at,
      user_name: account.user?.name,
      user_icon: account.user?.icon,
    }));
  },
};
