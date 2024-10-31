import { NextResponse } from 'next/server';
import { settingsService } from '../../../../lib/db/settings';

export async function GET() {
  try {
    const currency = await settingsService.get('default_currency');
    return NextResponse.json({ currency });
  } catch (error) {
    console.error('Failed to fetch currency setting:', error);
    return NextResponse.json({ error: 'Failed to fetch currency setting' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { currency } = await request.json();
    const result = await settingsService.set('default_currency', currency);
    return NextResponse.json({ currency: result });
  } catch (error) {
    console.error('Failed to update currency setting:', error);
    return NextResponse.json({ error: 'Failed to update currency setting' }, { status: 500 });
  }
}
