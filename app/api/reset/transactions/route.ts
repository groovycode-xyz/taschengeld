import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const POST = createApiHandler(async (request) => {
  const { accountIds } = await request.json();

  // Use a transaction to ensure all operations complete together
  await prisma.$transaction(async (tx) => {
    if (accountIds && accountIds.length > 0) {
      // Delete transactions for specific accounts
      await tx.piggybankTransaction.deleteMany({
        where: {
          account_id: {
            in: accountIds,
          },
        },
      });

      // Reset balances to 0 for these accounts
      await tx.piggybankAccount.updateMany({
        where: {
          account_id: {
            in: accountIds,
          },
        },
        data: {
          balance: 0,
        },
      });
    } else {
      // If no accounts specified, reset all
      await tx.piggybankTransaction.deleteMany({});

      await tx.piggybankAccount.updateMany({
        data: {
          balance: 0,
        },
      });
    }
  });

  return successResponse({
    message: 'Transaction history has been reset successfully',
  });
});
