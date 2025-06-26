import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/app/lib/services/userService';
import { validateParams, validateRequest } from '@/app/lib/validation/middleware';
import { idParamSchema, updateUserSchema } from '@/app/lib/validation/schemas';
import { logger } from '@/app/lib/logger';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const resolvedParams = await params;

  // Validate ID parameter
  const paramValidation = validateParams(resolvedParams, idParamSchema);
  if (!paramValidation.success) {
    return paramValidation.error;
  }

  try {
    const user = await userService.getById(parseInt(paramValidation.data.id, 10));
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to fetch user', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const resolvedParams = await params;

  // Validate ID parameter
  const paramValidation = validateParams(resolvedParams, idParamSchema);
  if (!paramValidation.success) {
    return paramValidation.error;
  }

  // Validate request body
  const bodyValidation = await validateRequest(request, updateUserSchema);
  if (!bodyValidation.success) {
    return bodyValidation.error;
  }

  try {
    const updatedUser = await userService.update(parseInt(paramValidation.data.id, 10), bodyValidation.data);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error('Failed to update user', error);
    return NextResponse.json(
      { error: 'Failed to update user. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params in Next.js 15
  const resolvedParams = await params;

  // Validate ID parameter
  const paramValidation = validateParams(resolvedParams, idParamSchema);
  if (!paramValidation.success) {
    return paramValidation.error;
  }

  try {
    const success = await userService.delete(parseInt(paramValidation.data.id, 10));
    if (success) {
      return NextResponse.json({ message: 'User deleted successfully' });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to delete user', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
