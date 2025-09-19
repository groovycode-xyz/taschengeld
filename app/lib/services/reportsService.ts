import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';

export type TimePeriod =
  | 'all'
  | 'today'
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month'
  | 'ytd';

export interface TransactionSummary {
  period: string;
  earned: number;
  spent: number;
}

export interface BalancePoint {
  date: string;
  balance: number;
}

export interface UserStats {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  savingsRate: number;
}

export interface UserTransactionReport {
  user_id: number;
  name: string;
  icon: string;
  transactions: TransactionSummary[];
  balanceHistory: BalancePoint[];
  stats: UserStats;
}

export const reportsService = {
  getDateRangeFilter(period: TimePeriod): { start: Date | null; end: Date | null } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        };

      case 'this-week': {
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);
        return { start: monday, end: null };
      }

      case 'last-week': {
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const thisMonday = new Date(today);
        thisMonday.setDate(today.getDate() - daysToMonday);
        const lastMonday = new Date(thisMonday);
        lastMonday.setDate(thisMonday.getDate() - 7);
        return { start: lastMonday, end: thisMonday };
      }

      case 'this-month':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: null,
        };

      case 'last-month': {
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: firstDayLastMonth, end: firstDayThisMonth };
      }

      case 'ytd':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: null,
        };

      case 'all':
      default:
        return { start: null, end: null };
    }
  },
  async getUserTransactionSummary(userId: number): Promise<TransactionSummary[]> {
    const transactions = await prisma.piggybankTransaction.findMany({
      where: {
        account: {
          user_id: userId,
        },
      },
      orderBy: {
        transaction_date: 'asc',
      },
    });

    return this.aggregateTransactionsByPeriod(transactions);
  },

  aggregateTransactionsByPeriod(transactions: any[]): TransactionSummary[] {
    const dailyData = new Map<string, { earned: number; spent: number }>();

    transactions.forEach((transaction) => {
      if (!transaction.transaction_date) return;

      const date = new Date(transaction.transaction_date);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const amount = Number(transaction.amount);

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, { earned: 0, spent: 0 });
      }

      const dayData = dailyData.get(dateKey)!;

      if (transaction.transaction_type === 'deposit' || transaction.transaction_type === 'payday') {
        dayData.earned += amount;
      } else if (transaction.transaction_type === 'withdrawal') {
        dayData.spent += amount;
      }
    });

    const summaries: TransactionSummary[] = Array.from(dailyData.entries())
      .map(([period, data]) => ({
        period,
        earned: data.earned,
        spent: data.spent,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Only show last 30 days for the bar chart
    const last30Days = summaries.slice(-30);

    return last30Days;
  },

  calculateBalanceHistory(transactions: any[]): BalancePoint[] {
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = a.transaction_date ? new Date(a.transaction_date).getTime() : 0;
      const dateB = b.transaction_date ? new Date(b.transaction_date).getTime() : 0;
      return dateA - dateB;
    });

    let runningBalance = 0;
    const balanceHistory: BalancePoint[] = [];

    sortedTransactions.forEach((transaction) => {
      if (!transaction.transaction_date) return;

      const amount = Number(transaction.amount);
      if (transaction.transaction_type === 'deposit' || transaction.transaction_type === 'payday') {
        runningBalance += amount;
      } else if (transaction.transaction_type === 'withdrawal') {
        runningBalance -= amount;
      }

      const date = new Date(transaction.transaction_date);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      balanceHistory.push({
        date: dateKey,
        balance: runningBalance,
      });
    });

    return balanceHistory;
  },

  calculateStats(transactions: any[], currentAccountBalance?: number): UserStats {
    let totalEarned = 0;
    let totalSpent = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.transaction_type === 'deposit' || transaction.transaction_type === 'payday') {
        totalEarned += amount;
      } else if (transaction.transaction_type === 'withdrawal') {
        totalSpent += amount;
      }
    });

    const currentBalance =
      currentAccountBalance !== undefined
        ? Number(currentAccountBalance)
        : totalEarned - totalSpent;
    const savingsRate = totalEarned > 0 ? (currentBalance / totalEarned) * 100 : 0;

    return {
      totalEarned,
      totalSpent,
      currentBalance,
      savingsRate: Math.max(0, Math.min(100, savingsRate)), // Clamp between 0 and 100
    };
  },

  calculateStatsForPeriod(transactions: any[], currentAccountBalance: number): UserStats {
    let totalEarned = 0;
    let totalSpent = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.transaction_type === 'deposit' || transaction.transaction_type === 'payday') {
        totalEarned += amount;
      } else if (transaction.transaction_type === 'withdrawal') {
        totalSpent += amount;
      }
    });

    // For filtered periods, savings rate is based on the period's activity
    const periodNet = totalEarned - totalSpent;
    const savingsRate = totalEarned > 0 ? (periodNet / totalEarned) * 100 : 0;

    return {
      totalEarned,
      totalSpent,
      currentBalance: currentAccountBalance, // Always show actual current balance
      savingsRate: Math.max(0, Math.min(100, savingsRate)),
    };
  },

  async getAllUsersTransactionReports(
    period: TimePeriod = 'all'
  ): Promise<UserTransactionReport[]> {
    const dateRange = this.getDateRangeFilter(period);

    const whereClause: any = {};
    if (dateRange.start || dateRange.end) {
      whereClause.transaction_date = {};
      if (dateRange.start) {
        whereClause.transaction_date.gte = dateRange.start;
      }
      if (dateRange.end) {
        whereClause.transaction_date.lt = dateRange.end;
      }
    }

    const users = await prisma.user.findMany({
      include: {
        piggybank_accounts: {
          include: {
            transactions: {
              where: whereClause,
              orderBy: {
                transaction_date: 'asc',
              },
            },
          },
        },
      },
    });

    const reports: UserTransactionReport[] = [];

    for (const user of users) {
      const allTransactions = user.piggybank_accounts.flatMap((account) => account.transactions);

      // Get the current balance from the piggybank accounts
      const currentAccountBalance = user.piggybank_accounts.reduce((sum, account) => {
        return sum + Number(account.balance);
      }, 0);

      // For time-filtered views, we need to calculate stats based on the filtered transactions
      // but still show the actual current balance
      const transactions = this.aggregateTransactionsByPeriod(allTransactions);
      const balanceHistory = this.calculateBalanceHistory(allTransactions);
      const stats =
        period === 'all'
          ? this.calculateStats(allTransactions, currentAccountBalance)
          : this.calculateStatsForPeriod(allTransactions, currentAccountBalance);

      reports.push({
        user_id: user.user_id,
        name: user.name,
        icon: user.icon || '👤',
        transactions,
        balanceHistory,
        stats,
      });
    }

    return reports;
  },
};
