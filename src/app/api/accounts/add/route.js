import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { accountSchema } from '@/lib/validation/schemas';
import { validateRequestBody } from '@/lib/validation/middleware';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

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