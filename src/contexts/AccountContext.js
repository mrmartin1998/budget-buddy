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

  const handleTransaction = async (transaction) => {
    const { accountId, type, amount } = transaction;
    
    try {
      // Fetch fresh account data after transaction
      const token = localStorage.getItem('token');
      const response = await fetch('/api/accounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch updated accounts');
      }

      const { accounts: updatedAccounts } = await response.json();
      setAccounts(updatedAccounts);
      
    } catch (error) {
      console.error('Error updating accounts:', error);
    }
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