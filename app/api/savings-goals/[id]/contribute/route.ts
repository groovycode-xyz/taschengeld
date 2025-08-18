import { NextRequest } from 'next/server';
import { z } from 'zod';
import { savingsGoalService } from '@/app/lib/services/savingsGoalService';
import { piggyBankAccountService } from '@/app/lib/services/piggyBankAccountService';
import { validateRequest } from '@/app/lib/validation/middleware';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

export const dynamic = 'force-dynamic';

const contributeSchema = z.object({
  amount: z.number().positive(),
  piggybank_account_id: z.number().int().positive().optional(),
  description: z.string().max(255).optional()
});

// POST /api/savings-goals/[id]/contribute - Transfer from piggy bank to savings goal
export const POST = createApiHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const goalId = parseInt(id, 10);
  if (isNaN(goalId)) {
    throw new ValidationError('Invalid goal ID');
  }

  const validation = await validateRequest(request, contributeSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { amount, piggybank_account_id, description } = validation.data;

  // Check if the goal exists
  const goal = await savingsGoalService.getGoalById(goalId);
  if (!goal) {
    throw new NotFoundError('Savings goal');
  }

  // If piggybank_account_id is not provided, get it from the goal's user
  let accountId = piggybank_account_id;
  if (!accountId) {
    // Get the user's piggy bank account
    const goalWithUser = await savingsGoalService.getGoalById(goalId);
    if (goalWithUser?.user_id) {
      // For simplicity, assume user_id maps to same piggybank_account_id
      // In a real app, you'd have a proper user->account lookup
      accountId = goalWithUser.user_id;
    }
  }

  if (!accountId) {
    throw new ValidationError('Unable to determine piggy bank account');
  }

  // Check if the piggy bank account exists and has sufficient balance
  const account = await piggyBankAccountService.getById(accountId);
  if (!account) {
    throw new NotFoundError('Piggy bank account');
  }

  const accountBalance = parseFloat(account.balance);
  if (accountBalance < amount) {
    throw new ValidationError('Insufficient balance in piggy bank account');
  }

  const result = await savingsGoalService.contributeFromPiggyBank(
    goalId,
    amount,
    accountId,
    description || undefined
  );

  return successResponse(result, 201);
});