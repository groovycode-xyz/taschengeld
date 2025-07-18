import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { NextRequest } from 'next/server';

export const POST = createApiHandler(async (request: NextRequest) => {
  const data = await request.json();

  const { accounts, transactions } = data;
  if (!accounts) {
    throw new Error('No accounts data provided');
  }

  // Use a transaction to ensure all operations succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // First, set all piggybank_account_id to NULL in users table
    await tx.$executeRaw`UPDATE users SET piggybank_account_id = NULL`;

    // Clear existing accounts and transactions
    await tx.piggybankTransaction.deleteMany();
    await tx.piggybankAccount.deleteMany();

    // Store account mappings (old_id -> new_id)
    const accountMappings = new Map<number, number>();

    // First restore accounts
    for (const account of accounts) {
      let userId = account.user_id;

      // If no user_id but have user_name, try to find user_id
      if (!userId && account.user_name) {
        const user = await tx.user.findFirst({
          where: { name: account.user_name },
        });
        if (user) {
          userId = user.user_id;
        }
      }

      if (userId) {
        // Insert account with original account_number
        const createdAccount = await tx.piggybankAccount.create({
          data: {
            user_id: userId,
            account_number: account.account_number,
            balance: account.balance,
          },
        });

        // Store the mapping of old account_id to new account_id
        accountMappings.set(account.account_id, createdAccount.account_id);

        // Update the user's piggybank_account_id
        await tx.user.update({
          where: { user_id: userId },
          data: { piggybank_account_id: createdAccount.account_id },
        });
      }
    }

    // Then restore transactions
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        let accountId = accountMappings.get(transaction.account_id);

        // If no mapped account_id but have user_name, try to find account_id
        if (!accountId && transaction.user_name) {
          const account = await tx.piggybankAccount.findFirst({
            where: {
              user: {
                name: transaction.user_name,
              },
            },
          });
          if (account) {
            accountId = account.account_id;
          }
        }

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
        }
      }
    }

    return successResponse({ message: 'Piggy bank data restored successfully' });
  });
});
