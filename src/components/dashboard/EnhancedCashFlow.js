'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateRangeFilter from '@/components/common/DateRangeFilter';

export default function EnhancedCashFlow({ selectedAccounts = [] }) {
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let url = `/api/transactions/stats?start=${startDate}&end=${endDate}`;
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
    } catch (error) {
      console.error('Error fetching data:', error);
      setStats({
        income: 0,
        expenses: 0,
        netFlow: 0
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedAccounts]);

  return (
    <div className="space-y-6">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="space-y-4 mt-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Income</h3>
            <span className="text-sm font-medium text-green-600">
              ${stats.income.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: stats.income > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Expenses</h3>
            <span className="text-sm font-medium text-red-600">
              ${stats.expenses.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ 
                width: stats.income > 0 
                  ? `${Math.min((stats.expenses / stats.income) * 100, 100)}%`
                  : '0%'
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Net Flow</h3>
            <span className={`text-sm font-medium ${
              stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${stats.netFlow.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}