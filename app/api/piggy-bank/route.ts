import { NextRequest, NextResponse } from 'next/server';
import { piggyBankAccountService } from '@/app/lib/services/piggyBankAccountService';
import { piggyBankTransactionService } from '@/app/lib/services/piggyBankTransactionService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';
import { validateRequest } from '@/app/lib/validation/middleware';
import { z } from 'zod';

// Schema for creating a transaction
const createTransactionSchema = z.object({
  account_id: z.number().int().positive(),
  amount: z.number().positive(),
  transaction_type: z.enum(['deposit', 'withdrawal', 'payday']),
  description: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  completed_task_id: z.number().int().positive().optional().nullable(),
});

// GET route to fetch all piggy bank accounts
export const GET = createApiHandler(async () => {
  const accounts = await piggyBankAccountService.getAllAccounts();
  return successResponse(accounts);
});

// POST route to create a new transaction (deposit or withdrawal)
export const POST = createApiHandler(async (request: NextRequest) => {
  // Validate request body
  const validation = await validateRequest(request, createTransactionSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { account_id, amount, transaction_type, description, photo, completed_task_id } =
    validation.data;

  // Create transaction (this also updates the balance atomically)
  const transaction = await piggyBankTransactionService.create({
    account_id,
    amount,
    transaction_type,
    description,
    photo,
    completed_task_id,
  });

  // Get updated account
  const updatedAccount = await piggyBankAccountService.getById(account_id);

  return successResponse({ account: updatedAccount, transaction }, 201);
});
