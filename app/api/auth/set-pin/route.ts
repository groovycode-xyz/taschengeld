import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { settingsService } from '@/app/lib/services/settingsService';
import { requireParentMode } from '@/app/lib/middleware/auth';
import { validateRequest } from '@/app/lib/validation/middleware';
import { z } from 'zod';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

const setPinSchema = z.object({
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(10, 'PIN must be no more than 10 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers')
    .optional()
    .or(z.literal('')), // Allow empty string to clear PIN
});

/**
 * Set or update the parent mode PIN (requires parent mode authorization)
 */
export async function POST(request: NextRequest) {
  return requireParentMode(request, async (req) => {
    try {
      // Validate request body
      const validation = await validateRequest(req, setPinSchema);
      if (!validation.success) {
        return validation.error;
      }

      const { pin } = validation.data;

      let hashedPin: string | null = null;

      if (pin && pin.length > 0) {
        // Hash the new PIN
        const saltRounds = 12; // Strong salt rounds for security
        hashedPin = await bcrypt.hash(pin, saltRounds);

        logger.info('PIN updated successfully', {
          ip: getClientIP(req),
          pinLength: pin.length,
        });
      } else {
        // Clear the PIN
        logger.info('PIN cleared', {
          ip: getClientIP(req),
        });
      }

      // Update the PIN in settings
      await settingsService.updateSetting('parent_mode_pin', hashedPin);

      return NextResponse.json({
        success: true,
        message: hashedPin ? 'PIN updated successfully' : 'PIN cleared successfully',
      });
    } catch (error) {
      logger.error('Set PIN error', error);
      return NextResponse.json({ error: 'Failed to update PIN' }, { status: 500 });
    }
  });
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
