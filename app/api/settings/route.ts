import { NextResponse } from 'next/server';
import { settingsRepository } from '@/app/lib/settingsRepository';

export async function GET() {
  try {
    const settings = await settingsRepository.getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { key, value } = await request.json();
    await settingsRepository.updateSetting(key, value);
    return NextResponse.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
