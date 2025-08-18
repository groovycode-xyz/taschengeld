import { NextRequest } from 'next/server';
import { z } from 'zod';
import { savingsGoalService } from '@/app/lib/services/savingsGoalService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

const purchaseSchema = z.object({
  description: z.string().max(255).optional()
});

// POST /api/savings-goals/[id]/purchase - Make a purchase using savings goal (empties goal and marks inactive)
export const POST = createApiHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const goalId = parseInt(id, 10);
  if (isNaN(goalId)) {
    throw new ValidationError('Invalid goal ID');
  }

  const validation = await validateRequest(request, purchaseSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { description } = validation.data;

  // Check if the goal exists and is active
  const goal = await savingsGoalService.getGoalById(goalId);
  if (!goal) {
    throw new NotFoundError('Savings goal');
  }

  if (!goal.is_active) {
    throw new ValidationError('Savings goal is not active');
  }

  const goalBalance = parseFloat(goal.current_balance);
  if (goalBalance <= 0) {
    throw new ValidationError('Savings goal has no balance to purchase with');
  }

  const result = await savingsGoalService.purchaseFromGoal(
    goalId,
    description || undefined
  );

  return successResponse(result, 201);
});