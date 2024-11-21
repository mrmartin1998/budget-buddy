import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { headers } from 'next/headers';

export async function GET(request, { params }) {
  try {
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
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { month } = params;
    
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Create date range for the selected month
    const startDate = new Date(currentYear, parseInt(month), 1);
    const endDate = new Date(currentYear, parseInt(month) + 1, 0);

    // Aggregate transactions for the month
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = monthlyStats.find(stat => stat._id === 'income')?.total || 0;
    const expenses = monthlyStats.find(stat => stat._id === 'expense')?.total || 0;

    return NextResponse.json({
      totalIncome: income,
      totalExpenses: expenses
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}