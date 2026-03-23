import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { accountSchema } from '@/lib/validation/schemas';
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
    
    const validation = validateRequestBody(body, accountSchema);
    if (!validation.success) {
      return validation.error;
    }
    
    const { name, type, balance, color } = validation.data;

    const newAccount = new Account({
      userId,
      name,
      type,
      balance,
      color: color || '#3B82F6',
    });
    
    await newAccount.save();

    if (balance > 0) {
      const transaction = new Transaction({
        userId,
        accountId: newAccount._id,
        type: 'income',
        category: 'Initial Balance',
        amount: balance,
        date: new Date(),
      });
      await transaction.save();
    }

    return NextResponse.json(
      { account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}