import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request) {
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
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const accountsParam = searchParams.get('accounts');

    let query = {
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

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

    const stats = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpenses += amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    return NextResponse.json({
      ...stats,
      transactions
    });
  } catch (error) {
    console.error('Error in detailed-stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}