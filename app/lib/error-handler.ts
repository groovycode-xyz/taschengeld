import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { logger } from './logger';
import { isDatabaseError, isPrismaError, isError } from '@/app/types/errors';

/**
 * Centralized error handler for API routes
 */
export function handleError(error: unknown): NextResponse {
  // Log the error
  logger.error('API Error', error);

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle Prisma/database errors
  if (isPrismaError(error)) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this value already exists' },
        { status: 409 }
      );
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Foreign key constraint
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot perform this operation due to related records' },
        { status: 400 }
      );
    }
  }

  // Handle pg database errors
  if (isDatabaseError(error)) {
    // Unique violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A record with this value already exists' },
        { status: 409 }
      );
    }

    // Foreign key violation
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'Cannot perform this operation due to related records' },
        { status: 400 }
      );
    }

    // Not null violation
    if (error.code === '23502') {
      return NextResponse.json({ error: 'Required field is missing' }, { status: 400 });
    }
  }

  // Default error response
  const message = isError(error) ? error.message : 'Internal server error';

  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
      ...(process.env.NODE_ENV === 'development' && isError(error) && { stack: error.stack }),
    },
    { status: 500 }
  );
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}
