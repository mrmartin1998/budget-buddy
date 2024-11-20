import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';
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
    const { amount, type, category, date, accountId, description } = body;

    const account = await Account.findById(accountId);
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    const newTransaction = new Transaction({
      userId,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      accountId: account._id,
      account: {
        id: account._id.toString(),
        name: account.name,
        type: account.type
      },
      description
    });
    
    await newTransaction.save();

    const parsedAmount = parseFloat(amount);
    const balanceChange = type === 'income' ? parsedAmount : -parsedAmount;
    
    account.balance += balanceChange;
    if (type === 'income') {
      account.totalIncome = (account.totalIncome || 0) + parsedAmount;
    } else {
      account.totalExpenses = (account.totalExpenses || 0) + parsedAmount;
    }
    
    await account.save();

    return NextResponse.json(
      { 
        transaction: newTransaction,
        account: account 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
