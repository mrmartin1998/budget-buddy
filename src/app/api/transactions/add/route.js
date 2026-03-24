import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { updateAccountBalance, withTransaction } from '@/lib/utils/accountUtils';
import { transactionSchema } from '@/lib/validation/schemas';
import { validateRequestBody } from '@/lib/validation/middleware';

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
    
    // Validate request body
    const validation = validateRequestBody(body, transactionSchema);
    if (!validation.success) {
      return validation.error;
    }
    
    const { amount, type, category, date, accountId, description } = validation.data;

    // Validate the account exists and belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Use atomic transaction to ensure data consistency
    // Both transaction creation and balance update succeed or both fail
    const result = await withTransaction(async (session) => {
      // Create and save the transaction
      const newTransaction = new Transaction({
        userId,
        amount,
        type,
        category,
        date,
        accountId: account._id,
        description
      });
      
      const savedTransaction = await newTransaction.save({ session });
      
      // Update account balance atomically in same transaction
      const updatedAccount = await updateAccountBalance(userId, account._id, { session });
      
      if (!updatedAccount) {
        throw new Error('Failed to update account balance');
      }

      // Populate transaction details
      const populatedTransaction = await Transaction.findById(savedTransaction._id)
        .populate({
          path: 'accountId',
          select: 'name type'
        })
        .session(session);

      return {
        transaction: populatedTransaction,
        account: updatedAccount
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
