import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request) {
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
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, type, balance } = body;

    const newAccount = new Account({
      userId,
      name,
      type,
      balance: 0
    });
    
    await newAccount.save();

    const initialTransaction = new Transaction({
      userId,
      type: balance >= 0 ? 'income' : 'expense',
      amount: Math.abs(balance),
      category: 'Initial Balance',
      description: 'Initial account balance',
      accountId: newAccount._id,
      date: new Date()
    });

    await initialTransaction.save();

    newAccount.balance = parseFloat(balance);
    await newAccount.save();

    return NextResponse.json(
      { account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}