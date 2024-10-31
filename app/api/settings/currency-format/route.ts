import { NextResponse } from 'next/server';
import { settingsService } from '../../../../lib/db/settings';

export async function GET() {
  try {
    const format = await settingsService.get('currency_format');
    return NextResponse.json({ format: format || 'symbol' }); // Default to 'symbol' if not set
  } catch (error) {
    console.error('Failed to fetch currency format setting:', error);
    return NextResponse.json({ error: 'Failed to fetch currency format setting' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { format } = await request.json();
    const result = await settingsService.set('currency_format', format);
    return NextResponse.json({ format: result });
  } catch (error) {
    console.error('Failed to update currency format setting:', error);
    return NextResponse.json(
      { error: 'Failed to update currency format setting' },
      { status: 500 }
    );
  }
}
