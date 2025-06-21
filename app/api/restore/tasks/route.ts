import { prisma } from '@/app/lib/prisma';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { NextRequest } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';

interface RestoreTaskData {
  title: string;
  description?: string | null;
  icon_name?: string | null;
  sound_url?: string | null;
  payout_value: number | string | Decimal;
  is_active?: boolean | null;
}

interface RestoreTasksRequest {
  tasks: RestoreTaskData[];
}

export const POST = createApiHandler(async (request: NextRequest) => {
  const { tasks }: RestoreTasksRequest = await request.json();

  // Use a transaction to ensure all operations succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // Clear existing tasks (this will cascade delete related completed_tasks)
    await tx.completedTask.deleteMany();
    await tx.task.deleteMany();

    // Insert new tasks
    if (tasks && tasks.length > 0) {
      await tx.task.createMany({
        data: tasks.map((task: RestoreTaskData) => ({
          title: task.title,
          description: task.description,
          icon_name: task.icon_name,
          sound_url: task.sound_url,
          payout_value: task.payout_value,
          is_active: task.is_active ?? true,
        })),
      });
    }

    return successResponse({ message: 'Tasks restored successfully' });
  });
});
