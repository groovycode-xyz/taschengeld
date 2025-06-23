import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * Logout and clear session
 */
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    logger.info('User logout', { clientIP });

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear session cookies
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire immediately
    });

    response.cookies.set('isParentMode', 'false', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire immediately
    });

    return response;
  } catch (error) {
    logger.error('Logout error', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}
