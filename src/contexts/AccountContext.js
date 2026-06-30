'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch accounts from backend on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/accounts', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setAccounts(data.accounts);
        }
      } catch (error) {
        // Silent fail - user will see empty accounts
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);

  const addAccount = async (newAccount) => {
    try {
      const res = await fetch('/api/accounts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccount),
        credentials: 'include',
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add account');
      }
      setAccounts(prev => [...prev, data.account]);
      return data.account;
    } catch (error) {
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
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      setAccounts(prevAccounts => prevAccounts.filter(account => account._id !== id));
      return true;
    } catch (error) {
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
      const response = await fetch('/api/accounts', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch updated accounts');
      }

      const { accounts: updatedAccounts } = await response.json();
      setAccounts(updatedAccounts);
      
    } catch (error) {
      // Silent fail - accounts will update on next fetch
    }
  };

  return (
    <AccountContext.Provider value={{
      accounts,
      isLoading,
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