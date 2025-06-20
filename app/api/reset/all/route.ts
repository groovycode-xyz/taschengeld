import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const POST = createApiHandler(async () => {
  // Delete all data in the correct order to respect foreign key constraints
  await prisma.$transaction(async (tx) => {
    // Delete dependent tables first
    await tx.piggybankTransaction.deleteMany({});
    await tx.completedTask.deleteMany({});
    await tx.piggybankAccount.deleteMany({});
    await tx.task.deleteMany({});
    await tx.user.deleteMany({});
  });

  return successResponse({ message: 'All data has been reset successfully' });
});
