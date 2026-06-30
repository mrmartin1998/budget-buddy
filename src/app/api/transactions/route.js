import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  await dbConnect();

  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const accountsParam = searchParams.get('accounts');
    
    let query = { userId };
    
    if (accountsParam) {
      const accountIds = accountsParam.split(',');
      query.accountId = { $in: accountIds };
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: 'accountId',
        select: 'name type'
      })
      .sort({ date: -1 });

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
