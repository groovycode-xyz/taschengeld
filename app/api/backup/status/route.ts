import { NextResponse } from 'next/server';
import { createApiHandler } from '@/app/lib/api-utils';
import { BackupService } from '@/app/lib/services/backup-service';

export const GET = createApiHandler(async () => {
  const status = await BackupService.getBackupStatus();
  return NextResponse.json(status);
});

export const PUT = createApiHandler(async (request) => {
  const { threshold, enabled } = await request.json();

  if (threshold !== undefined) {
    await BackupService.updateReminderThreshold(threshold);
  }

  if (enabled !== undefined) {
    await BackupService.toggleReminder(enabled);
  }

  const status = await BackupService.getBackupStatus();
  return NextResponse.json(status);
});
