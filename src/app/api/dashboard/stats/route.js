import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const { userId, error } = getUserIdFromCookies();
    if (error) return error;

    // Get current month's data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

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

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}