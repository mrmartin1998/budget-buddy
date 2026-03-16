import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStartDateForPeriod, getEndDateForPeriod } from '@/lib/utils/budgetPeriodUtils';

export async function GET() {
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
    const budgets = await Budget.find({ userId });

    const currentDate = new Date();

    // Process each budget with its specific period
    const budgetPromises = budgets.map(async (budget) => {
      const startDate = getStartDateForPeriod(budget.period, currentDate);
      const endDate = getEndDateForPeriod(budget.period, currentDate);

      const transactions = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            category: budget.category,
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return {
        _id: budget._id,
        category: budget.category,
        limit: budget.limit,
        period: budget.period,
        spent: transactions[0]?.total || 0
      };
    });

    const processedBudgets = await Promise.all(budgetPromises);

    return NextResponse.json({
      budgets: processedBudgets
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}