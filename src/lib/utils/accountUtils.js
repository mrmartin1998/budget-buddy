import mongoose from 'mongoose';
import Transaction from '@/lib/db/models/Transaction';
import Account from '@/lib/db/models/Account';

/**
 * Calculate account balance from all transactions
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {object} options - Optional parameters
 * @param {object} options.session - MongoDB session for atomic transactions
 * @returns {Promise<object>} Balance details
 */
export async function calculateAccountBalance(userId, accountId, options = {}) {
  const { session } = options;
  
  const transactions = await Transaction.find({ 
    userId, 
    accountId 
  }).session(session || null);

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

/**
 * Update account balance atomically
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {object} options - Optional parameters
 * @param {object} options.session - MongoDB session for atomic transactions
 * @returns {Promise<object>} Updated account
 */
export async function updateAccountBalance(userId, accountId, options = {}) {
  if (!accountId) return null;
  
  const { session } = options;
  
  const { balance, totalIncome, totalExpenses } = await calculateAccountBalance(
    userId, 
    accountId, 
    { session }
  );
  
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
      runValidators: true,
      session
    }
  );
  
  return updatedAccount;
}

/**
 * Execute database operations atomically using MongoDB transactions
 * All operations either succeed together or fail together (rollback)
 * 
 * @param {Function} operations - Async function that receives a session
 * @returns {Promise<any>} Result of operations
 * @throws {Error} If transaction fails
 */
export async function withTransaction(operations) {
  const session = await mongoose.startSession();
  
  try {
    // Start transaction
    session.startTransaction();
    
    // Execute operations with session
    const result = await operations(session);
    
    // Commit transaction if all operations succeed
    await session.commitTransaction();
    
    return result;
  } catch (error) {
    // Rollback transaction if any operation fails
    await session.abortTransaction();
    throw error;
  } finally {
    // Always end session
    session.endSession();
  }
}