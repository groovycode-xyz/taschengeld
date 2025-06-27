import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { BackupService } from '@/app/lib/services/backup-service';
import { handleError } from '@/app/lib/error-handler';

export async function GET(_request: NextRequest) {
  try {
    // Get users data
    const users = await prisma.user.findMany({
      select: {
        name: true,
        icon: true,
        sound_url: true,
        birthday: true,
      },
      orderBy: { name: 'asc' },
    });

    // Get tasks data
    const tasks = await prisma.task.findMany({
      select: {
        title: true,
        description: true,
        icon_name: true,
        sound_url: true,
        payout_value: true,
        is_active: true,
      },
      orderBy: { title: 'asc' },
    });

    // Get completed tasks data
    const completedTasks = await prisma.completedTask.findMany({
      select: {
        user_id: true,
        description: true,
        payout_value: true,
        comment: true,
        attachment: true,
        payment_status: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // Get accounts data
    const accounts = await prisma.piggybankAccount.findMany({
      select: {
        account_number: true,
        balance: true,
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
      account_number: account.account_number,
      balance: account.balance,
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
    }));

    // Update backup tracking before returning data
    await BackupService.updateBackupTracking();

    return NextResponse.json({
      users,
      tasks,
      completed_tasks: completedTasks,
      accounts: accountsData,
      transactions: transactionsData,
    });
  } catch (error) {
    return handleError(error);
  }
}
