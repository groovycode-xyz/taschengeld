import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { NextRequest } from 'next/server';

export const POST = createApiHandler(async (request: NextRequest) => {
  const { users } = await request.json();

  // Use a transaction to ensure all operations succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // Clear existing users (this will cascade delete related data)
    await tx.piggybankTransaction.deleteMany();
    await tx.completedTask.deleteMany();
    await tx.piggybankAccount.deleteMany();
    await tx.user.deleteMany();

    // Insert new users
    if (users && users.length > 0) {
      await tx.user.createMany({
        data: users.map((user: any) => ({
          name: user.name,
          icon: user.icon,
          sound_url: user.soundurl || user.sound_url, // Handle both field names
          birthday: new Date(user.birthday),
        })),
      });
    }

    return successResponse({ message: 'Users restored successfully' });
  });
});
