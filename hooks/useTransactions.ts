
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, TransactionType, GlobalSummaries } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { BANK_ACCOUNTS, PAYMENT_METHODS, API_BASE_URL } from '../constants';

export const useTransactions = () => {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Initialize from local storage immediately for speed/offline support
    try {
      const localData = window.localStorage.getItem('transactions');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync with Local Storage helper
  const saveToLocalStorage = (data: Transaction[]) => {
    window.localStorage.setItem('transactions', JSON.stringify(data));
  };

  // Fetch transactions from Server
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Attempt to fetch from server
      const response = await fetch(API_BASE_URL);
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
          saveToLocalStorage(data); // Update local backup
          setError(null);
        }
      } else {
        console.warn('Server responded with error, using local data:', response.statusText);
      }
    } catch (err) {
      console.warn("Server unreachable, using local data.");
      // No need to do anything else, we already initialized from local storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;
    
    const newTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };

    // Optimistic Update: Update UI & Local Storage immediately
    setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        saveToLocalStorage(updated);
        return updated;
    });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error('Server error');
    } catch (err) {
      console.warn("Failed to save to server, saved locally only.");
      // We do NOT revert state here, keeping the local data intact
    }
  }, [isAdmin]);
  
  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    if (!isAdmin) return;

    // Optimistic Update
    setTransactions(prev => {
        const updated = prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx);
        saveToLocalStorage(updated);
        return updated;
    });

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTransaction),
        });

        if (!response.ok) throw new Error('Server error');
    } catch (err) {
        console.warn("Failed to update on server, updated locally only.");
    }
  }, [isAdmin]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    // Optimistic Update
    setTransactions(prev => {
        const updated = prev.filter(tx => tx.id !== id);
        saveToLocalStorage(updated);
        return updated;
    });

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Server error');
    } catch (err) {
        console.warn("Failed to delete from server, deleted locally only.");
    }
  }, [isAdmin]);

  // Calculate Running Balances
  const transactionsWithRunningBalance = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        return a.id.localeCompare(b.id);
    });

    let runningBdt = 0;
    let runningUsd = 0;

    const augmented = sorted.map(tx => {
      if (tx.type === TransactionType.BUY) {
        runningUsd += tx.usdAmount || 0;
        runningBdt -= tx.bdtAmount;
      } else if (tx.type === TransactionType.SELL) {
        runningUsd -= tx.usdAmount || 0;
        runningBdt += tx.bdtAmount;
      } else if (tx.type === TransactionType.DEPOSIT) {
        runningBdt += tx.bdtAmount;
      } else if (tx.type === TransactionType.WITHDRAW) {
        runningBdt -= tx.bdtAmount;
      }
      
      return {
        ...tx,
        runningBdtBalance: runningBdt,
        runningUsdBalance: runningUsd,
      };
    });

    return augmented.reverse();
  }, [transactions]);


  // Calculate Summaries
  const summaries: GlobalSummaries = useMemo(() => {
    const initialBalanceByMethod: { [key: string]: number } = {};
    PAYMENT_METHODS.forEach(method => {
        initialBalanceByMethod[method] = 0;
    });

    const initialBalanceByBank: { [key: string]: number } = {};
    BANK_ACCOUNTS.forEach(bank => {
        initialBalanceByBank[bank] = 0;
    });

    return transactions.reduce((acc, tx) => {
      acc.totalTransactions += 1;
      const method = tx.paymentMethod;
      
      if (acc.bdtBalanceByMethod[method] === undefined) {
          acc.bdtBalanceByMethod[method] = 0;
      }

      if (tx.type === TransactionType.TRANSFER) {
        const fromMethod = tx.paymentMethod;
        const toMethod = tx.toPaymentMethod;

        if (acc.bdtBalanceByMethod[fromMethod] !== undefined) {
          acc.bdtBalanceByMethod[fromMethod] -= tx.bdtAmount;
        }
        if (fromMethod === 'Bank' && tx.bankAccount) {
          acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) - tx.bdtAmount;
        }
        
        if (toMethod) {
          if (acc.bdtBalanceByMethod[toMethod] === undefined) acc.bdtBalanceByMethod[toMethod] = 0;
          acc.bdtBalanceByMethod[toMethod] += tx.bdtAmount;
          
          if (toMethod === 'Bank' && tx.toBankAccount) {
            acc.bdtBalanceByBank[tx.toBankAccount] = (acc.bdtBalanceByBank[tx.toBankAccount] || 0) + tx.bdtAmount;
          }
        }
      } else if (tx.type === TransactionType.BUY) {
        const usdAmount = tx.usdAmount || 0;
        acc.usdBalance += usdAmount;
        acc.totalBuy += usdAmount;
        acc.bdtBalance -= tx.bdtAmount;
        acc.totalChargesBdt += tx.bdtCharge || 0;
        acc.bdtBalanceByMethod[method] -= tx.bdtAmount;
        if (tx.paymentMethod === 'Bank' && tx.bankAccount) {
            acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) - tx.bdtAmount;
        }
      } else if (tx.type === TransactionType.SELL) {
        const usdAmount = tx.usdAmount || 0;
        acc.usdBalance -= usdAmount;
        acc.totalSell += usdAmount;
        acc.bdtBalance += tx.bdtAmount;
        acc.totalChargesBdt += tx.bdtCharge || 0;
        acc.bdtBalanceByMethod[method] += tx.bdtAmount;
         if (tx.paymentMethod === 'Bank' && tx.bankAccount) {
            acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) + tx.bdtAmount;
        }
      } else if (tx.type === TransactionType.DEPOSIT) {
        acc.bdtBalance += tx.bdtAmount;
        acc.bdtBalanceByMethod[method] += tx.bdtAmount;
         if (tx.paymentMethod === 'Bank' && tx.bankAccount) {
            acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) + tx.bdtAmount;
        }
      } else if (tx.type === TransactionType.WITHDRAW) {
        acc.bdtBalance -= tx.bdtAmount;
        acc.bdtBalanceByMethod[method] -= tx.bdtAmount;
         if (tx.paymentMethod === 'Bank' && tx.bankAccount) {
            acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) - tx.bdtAmount;
        }
      }

      return acc;
    }, {
      bdtBalance: 0,
      usdBalance: 0,
      totalBuy: 0,
      totalSell: 0,
      totalChargesBdt: 0,
      totalTransactions: 0,
      bdtBalanceByMethod: initialBalanceByMethod,
      bdtBalanceByBank: initialBalanceByBank,
    });
  }, [transactions]);

  return { 
    transactions: transactionsWithRunningBalance, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    summaries,
    isLoading,
    error
  };
};
