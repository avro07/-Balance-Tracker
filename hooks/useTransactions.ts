import { useMemo, useCallback, useEffect, useState } from 'react';
import { Transaction, TransactionType, GlobalSummaries } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { BANK_ACCOUNTS, PAYMENT_METHODS, API_BASE_URL } from '../constants';

// NOTE: This hook now connects to an external server defined in constants.ts (API_BASE_URL).
// Ensure your backend supports GET, POST, PUT, DELETE at the /transactions endpoint.

export const useTransactions = () => {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from the server on mount
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/transactions`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      // Ensure date sorting
      const sortedData = Array.isArray(data) 
        ? data.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : [];
      setTransactions(sortedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load data from server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;
    
    // Optimistic ID generation (Server might overwrite this)
    const newTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error("Failed to save transaction");
      
      // Refresh data from server to ensure sync
      await fetchTransactions();
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Error saving to server. Please try again.");
    }
  }, [isAdmin, fetchTransactions]);
  
  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      // Refresh data
      await fetchTransactions();
    } catch (err) {
      console.error("Error updating transaction:", err);
      alert("Error updating record on server.");
    }
  }, [isAdmin, fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error("Failed to delete transaction");

        // Refresh data
        await fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
        alert("Error deleting record from server.");
      }
    }
  }, [isAdmin, fetchTransactions]);

  // Calculate Running Balances (Client-side logic preserved)
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
