import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import Budget from '@/lib/db/models/Budget';
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
    const transactions = await Transaction.find({ 
      userId,
      type: 'expense'
    });
    
    const budgets = await Budget.find({ userId });
    const budgetMap = new Map(budgets.map(b => [b.category, b.limit]));
    
    // Calculate totals by category
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // Calculate total expenses
    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    // Format categories with percentages
    const categories = Object.entries(categoryTotals).map(([name, total]) => ({
      name,
      total,
      percentage: Math.round((total / totalExpenses) * 100),
      limit: budgetMap.get(name) || 0
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}