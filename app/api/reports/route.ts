import { NextRequest, NextResponse } from 'next/server';
import { reportsService, TimePeriod } from '@/app/lib/services/reportsService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const GET = createApiHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const period = (searchParams.get('period') || 'all') as TimePeriod;

  const reports = await reportsService.getAllUsersTransactionReports(period);
  return successResponse({ users: reports });
});
