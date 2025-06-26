import { NextRequest, NextResponse } from 'next/server';
import { handleError } from './error-handler';

/**
 * Creates an API route handler with automatic error handling
 * Compatible with both regular routes and dynamic routes with params
 */
export function createApiHandler<T>(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Creates a successful response
 */
export function successResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Creates an error response
 */
export function errorResponse(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Extracts and validates ID from params
 */
export function getIdFromParams(params: { id: string }): number {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid ID parameter');
  }
  return id;
}
