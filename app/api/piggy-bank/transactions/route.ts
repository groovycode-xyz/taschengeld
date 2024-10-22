import { NextResponse } from 'next/server';
import { piggyBankTransactionRepository } from '@/app/lib/piggyBankTransactionRepository';

// GET route to fetch transactions for a specific account
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const accountIdNumber = parseInt(accountId, 10);
    if (isNaN(accountIdNumber)) {
      return NextResponse.json({ error: 'Invalid Account ID' }, { status: 400 });
    }

    const transactions = await piggyBankTransactionRepository.getTransactionsByAccountId(
      accountIdNumber
    );
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
