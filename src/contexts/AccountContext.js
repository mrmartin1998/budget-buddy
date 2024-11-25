'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  
  // Fetch accounts from backend on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAccounts(data.accounts);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    
    fetchAccounts();
  }, []);

  const addAccount = async (newAccount) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/accounts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAccount),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add account');
      }
      setAccounts(prev => [...prev, data.account]);
      return data.account;
    } catch (error) {
      console.error('Error adding account:', error);
      throw error; // Re-throw for component handling
    }
  };

  const updateAccount = (id, updatedData) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, ...updatedData } : account
    ));
  };

  const deleteAccount = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      setAccounts(prevAccounts => prevAccounts.filter(account => account._id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Update handleTransaction to include account information
  const handleTransaction = (transaction) => {
    const { accountId, type, amount } = transaction;
    const parsedAmount = Math.abs(parseFloat(amount));
    
    setAccounts(prevAccounts => prevAccounts.map(account => {
      if (account._id === accountId) {
        const newBalance = type === 'income' 
          ? (account.balance || 0) + parsedAmount
          : (account.balance || 0) - parsedAmount;
          
        return {
          ...account,
          balance: Number(newBalance.toFixed(2)),
          totalIncome: type === 'income'
            ? Number(((account.totalIncome || 0) + parsedAmount).toFixed(2))
            : (account.totalIncome || 0),
          totalExpenses: type === 'expense'
            ? Number(((account.totalExpenses || 0) + parsedAmount).toFixed(2))
            : (account.totalExpenses || 0)
        };
      }
      return account;
    }));
  };

  return (
    <AccountContext.Provider value={{
      accounts,
      addAccount,
      updateAccount,
      deleteAccount,
      getTotalBalance,
      handleTransaction,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
}