import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createApiHandler } from '@/app/lib/api-utils';
import { BackupService } from '@/app/lib/services/backup-service';

export const GET = createApiHandler(async () => {
  // Get only essential task data
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

  // For completed tasks, we might want to keep some historical data
  // but exclude system-generated IDs
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

  // Update backup tracking before returning data
  await BackupService.updateBackupTracking();

  return NextResponse.json({
    tasks,
    completed_tasks: completedTasks,
  });
});
