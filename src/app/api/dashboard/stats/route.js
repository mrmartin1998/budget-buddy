import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    console.log('API: Connecting to database...');
    await dbConnect();
    
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      console.error('API: No authorization header');
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
      console.log('API: User ID:', userId);
    } catch (error) {
      console.error('API: Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get current month's data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    console.log('API: Fetching transactions...');
    const currentMonthStats = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    console.log('API: Current month stats:', currentMonthStats);

    const income = currentMonthStats.find(stat => stat._id === 'income')?.total || 0;
    const expenses = currentMonthStats.find(stat => stat._id === 'expense')?.total || 0;
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const response = {
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      monthlyChange: 0, // We'll calculate this later
      topExpenseCategory: 'No expenses',
      savingsRate
    };

    console.log('API: Sending response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}