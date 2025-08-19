import { NextRequest } from 'next/server';
import { savingsGoalService } from '@/app/lib/services/savingsGoalService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/savings-goals/[id] - Get a specific savings goal
export const GET = createApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const goalId = parseInt(id, 10);
    if (isNaN(goalId)) {
      throw new ValidationError('Invalid goal ID');
    }

    const goal = await savingsGoalService.getGoalById(goalId);
    if (!goal) {
      throw new NotFoundError('Savings goal');
    }

    return successResponse(goal);
  }
);
