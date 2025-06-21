import { prisma } from '@/app/lib/prisma';
import { logger } from '@/app/lib/logger';
import { TransactionType } from '@/app/types/piggyBankTransaction';

interface DashboardData {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalPaydays: number;
  recentTransactions: Array<{
    transaction_id: number;
    account_id: number;
    amount: number;
    transaction_type: string;
    transaction_date: Date | null;
    description: string | null;
    user_name: string;
    user_icon: string;
  }>;
  accountBalances: Array<{
    account_id: number;
    user_id: number | null;
    user_name: string;
    user_icon: string;
    balance: number;
  }>;
}

export const piggyBankDashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    logger.debug('getDashboardData called');

    // Get all accounts with user info, ordered by user_id for consistent display
    const accounts = await prisma.piggybankAccount.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user_id: 'asc',
      },
    });

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

    // Get all transactions
    const transactions = await prisma.piggybankTransaction.findMany({
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { transaction_date: 'desc' },
      take: 10,
    });

    // Calculate totals by type
    const totalsByType = await prisma.piggybankTransaction.groupBy({
      by: ['transaction_type'],
      _sum: {
        amount: true,
      },
    });

    const totals = totalsByType.reduce(
      (acc, item) => {
        acc[item.transaction_type] = Number(item._sum.amount || 0);
        return acc;
      },
      {} as Record<string, number>
    );

    // Format recent transactions
    const recentTransactions = transactions.map((t) => ({
      transaction_id: t.transaction_id,
      account_id: t.account_id,
      amount: Number(t.amount),
      transaction_type: t.transaction_type as TransactionType,
      transaction_date: t.transaction_date,
      description: t.description,
      user_name: t.account.user?.name || 'Unknown',
      user_icon: t.account.user?.icon || '👤',
    }));

    // Format account balances
    const accountBalances = accounts.map((account) => ({
      account_id: account.account_id,
      user_id: account.user_id,
      user_name: account.user?.name || 'Unknown',
      user_icon: account.user?.icon || '👤',
      balance: Number(account.balance),
    }));

    return {
      totalBalance,
      totalDeposits: totals['deposit'] || 0,
      totalWithdrawals: totals['withdrawal'] || 0,
      totalPaydays: totals['payday'] || 0,
      recentTransactions,
      accountBalances,
    };
  },
};
