import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { calculateAccountBalance, updateAccountBalance } from '@/lib/utils/accountUtils';
import { transactionSchema } from '@/lib/validation/schemas';
import { validateRequestBody, validateObjectId } from '@/lib/validation/middleware';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  
  // Auth validation
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
    const idValidation = validateObjectId(id, 'transactionId');
    if (!idValidation.success) {
      return idValidation.error;
    }
    
    const body = await request.json();
    const { originalTransaction, updatedTransaction } = body;
    
    const validation = validateRequestBody(updatedTransaction, transactionSchema.partial());
    if (!validation.success) {
      return validation.error;
    }

    // 1. Revert original transaction's effect on old account
    if (originalTransaction.accountId) {
      await updateAccountBalance(userId, originalTransaction.accountId);
    }

    // 2. Update the transaction
    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      validation.data,
      { 
        new: true,
        runValidators: true 
      }
    ).populate({
      path: 'accountId',
      select: 'name type balance'
    });

    if (!updatedTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // 3. Update new account's balance
    const newBalance = await updateAccountBalance(userId, updatedTx.accountId);

    // 4. If accounts are different, update both
    if (originalTransaction.accountId !== updatedTx.accountId.toString()) {
      await updateAccountBalance(userId, originalTransaction.accountId);
    }

    return NextResponse.json({ 
      transaction: updatedTx,
      balance: newBalance
    });

  } catch (error) {
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
    const idValidation = validateObjectId(id, 'transactionId');
    if (!idValidation.success) {
      return idValidation.error;
    }
    
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
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
