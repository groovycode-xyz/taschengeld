import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/app/lib/services/backup-service';
import { handleError } from '@/app/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const status = await BackupService.getBackupStatus();
    return NextResponse.json(status);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { threshold, enabled } = await request.json();

    if (threshold !== undefined) {
      await BackupService.updateReminderThreshold(threshold);
    }

    if (enabled !== undefined) {
      await BackupService.toggleReminder(enabled);
    }

    const status = await BackupService.getBackupStatus();
    return NextResponse.json(status);
  } catch (error) {
    return handleError(error);
  }
}
