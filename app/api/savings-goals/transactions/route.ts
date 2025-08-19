import { NextRequest } from 'next/server';
import { savingsGoalService } from '@/app/lib/services/savingsGoalService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { savingsGoalTransactionSchema } from '@/app/lib/validation/schemas';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ValidationError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/savings-goals/transactions - Get transactions by goal_id
export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get('goal_id');

  if (!goalId) {
    throw new ValidationError('Goal ID is required');
  }

  const goalIdNum = parseInt(goalId, 10);
  if (isNaN(goalIdNum)) {
    throw new ValidationError('Invalid goal ID');
  }

  const transactions = await savingsGoalService.getTransactionsByGoalId(goalIdNum);
  return successResponse(transactions);
});

// POST /api/savings-goals/transactions - Create a new transaction
export const POST = createApiHandler(async (request: NextRequest) => {
  const validation = await validateRequest(request, savingsGoalTransactionSchema);
  if (!validation.success) {
    return validation.error;
  }

  const transaction = await savingsGoalService.createTransaction(validation.data);
  return successResponse(transaction, 201);
});
