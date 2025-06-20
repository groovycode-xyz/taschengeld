import { NextRequest, NextResponse } from 'next/server';
import { settingsService } from '@/app/lib/services/settingsService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { updateSettingsSchema } from '@/app/lib/validation/schemas';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await settingsService.getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    logger.error('Error fetching settings', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Validate request body
  const validation = await validateRequest(request, updateSettingsSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const { setting_key, setting_value } = validation.data;

    await settingsService.updateSetting(setting_key, setting_value);
    return NextResponse.json({ message: 'Setting updated successfully' });
  } catch (error) {
    logger.error('Error updating setting', error);
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
