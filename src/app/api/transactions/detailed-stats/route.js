import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    console.log('Detailed stats API: Starting connection to database...');
    await dbConnect();
    
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      console.log('Detailed stats API: Missing authorization header');
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
      console.log('Detailed stats API: Authenticated user ID:', userId);
    } catch (error) {
      console.error('Detailed stats API: Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const accountsParam = searchParams.get('accounts');

    console.log('Detailed stats API: Query parameters:', {
      startDate,
      endDate,
      accountsParam
    });

    // Validate date parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

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

    console.log('Detailed stats API: Executing query:', JSON.stringify(query));

    const transactions = await Transaction.find(query)
      .populate({
        path: 'accountId',
        select: 'name type'
      })
      .sort({ date: -1 });

    console.log(`Detailed stats API: Found ${transactions.length} transactions`);

    const stats = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpenses += amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    console.log('Detailed stats API: Calculated stats:', stats);

    return NextResponse.json({
      ...stats,
      transactions,
      _debug: {
        queryParams: { startDate, endDate, accountsParam },
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    console.error('Detailed stats API: Unexpected error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}