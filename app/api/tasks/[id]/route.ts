import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/app/lib/services/taskService';
import { validateParams, validateRequest } from '@/app/lib/validation/middleware';
import { idParamSchema, updateTaskSchema } from '@/app/lib/validation/schemas';
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
    const task = await taskService.getById(resolvedParams.id);
    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to fetch task', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
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
  const bodyValidation = await validateRequest(request, updateTaskSchema);
  if (!bodyValidation.success) {
    return bodyValidation.error;
  }

  try {
    const task = await taskService.update(resolvedParams.id, bodyValidation.data);
    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to update task', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
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
    const success = await taskService.delete(resolvedParams.id);
    if (success) {
      return NextResponse.json({ message: 'Task deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to delete task', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
