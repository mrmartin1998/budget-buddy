'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import TransactionForm from './TransactionForm';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import AmountRangeFilter from './AmountRangeFilter';
import CategoryFilter from './CategoryFilter';

export default function DetailedCashFlow({ selectedAccounts = [], refreshTrigger = 0 }) {
  const router = useRouter();
  const { handleTransaction } = useAccounts();
  const { addToast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split('T')[0]
  );
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    netFlow: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [amountFilter, setAmountFilter] = useState({ min: null, max: null });
  const [categoryFilter, setCategoryFilter] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Please login to continue', 'error');
        router.push('/login');
        return;
      }

      let url = `/api/transactions/detailed-stats?start=${startDate}&end=${endDate}`;
      if (selectedAccounts.length > 0) {
        url += `&accounts=${selectedAccounts.join(',')}`;
      }
      if (amountFilter.min !== null) {
        url += `&minAmount=${amountFilter.min}`;
      }
      if (amountFilter.max !== null) {
        url += `&maxAmount=${amountFilter.max}`;
      }
      if (categoryFilter.length > 0) {
        url += `&categories=${categoryFilter.join(',')}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      setStats({
        income: data.totalIncome || 0,
        expenses: data.totalExpenses || 0,
        netFlow: (data.totalIncome || 0) - (data.totalExpenses || 0)
      });
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Failed to fetch transaction data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedAccounts, refreshTrigger, amountFilter, categoryFilter]);

  const sortedTransactions = transactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Include both original and updated data for proper balance calculations
      const payload = {
        originalTransaction: {
          ...editingTransaction,
          accountId: editingTransaction.accountId?._id || editingTransaction.accountId
        },
        updatedTransaction: {
          ...updatedData,
          _id: editingTransaction._id
        }
      };

      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const data = await response.json();
      
      // Update local transaction state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t._id === data.transaction._id ? data.transaction : t
        )
      );
      
      // Update account state through context
      handleTransaction(data.transaction);
      
      // Clear editing state
      setEditingTransaction(null);
      
      // Refresh all data to ensure consistency
      fetchData();
      
      addToast('Transaction updated successfully', 'success');
    } catch (error) {
      console.error('Error updating transaction:', error);
      addToast(error.message || 'Failed to update transaction', 'error');
    }
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  const handleDelete = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      const data = await response.json();
      
      // Update local transaction state
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => 
          t._id !== data.transaction._id
        )
      );
      
      // Update account state through context
      handleTransaction(data.transaction);
      
      addToast('Transaction deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      addToast('Failed to delete transaction', 'error');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold">Cash Flow Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <AmountRangeFilter
          onAmountChange={(amounts) => {
            setAmountFilter(amounts);
            fetchData();
          }}
        />
        <CategoryFilter
          onCategoryChange={(categories) => {
            setCategoryFilter(categories);
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Income</h3>
          <p className="text-lg font-bold text-green-600">
            ${stats.income.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Expenses</h3>
          <p className="text-lg font-bold text-red-600">
            ${stats.expenses.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Net Flow</h3>
          <p className={`text-lg font-bold ${
            stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${stats.netFlow.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Transaction Details</h3>
        
        {editingTransaction && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Edit Transaction</h3>
            <TransactionForm 
              onSubmit={handleUpdate}
              initialData={editingTransaction}
              isEditing={true}
            />
            <button
              onClick={handleCancel}
              className="mt-2 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="space-y-4">
          {sortedTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No transactions found for the selected period
            </p>
          ) : (
            sortedTransactions.map((transaction) => (
              <div 
                key={transaction._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.accountId?.type === 'cash' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <p className="font-semibold">{transaction.category}</p>
                    </div>
                    <div className="space-y-1 mt-1">
                      {transaction.description && (
                        <p className="text-sm text-gray-600">
                          {transaction.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.accountId?.name || 'Unknown Account'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}