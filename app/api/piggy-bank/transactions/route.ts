import { NextRequest, NextResponse } from 'next/server';
import { piggyBankTransactionService } from '@/app/lib/services/piggyBankTransactionService';
import { validateQuery, validateRequest } from '@/app/lib/validation/middleware';
import { z } from 'zod';
import { createTransactionSchema } from '@/app/lib/validation/schemas';
import { logger } from '@/app/lib/logger';

// Query parameter schema
const transactionQuerySchema = z.object({
  accountId: z.string().regex(/^\d+$/, 'Account ID must be a number').transform(Number),
});

// GET route to fetch transactions for a specific account
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Validate query parameters
  const validation = validateQuery(searchParams, transactionQuerySchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const transactions = await piggyBankTransactionService.getTransactionsByAccountId(
      validation.data.accountId
    );
    return NextResponse.json(transactions);
  } catch (error) {
    logger.error('Failed to fetch transactions', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST route to create a new transaction
export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateRequest(request, createTransactionSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const transaction = await piggyBankTransactionService.create(validation.data);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    logger.error('Failed to create transaction', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
