import { NextRequest, NextResponse } from 'next/server';
import { completedTaskService } from '@/app/lib/services/completedTaskService';
import { CreateCompletedTaskInput } from '@/app/types/completedTask';
import { piggyBankAccountService } from '@/app/lib/services/piggyBankAccountService';
import { validateRequest } from '@/app/lib/validation/middleware';
import {
  completeTaskSchema,
  updateCompletedTaskSchema,
  paydaySchema,
} from '@/app/lib/validation/schemas';
import { logger } from '@/app/lib/logger';

export async function GET() {
  try {
    const completedTasks = await completedTaskService.getAll();
    return NextResponse.json(completedTasks);
  } catch (error) {
    logger.error('Failed to fetch completed tasks', error);
    return NextResponse.json({ error: 'Failed to fetch completed tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateRequest(request, completeTaskSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const completedTaskData: CreateCompletedTaskInput = validation.data;
    const newCompletedTask = await completedTaskService.create(completedTaskData);

    return NextResponse.json(newCompletedTask, { status: 201 });
  } catch (error) {
    logger.error('Failed to create completed task', error);
    return NextResponse.json({ error: 'Failed to create completed task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    logger.debug('PUT /api/completed-tasks', { body });

    const { c_task_id, payment_status, custom_payout_value } = body;

    // Validate the update data
    const validation = updateCompletedTaskSchema.safeParse({ payment_status, custom_payout_value });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Validate task ID
    if (!c_task_id || typeof c_task_id !== 'number') {
      return NextResponse.json({ error: 'Valid completed task ID is required' }, { status: 400 });
    }

    const updatedTask = await completedTaskService.updatePaymentStatus(
      c_task_id,
      payment_status,
      custom_payout_value
    );

    if (updatedTask) {
      return NextResponse.json(updatedTask);
    } else {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to update completed task', error);
    return NextResponse.json({ error: 'Failed to update completed task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const completedTaskId = url.searchParams.get('id');

  // Validate ID
  if (!completedTaskId || isNaN(Number(completedTaskId))) {
    return NextResponse.json({ error: 'Valid completed task ID is required' }, { status: 400 });
  }

  try {
    const success = await completedTaskService.delete(Number(completedTaskId));
    if (success) {
      return NextResponse.json({ message: 'Completed task deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
  } catch (error) {
    logger.error('Failed to delete completed task', error);
    return NextResponse.json({ error: 'Failed to delete completed task' }, { status: 500 });
  }
}

// Payday endpoint
export async function PATCH(request: NextRequest) {
  // Validate request body
  const validation = await validateRequest(request, paydaySchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const { completedTaskIds, customPayoutValues } = validation.data;

    // Process payday for each completed task
    const results = await Promise.all(
      completedTaskIds.map(async (taskId) => {
        const completedTask = await completedTaskService.getById(taskId);
        if (!completedTask) {
          return { taskId, success: false, error: 'Task not found' };
        }

        // Get the user's piggy bank account
        const account = await piggyBankAccountService.getByUserId(completedTask.user_id);
        if (!account) {
          return { taskId, success: false, error: 'No piggy bank account found for user' };
        }

        // Get custom payout value if provided
        const customPayoutValue = customPayoutValues?.[taskId.toString()];

        // Update payment status (this automatically creates the piggy bank transaction)
        await completedTaskService.updatePaymentStatus(taskId, 'Paid', customPayoutValue);

        return { taskId, success: true };
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    logger.error('Failed to process payday', error);
    return NextResponse.json({ error: 'Failed to process payday' }, { status: 500 });
  }
}
