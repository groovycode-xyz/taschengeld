import { NextResponse } from 'next/server';
import { piggyBankAccountRepository } from '@/app/lib/piggyBankAccountRepository';
import { piggyBankTransactionRepository } from '@/app/lib/piggyBankTransactionRepository';

// GET route to fetch all piggy bank accounts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Fetch a specific piggy bank account by user ID
      const account = await piggyBankAccountRepository.getByUserId(parseInt(userId, 10));
      if (account) {
        return NextResponse.json(account);
      } else {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
    } else {
      // If no userId is provided, fetch all piggy bank accounts
      const accounts = await piggyBankAccountRepository.getAll();
      // Return the first account or null if no accounts exist
      return NextResponse.json(accounts[0] || null);
    }
  } catch (error) {
    console.error('Failed to fetch piggy bank accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch piggy bank accounts' }, { status: 500 });
  }
}

// POST route to create a new transaction (deposit or withdrawal)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account_id, amount, transaction_type, description, photo } = body;

    // Update the account balance
    const updatedAccount = await piggyBankAccountRepository.updateBalance(
      account_id,
      parseFloat(amount)
    );
    if (!updatedAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Create a new transaction
    const newTransaction = await piggyBankTransactionRepository.addTransaction({
      account_id,
      amount,
      transaction_type,
      description,
      photo,
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
