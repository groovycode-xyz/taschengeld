import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const POST = createApiHandler(async () => {
  // Use a transaction to ensure all operations complete together
  await prisma.$transaction(async (tx) => {
    // Delete all completed tasks first (due to foreign key constraint)
    await tx.completedTask.deleteMany({});

    // Then delete all tasks
    await tx.task.deleteMany({});
  });

  return successResponse({ message: 'All tasks have been reset successfully' });
});
