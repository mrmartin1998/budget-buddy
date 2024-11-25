import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { updateAccountBalance } from '@/lib/utils/accountUtils';

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

    // Validate the account exists and belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Create and save the transaction
    const newTransaction = new Transaction({
      userId,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      accountId: account._id,
      description
    });
    
    const savedTransaction = await newTransaction.save();
    const populatedTransaction = await Transaction.findById(savedTransaction._id)
      .populate({
        path: 'accountId',
        select: 'name type'
      });

    // Update account balance
    const newBalance = await updateAccountBalance(userId, account._id);
    if (newBalance === null) {
      return NextResponse.json(
        { error: 'Failed to update account balance' },
        { status: 500 }
      );
    }

    // Update account totals
    const parsedAmount = parseFloat(amount);
    account.balance = newBalance;
    account.totalIncome = type === 'income' 
      ? Number(((account.totalIncome || 0) + parsedAmount).toFixed(2))
      : account.totalIncome || 0;
    account.totalExpenses = type === 'expense'
      ? Number(((account.totalExpenses || 0) + parsedAmount).toFixed(2))
      : account.totalExpenses || 0;

    await account.save();

    // Return the updated data
    return NextResponse.json(
      { 
        transaction: populatedTransaction,
        account: {
          ...account.toObject(),
          balance: newBalance
        }
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
