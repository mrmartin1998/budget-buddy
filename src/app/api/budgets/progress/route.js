import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
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

    // Get all budgets
    const budgets = await Budget.find({ userId });
    console.log('Found budgets:', budgets); // Debug log

    // Get current month's start date
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Calculate progress for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await Transaction.find({
          userId,
          category: budget.category,
          type: 'expense',
          date: { $gte: startOfMonth }
        });

        const spent = transactions.reduce((total, t) => total + t.amount, 0);
        const percentage = (spent / budget.limit) * 100;

        return {
          _id: budget._id,
          category: budget.category,
          limit: budget.limit,
          spent,
          percentage
        };
      })
    );

    console.log('Budgets with progress:', budgetsWithProgress); // Debug log
    return NextResponse.json({ budgets: budgetsWithProgress });
  } catch (error) {
    console.error('Error in budget progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}