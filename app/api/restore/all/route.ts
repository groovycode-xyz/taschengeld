import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { NextRequest } from 'next/server';

export const POST = createApiHandler(async (request: NextRequest) => {
  const { users, tasks, completed_tasks, accounts, transactions } = await request.json();
  console.log(
    'Received data for restore:',
    JSON.stringify({ users, tasks, completed_tasks, accounts, transactions }, null, 2)
  );

  // Use a transaction to ensure all operations succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // First, set all piggybank_account_id to NULL in users table
    await tx.$executeRaw`UPDATE users SET piggybank_account_id = NULL`;

    // Clear all existing data
    await tx.piggybankTransaction.deleteMany();
    await tx.completedTask.deleteMany();
    await tx.piggybankAccount.deleteMany();
    await tx.task.deleteMany();
    await tx.user.deleteMany();

    // Store ID mappings
    const userMappings = new Map<string, number>();
    const taskMappings = new Map<string, number>();
    const accountMappings = new Map<string, number>();

    // Restore users
    console.log('Restoring users...');
    for (const user of users) {
      const createdUser = await tx.user.create({
        data: {
          name: user.name,
          icon: user.icon,
          sound_url: user.sound_url,
          birthday: new Date(user.birthday),
        },
      });
      userMappings.set(user.name, createdUser.user_id);
    }

    // Restore tasks
    console.log('Restoring tasks...');
    for (const task of tasks) {
      const createdTask = await tx.task.create({
        data: {
          title: task.title,
          description: task.description,
          icon_name: task.icon_name,
          sound_url: task.sound_url,
          payout_value: task.payout_value,
          is_active: task.is_active,
        },
      });
      taskMappings.set(task.title, createdTask.task_id);
    }

    // Restore accounts
    console.log('Restoring accounts...');
    for (const account of accounts) {
      const userId = userMappings.get(account.user_name);
      if (userId) {
        const createdAccount = await tx.piggybankAccount.create({
          data: {
            user_id: userId,
            account_number: account.account_number,
            balance: account.balance,
          },
        });
        accountMappings.set(account.account_number, createdAccount.account_id);

        // Update the user's piggybank_account_id
        await tx.user.update({
          where: { user_id: userId },
          data: { piggybank_account_id: createdAccount.account_id },
        });
      } else {
        console.log(`Warning: No user found for account with user_name: ${account.user_name}`);
      }
    }

    // Restore completed tasks
    console.log('Restoring completed tasks...');
    if (completed_tasks && completed_tasks.length > 0) {
      for (const ct of completed_tasks) {
        // Find the user ID from the user_id directly
        const userId = ct.user_id;

        // For completed tasks, we'll match by description since we don't have task_title
        const task = await tx.task.findFirst({
          where: { description: ct.description },
        });
        const taskId = task?.task_id;

        if (userId && taskId) {
          await tx.completedTask.create({
            data: {
              user_id: userId,
              task_id: taskId,
              description: ct.description,
              payout_value: ct.payout_value,
              comment: ct.comment,
              attachment: ct.attachment,
              payment_status: ct.payment_status,
            },
          });
        } else {
          console.log(
            `Warning: Could not restore completed task. User ID: ${userId}, Task Description: ${ct.description}`
          );
        }
      }
    }

    // Restore transactions
    console.log('Restoring transactions...');
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        // Find the account through the user_name
        const account = await tx.piggybankAccount.findFirst({
          where: {
            user: {
              name: transaction.user_name,
            },
          },
        });
        const accountId = account?.account_id;

        if (accountId) {
          await tx.piggybankTransaction.create({
            data: {
              account_id: accountId,
              amount: transaction.amount,
              transaction_type: transaction.transaction_type,
              description: transaction.description,
              photo: transaction.photo,
              transaction_date: transaction.transaction_date
                ? new Date(transaction.transaction_date)
                : new Date(),
            },
          });
        } else {
          console.log(
            `Warning: No account found for transaction with user_name: ${transaction.user_name}`
          );
        }
      }
    }

    return successResponse({ message: 'All data restored successfully' });
  });
});
