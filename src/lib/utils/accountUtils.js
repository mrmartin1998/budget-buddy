import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';

export async function calculateAccountBalance(userId, accountId) {
  console.log(`[AccountUtils] Calculating balance for account ${accountId}`);
  
  const account = await Account.findById(accountId);
  if (!account) {
    console.error('[AccountUtils] Account not found');
    return 0;
  }

  const transactions = await Transaction.find({ 
    userId, 
    accountId 
  }).populate('accountId', 'name type');
  
  console.log(`[AccountUtils] Found ${transactions.length} transactions`);
  
  const balance = transactions.reduce((total, transaction) => {
    const amount = Number(transaction.amount);
    const newTotal = transaction.type === 'income' ? total + amount : total - amount;
    console.log(`[AccountUtils] Transaction: ${transaction.type}, Amount: ${amount}, Account: ${transaction.accountId?.name}, Running Total: ${newTotal}`);
    return newTotal;
  }, 0);

  const finalBalance = Number(balance.toFixed(2));
  console.log(`[AccountUtils] Final balance: ${finalBalance}`);
  return finalBalance;
}

export async function updateAccountBalance(userId, accountId) {
  console.log(`[AccountUtils] Updating balance for account ${accountId}`);
  const newBalance = await calculateAccountBalance(userId, accountId);
  
  const updatedAccount = await Account.findOneAndUpdate(
    { _id: accountId, userId },
    { 
      $set: { 
        balance: newBalance 
      }
    },
    { 
      new: true,
      runValidators: true 
    }
  );
  
  if (!updatedAccount) {
    console.error('[AccountUtils] Failed to update account balance');
    return null;
  }
  
  console.log(`[AccountUtils] Updated account balance to ${updatedAccount.balance}`);
  return updatedAccount.balance;
}