'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateRangeFilter from '@/components/common/DateRangeFilter';

export default function DetailedCashFlow({ selectedAccounts = [] }) {
  const router = useRouter();
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let url = `/api/transactions/detailed-stats?start=${startDate}&end=${endDate}`;
      if (selectedAccounts.length > 0) {
        url += `&accounts=${selectedAccounts.join(',')}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      setStats({
        income: 0,
        expenses: 0,
        netFlow: 0
      });
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedAccounts]);

  const sortedTransactions = transactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold">Cash Flow Analysis</h2>
      
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

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
                        transaction.account?.type === 'cash' ? 'bg-green-500' : 'bg-blue-500'
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
                      {transaction.account?.name || 'Unknown Account'}
                    </p>
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