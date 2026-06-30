import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    // Get all accounts for the user
    const accounts = await Account.find({ userId });
    
    // Reset and recalculate each account
    for (const account of accounts) {
      await recalculateAccountBalance(account._id);
    }

    return NextResponse.json({ 
      message: 'Account balances reset successfully',
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reset account balances' },
      { status: 500 }
    );
  }
}