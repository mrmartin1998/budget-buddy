import Budget from '@/lib/db/models/Budget';

export async function checkBudget(userId, category, amount) {
  const budget = await Budget.findOne({ userId, category });
  
  if (!budget) {
    return null;
  }

  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Calculate total spent in this category this month
  const totalSpent = await Transaction.aggregate([
    {
      $match: {
        userId,
        category,
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

  const spent = totalSpent[0]?.total || 0;
  const newTotal = spent + amount;

  if (newTotal > budget.limit) {
    return {
      exceeded: true,
      limit: budget.limit,
      spent: newTotal,
      overage: newTotal - budget.limit
    };
  }

  return {
    exceeded: false,
    limit: budget.limit,
    spent: newTotal,
    remaining: budget.limit - newTotal
  };
}