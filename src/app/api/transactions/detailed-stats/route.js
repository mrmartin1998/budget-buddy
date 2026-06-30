import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const accounts = searchParams.get('accounts')?.split(',') || [];
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const categories = searchParams.get('categories')?.split(',') || [];

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

    // Add category filter if categories are specified
    if (categories.length > 0) {
      query.category = { $in: categories };
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
    return NextResponse.json(
      { error: 'Failed to fetch transaction stats' },
      { status: 500 }
    );
  }
}