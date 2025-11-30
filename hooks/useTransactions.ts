import { useState, useMemo, useCallback, useEffect } from 'react';
import { Transaction, TransactionType, GlobalSummaries } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { BANK_ACCOUNTS, PAYMENT_METHODS } from '../constants';
import { deserializeTransactionsForSharing, decodeData } from '../utils/sharing';

export const useTransactions = () => {
  const { isAdmin } = useAuth();
  
  // Initialize state directly from Local Storage or URL parameters
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // 1. Check URL for shared data
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');

    if (sharedData) {
      try {
        const decodedJson = decodeData(decodeURIComponent(sharedData));
        if (decodedJson) {
            const parsedTransactions = deserializeTransactionsForSharing(decodedJson);
            // Save to local storage immediately so it persists
            window.localStorage.setItem('transactions', JSON.stringify(parsedTransactions));
            return parsedTransactions;
        }
      } catch (e) {
        console.error("Failed to parse shared data", e);
      }
    }

    // 2. Fallback to Local Storage
    try {
      const localData = window.localStorage.getItem('transactions');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      console.error("Failed to load transactions from local storage", e);
      return [];
    }
  });

  // Effect to clean URL if data param was present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('data')) {
      const newUrl = window.location.pathname + (params.get('mode') ? `?mode=${params.get('mode')}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Helper to save to Local Storage
  const saveToLocalStorage = (data: Transaction[]) => {
    try {
      window.localStorage.setItem('transactions', JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to local storage", e);
      alert("Storage limit reached! Please export and clear old data.");
    }
  };

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;
    
    const newTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };

    setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        saveToLocalStorage(updated);
        return updated;
    });
  }, [isAdmin]);
  
  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    if (!isAdmin) return;

    setTransactions(prev => {
        const updated = prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx);
        saveToLocalStorage(updated);
        return updated;
    });
  }, [isAdmin]);

  const deleteTransaction = useCallback((id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    setTransactions(prev => {
        const updated = prev.filter(tx => tx.id !== id);
        saveToLocalStorage(updated);
        return updated;
    });
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
    isLoading: false, // Always false in local mode
    error: null
  };
};