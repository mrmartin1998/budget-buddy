import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { calculateAccountBalance, updateAccountBalance } from '@/lib/utils/accountUtils';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  
  const headersList = headers();
  const authorization = headersList.get('authorization');
  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authorization.split(' ')[1];
  let userId;
  try {
    const decoded = verifyToken(token);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { originalTransaction, ...updates } = body;

    // Update transaction with improved populate
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    ).populate({
      path: 'accountId',
      select: 'name type'
    });

    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Calculate new balance
    const newBalance = await updateAccountBalance(userId, updatedTransaction.accountId);
    
    return NextResponse.json({ 
      transaction: updatedTransaction,
      balance: newBalance 
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  
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
    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const accountId = transaction.accountId;
    await Transaction.findByIdAndDelete(id);
    
    // Update account balance after deletion
    const newBalance = await updateAccountBalance(userId, accountId);

    return NextResponse.json({ 
      message: 'Transaction deleted successfully',
      balance: newBalance
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
