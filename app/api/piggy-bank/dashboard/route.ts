import { NextResponse } from 'next/server';
import { piggyBankDashboardRepository } from '@/app/lib/index';

export async function GET() {
  try {
    const dashboardData = await piggyBankDashboardRepository.getDashboardData();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
