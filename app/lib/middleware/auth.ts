import { NextRequest, NextResponse } from 'next/server';
import { settingsService } from '@/app/lib/services/settingsService';
import { logger } from '@/app/lib/logger';

// Rate limiting for PIN verification attempts
const rateLimitMap = new Map<
  string,
  { attempts: number; lastAttempt: number; lockoutUntil?: number }
>();

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Middleware to verify parent mode authorization for sensitive operations
 */
export async function requireParentMode(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get settings to check if roles are enforced
    const settings = await settingsService.getAllSettings();

    // If roles are not enforced, allow all requests
    if (!settings.enforce_roles) {
      return await handler(request);
    }

    // Check authorization header for API-based authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const isValidToken = await verifyAuthToken(token);
      if (isValidToken) {
        return await handler(request);
      }
    }

    // Fallback to cookie-based check with enhanced validation
    const isParentMode = request.cookies.get('isParentMode')?.value === 'true';
    const sessionId = request.cookies.get('sessionId')?.value;

    // Verify session if it exists
    if (sessionId && !isValidSession(sessionId)) {
      logger.warn('Invalid session detected', { sessionId, ip: getClientIP(request) });
      return NextResponse.json(
        { error: 'Invalid session. Please re-authenticate.' },
        { status: 401 }
      );
    }

    if (!isParentMode) {
      logger.warn('Unauthorized access attempt to protected endpoint', {
        path: request.nextUrl.pathname,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json(
        { error: 'Parent mode required for this operation' },
        { status: 403 }
      );
    }

    // Log successful authorization
    logger.info('Authorized access to protected endpoint', {
      path: request.nextUrl.pathname,
      ip: getClientIP(request),
    });

    return await handler(request);
  } catch (error) {
    logger.error('Authorization middleware error', error);
    return NextResponse.json({ error: 'Authorization check failed' }, { status: 500 });
  }
}

/**
 * Rate limiting for PIN verification attempts
 */
export function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);

  if (!clientData) {
    rateLimitMap.set(clientIP, { attempts: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Check if client is in lockout period
  if (clientData.lockoutUntil && now < clientData.lockoutUntil) {
    const retryAfter = Math.ceil((clientData.lockoutUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Reset attempts if outside the attempt window
  if (now - clientData.lastAttempt > ATTEMPT_WINDOW) {
    clientData.attempts = 1;
    clientData.lastAttempt = now;
    delete clientData.lockoutUntil;
    return { allowed: true };
  }

  // Increment attempts
  clientData.attempts++;
  clientData.lastAttempt = now;

  // Check if max attempts exceeded
  if (clientData.attempts > MAX_ATTEMPTS) {
    clientData.lockoutUntil = now + LOCKOUT_DURATION;
    const retryAfter = Math.ceil(LOCKOUT_DURATION / 1000);

    logger.warn('Client locked out due to too many PIN attempts', {
      clientIP,
      attempts: clientData.attempts,
      lockoutUntil: new Date(clientData.lockoutUntil).toISOString(),
    });

    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

/**
 * Reset rate limit for successful PIN verification
 */
export function resetRateLimit(clientIP: string): void {
  rateLimitMap.delete(clientIP);
}

/**
 * Verify auth token (placeholder for JWT implementation)
 */
async function verifyAuthToken(token: string): Promise<boolean> {
  // TODO: Implement JWT verification
  // For now, return false to fall back to cookie-based auth
  return false;
}

/**
 * Validate session ID (placeholder for session management)
 */
function isValidSession(sessionId: string): boolean {
  // TODO: Implement proper session validation
  // For now, return true to maintain existing behavior
  return true;
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

/**
 * Create secure session for authenticated users
 */
export function createSession(parentMode: boolean = true): { sessionId: string; expires: Date } {
  const sessionId = generateSecureToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // TODO: Store session in database or secure storage

  return { sessionId, expires };
}

/**
 * Generate a cryptographically secure token
 */
function generateSecureToken(): string {
  // Simple implementation - should use crypto.randomBytes in production
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
