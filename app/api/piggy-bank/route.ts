import { NextResponse } from 'next/server';
import { piggyBankAccountRepository } from '@/app/lib/piggyBankAccountRepository';
import { piggyBankTransactionRepository } from '@/app/lib/piggyBankTransactionRepository';

// GET route to fetch all piggy bank accounts
export async function GET() {
  try {
    const accounts = await piggyBankAccountRepository.getAll();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Failed to fetch piggy bank accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch piggy bank accounts' }, { status: 500 });
  }
}

// POST route to create a new transaction (deposit or withdrawal)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      account_id,
      amount,
      transaction_type,
      description,
      photo,
      completed_task_id, // New field
    } = body;

    // Update the account balance
    const updatedAccount = await piggyBankAccountRepository.updateBalance(account_id, amount);
    if (!updatedAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Create a new transaction
    const newTransaction = await piggyBankTransactionRepository.addTransaction({
      account_id,
      amount: amount.toString(),
      transaction_type,
      description,
      photo,
      completed_task_id, // Include completed task reference
    });

    return NextResponse.json(
      { account: updatedAccount, transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
