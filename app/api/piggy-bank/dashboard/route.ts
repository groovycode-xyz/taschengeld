import { piggyBankDashboardService } from '@/app/lib/services/piggyBankDashboardService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const dynamic = 'force-dynamic';

export const GET = createApiHandler(async () => {
  const dashboardData = await piggyBankDashboardService.getDashboardData();
  return successResponse(dashboardData);
});
