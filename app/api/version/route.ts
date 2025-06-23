import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read version from version.txt in the project root
    const versionPath = path.join(process.cwd(), 'version.txt');
    const versionContent = await fs.readFile(versionPath, 'utf-8');
    const version = versionContent.trim();

    if (!version) {
      throw new Error('Version file is empty');
    }

    return NextResponse.json({
      version,
      environment: process.env.NODE_ENV || 'production',
    });
  } catch (error) {
    logger.error('Error reading version file', error);

    // Fallback version if file can't be read
    return NextResponse.json(
      {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        error: 'Could not read version file',
      },
      { status: 200 }
    ); // Still return 200 but with fallback
  }
}
