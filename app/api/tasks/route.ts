import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/app/lib/services/taskService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { createTaskSchema } from '@/app/lib/validation/schemas';
import { logger } from '@/app/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const tasks = activeOnly ? await taskService.getAllActive() : await taskService.getAll();

    return NextResponse.json(tasks);
  } catch (error) {
    logger.error('Failed to fetch tasks', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateRequest(request, createTaskSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const taskData = {
      ...validation.data,
      is_active: true, // Set is_active to true by default
    };
    const task = await taskService.create(taskData);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    logger.error('Failed to create task', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
