import { NextRequest } from 'next/server';
import { savingsGoalService } from '@/app/lib/services/savingsGoalService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { createSavingsGoalSchema, updateSavingsGoalSchema } from '@/app/lib/validation/schemas';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/savings-goals - Get all goals or goals by user_id
export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (userId) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      throw new ValidationError('Invalid user ID');
    }
    const goals = await savingsGoalService.getGoalsByUserId(userIdNum);
    return successResponse(goals);
  }

  const goals = await savingsGoalService.getAllGoals();
  return successResponse(goals);
});

// POST /api/savings-goals - Create a new savings goal
export const POST = createApiHandler(async (request: NextRequest) => {
  const validation = await validateRequest(request, createSavingsGoalSchema);
  if (!validation.success) {
    return validation.error;
  }

  const goal = await savingsGoalService.createGoal(validation.data);
  return successResponse(goal, 201);
});

// PUT /api/savings-goals - Update a savings goal
export const PUT = createApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { goal_id, ...updateData } = body;

  if (!goal_id || typeof goal_id !== 'number') {
    throw new ValidationError('Valid goal ID is required');
  }

  const validation = updateSavingsGoalSchema.safeParse(updateData);
  if (!validation.success) {
    throw new ValidationError('Validation failed');
  }

  const goal = await savingsGoalService.updateGoal(goal_id, validation.data);
  return successResponse(goal);
});

// DELETE /api/savings-goals - Delete a savings goal
export const DELETE = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get('goal_id');

  if (!goalId) {
    throw new ValidationError('Goal ID is required');
  }

  const goalIdNum = parseInt(goalId, 10);
  if (isNaN(goalIdNum)) {
    throw new ValidationError('Invalid goal ID');
  }

  await savingsGoalService.deleteGoal(goalIdNum);
  return successResponse({ message: 'Savings goal deleted successfully' });
});
