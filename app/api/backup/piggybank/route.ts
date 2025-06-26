import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { BackupService } from '@/app/lib/services/backup-service';
import { handleError } from '@/app/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
  // Get accounts data with user information
  const accounts = await prisma.piggybankAccount.findMany({
    select: {
      account_id: true,
      account_number: true,
      balance: true,
      user_id: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { user: { name: 'asc' } },
  });

  // Transform accounts data to match expected format
  const accountsData = accounts.map((account) => ({
    account_id: account.account_id,
    account_number: account.account_number,
    balance: account.balance,
    user_id: account.user_id,
    user_name: account.user?.name || 'Unknown',
  }));

  // Get transactions data
  const transactions = await prisma.piggybankTransaction.findMany({
    select: {
      amount: true,
      transaction_type: true,
      description: true,
      photo: true,
      transaction_date: true,
      account: {
        select: {
          account_id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { transaction_date: 'desc' },
  });

  // Transform transactions data to match expected format
  const transactionsData = transactions.map((transaction) => ({
    amount: transaction.amount,
    transaction_type: transaction.transaction_type,
    description: transaction.description,
    photo: transaction.photo,
    user_name: transaction.account.user?.name || 'Unknown',
    transaction_date: transaction.transaction_date,
    account_id: transaction.account.account_id,
  }));

  // Update backup tracking before returning data
  await BackupService.updateBackupTracking();

    return NextResponse.json({
      accounts: accountsData,
      transactions: transactionsData,
    });
  } catch (error) {
    return handleError(error);
  }
}
