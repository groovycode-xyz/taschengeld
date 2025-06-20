import { settingsService } from '@/app/lib/services/settingsService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const dynamic = 'force-dynamic';

export const GET = createApiHandler(async () => {
  // Try to get a setting to verify database connection
  await settingsService.getSetting('enforce_roles');
  return successResponse({ status: 'ok' });
});
