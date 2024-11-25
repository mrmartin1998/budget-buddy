import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';

export async function calculateAccountBalance(userId, accountId) {
  const transactions = await Transaction.find({ 
    userId, 
    accountId 
  });

  const { totalIncome, totalExpenses } = transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (transaction.type === 'income') {
      acc.totalIncome += amount;
    } else {
      acc.totalExpenses += amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });

  const balance = totalIncome - totalExpenses;
  return {
    balance: Number(balance.toFixed(2)),
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2))
  };
}

export async function updateAccountBalance(userId, accountId) {
  if (!accountId) return null;
  
  const { balance, totalIncome, totalExpenses } = await calculateAccountBalance(userId, accountId);
  
  const updatedAccount = await Account.findOneAndUpdate(
    { _id: accountId, userId },
    { 
      $set: { 
        balance,
        totalIncome,
        totalExpenses
      }
    },
    { 
      new: true,
      runValidators: true 
    }
  );
  
  return updatedAccount;
}