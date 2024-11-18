import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import Transaction from '@/lib/db/models/Transaction';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

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
    // Get all budgets for the user
    const budgets = await Budget.find({ userId });

    // Get current month's start date
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Calculate spending for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId,
              category: budget.category,
              type: 'expense',
              date: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const spentAmount = spent[0]?.total || 0;
        const percentage = (spentAmount / budget.limit) * 100;

        return {
          _id: budget._id,
          category: budget.category,
          limit: budget.limit,
          spent: spentAmount,
          percentage,
        };
      })
    );

    return NextResponse.json({ budgets: budgetsWithProgress });
  } catch (error) {
    console.error('Error calculating budget progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}