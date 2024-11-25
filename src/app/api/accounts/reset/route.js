import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  await dbConnect();
  
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const token = authorization.split(' ')[1];
  let userId;
  
  try {
    const decoded = verifyToken(token);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

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
    console.error('Error resetting account balances:', error);
    return NextResponse.json(
      { error: 'Failed to reset account balances' },
      { status: 500 }
    );
  }
}