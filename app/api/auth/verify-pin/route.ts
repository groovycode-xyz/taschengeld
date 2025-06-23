import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { settingsService } from '@/app/lib/services/settingsService';
import { checkRateLimit, resetRateLimit, createSession } from '@/app/lib/middleware/auth';
import { validateRequest } from '@/app/lib/validation/middleware';
import { z } from 'zod';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

const verifyPinSchema = z.object({
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(10, 'PIN too long'),
});

/**
 * Verify PIN for parent mode authentication
 */
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  try {
    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      logger.warn('PIN verification blocked due to rate limiting', {
        clientIP,
        retryAfter: rateLimitResult.retryAfter,
      });

      return NextResponse.json(
        {
          error: 'Too many failed attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
          },
        }
      );
    }

    // Validate request body
    const validation = await validateRequest(request, verifyPinSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { pin } = validation.data;

    // Get current settings
    const settings = await settingsService.getAllSettings();

    // If no PIN is set, allow access (same as original behavior)
    if (!settings.parent_mode_pin) {
      logger.info('PIN verification succeeded - no PIN set', { clientIP });
      const session = createSession(true);

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
      });

      // Set secure session cookie
      response.cookies.set('sessionId', session.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: session.expires,
      });

      response.cookies.set('isParentMode', 'true', {
        httpOnly: false, // Needs to be accessible by client for UI
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: session.expires,
      });

      resetRateLimit(clientIP);
      return response;
    }

    // Verify PIN using bcrypt if it's hashed, otherwise plain text comparison
    const isValidPin = await verifyPin(pin, settings.parent_mode_pin);

    if (!isValidPin) {
      logger.warn('Invalid PIN attempt', {
        clientIP,
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // PIN is valid - create session and reset rate limit
    logger.info('PIN verification successful', { clientIP });
    resetRateLimit(clientIP);

    const session = createSession(true);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    // Set secure session cookie
    response.cookies.set('sessionId', session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: session.expires,
    });

    response.cookies.set('isParentMode', 'true', {
      httpOnly: false, // Needs to be accessible by client for UI
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: session.expires,
    });

    return response;
  } catch (error) {
    logger.error('PIN verification error', error);
    return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 });
  }
}

/**
 * Verify PIN against stored value (supports both hashed and plain text)
 */
async function verifyPin(inputPin: string, storedPin: string): Promise<boolean> {
  try {
    // Check if stored PIN is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (storedPin.startsWith('$2')) {
      return await bcrypt.compare(inputPin, storedPin);
    }

    // Fallback to plain text comparison for existing PINs
    return inputPin === storedPin;
  } catch (error) {
    logger.error('PIN verification error', error);
    return false;
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
