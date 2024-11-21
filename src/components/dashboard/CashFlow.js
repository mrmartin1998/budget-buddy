'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CashFlow() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyStats, setMonthlyStats] = useState({
    income: 0,
    expenses: 0,
    netFlow: 0
  });

  const fetchMonthlyData = async (month) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/transactions/monthly/${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch monthly data');
      }

      const data = await res.json();
      return {
        income: data.totalIncome || 0,
        expenses: data.totalExpenses || 0,
        netFlow: (data.totalIncome || 0) - (data.totalExpenses || 0)
      };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      return {
        income: 0,
        expenses: 0,
        netFlow: 0
      };
    }
  };

  useEffect(() => {
    const updateMonthlyStats = async () => {
      const data = await fetchMonthlyData(selectedMonth);
      setMonthlyStats(data);
    };
    
    updateMonthlyStats();
  }, [selectedMonth]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Income</h3>
            <span className="text-sm font-medium text-green-600">
              ${monthlyStats.income.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: monthlyStats.income > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Expenses</h3>
            <span className="text-sm font-medium text-red-600">
              ${monthlyStats.expenses.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ 
                width: monthlyStats.income > 0 
                  ? `${Math.min((monthlyStats.expenses / monthlyStats.income) * 100, 100)}%`
                  : '0%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
