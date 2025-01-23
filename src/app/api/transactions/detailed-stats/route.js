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
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const accounts = searchParams.get('accounts')?.split(',') || [];
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // Build query object
    const query = {
      userId,
      date: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };

    // Add account filter if accounts are specified
    if (accounts.length > 0) {
      query.accountId = { $in: accounts };
    }

    // Add amount filters if specified
    if (minAmount !== null || maxAmount !== null) {
      query.$or = [
        // For income transactions (positive amounts)
        {
          type: 'income',
          amount: {
            ...(minAmount !== null && { $gte: parseFloat(minAmount) }),
            ...(maxAmount !== null && { $lte: parseFloat(maxAmount) })
          }
        },
        // For expense transactions (check absolute value)
        {
          type: 'expense',
          amount: {
            ...(minAmount !== null && { $lte: -parseFloat(minAmount) }),
            ...(maxAmount !== null && { $gte: -parseFloat(maxAmount) })
          }
        }
      ];
    }

    // Fetch transactions with the built query
    const transactions = await Transaction.find(query)
      .populate('accountId')
      .sort({ date: -1 });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      transactions,
      totalIncome,
      totalExpenses
    });

  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction stats' },
      { status: 500 }
    );
  }
}