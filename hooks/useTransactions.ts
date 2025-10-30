import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Transaction, TransactionType, DailySummary, GlobalSummaries } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { BANK_ACCOUNTS, PAYMENT_METHODS } from '../constants';
import { deserializeTransactionsForSharing } from '../utils/sharing';

// Demo data for initial setup
const getDemoData = (): Transaction[] => [
  { id: '1', date: '2025-10-06', type: TransactionType.BUY, paymentMethod: 'Bank', bankAccount: 'City Bank', usdAmount: 100, usdRate: 115.50, bdtCharge: 231, bdtAmount: 11781 },
  { id: '2', date: '2025-10-07', type: TransactionType.DEPOSIT, paymentMethod: 'Cash', bdtAmount: 50000, note: 'Initial capital injection.' },
  { id: '3', date: '2025-10-08', type: TransactionType.SELL, paymentMethod: 'bKash', usdAmount: 50, usdRate: 116.00, bdtCharge: 116, bdtAmount: 5916 },
  { id: '4', date: getTodayDateString(), type: TransactionType.BUY, paymentMethod: 'Bank', bankAccount: 'Eastern Bank', usdAmount: 200, usdRate: 115.80, bdtCharge: 347.4, bdtAmount: 23507.4 },
  { id: '5', date: getTodayDateString(), type: TransactionType.TRANSFER, paymentMethod: 'Bank', bankAccount: 'City Bank', toPaymentMethod: 'bKash', bdtAmount: 5000, note: 'Personal transfer' },
];

const getTodayDateString = (): string => new Date().toISOString().split('T')[0];

export const useTransactions = () => {
  const { isAdmin } = useAuth();
  const [storedTransactions, setStoredTransactions] = useLocalStorage<Transaction[]>('transactions', getDemoData());

  const transactionsSource = useMemo(() => {
    // Admins always use localStorage.
    if (isAdmin) {
      return storedTransactions;
    }

    // For public users, check for shared data in the URL.
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');

    if (sharedData) {
      try {
        // Decode and deserialize the transaction data from the URL.
        const jsonString = atob(decodeURIComponent(sharedData));
        // The deserialization function handles both new compact and old object formats.
        const parsedTransactions = deserializeTransactionsForSharing(jsonString);
        if (Array.isArray(parsedTransactions)) {
          return parsedTransactions;
        }
      } catch (e) {
        console.error("Failed to parse shared data:", e);
        // Fallback to demo data if parsing fails.
        return getDemoData();
      }
    }

    // Default for public users is the static demo data.
    return getDemoData();
  }, [isAdmin, storedTransactions]);


  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setStoredTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [setStoredTransactions, isAdmin]);
  
  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    if (!isAdmin) return;
    setStoredTransactions(prev => 
      prev
        .map(tx => (tx.id === updatedTransaction.id ? updatedTransaction : tx))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [setStoredTransactions, isAdmin]);

  const deleteTransaction = useCallback((id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setStoredTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  }, [setStoredTransactions, isAdmin]);

  const transactionsWithRunningBalance = useMemo(() => {
    // Sort chronologically to calculate running balance correctly
    const sorted = [...transactionsSource].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        // If dates are the same, sort by ID to maintain a stable order
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

    // Reverse back to descending order for display
    return augmented.reverse();
  }, [transactionsSource]);


  const summaries: GlobalSummaries = useMemo(() => {
    const initialBalanceByMethod: { [key: string]: number } = {};
    PAYMENT_METHODS.forEach(method => {
        initialBalanceByMethod[method] = 0;
    });

    const initialBalanceByBank: { [key: string]: number } = {};
    BANK_ACCOUNTS.forEach(bank => {
        initialBalanceByBank[bank] = 0;
    });

    return transactionsSource.reduce((acc, tx) => {
      acc.totalTransactions += 1;
      const method = tx.paymentMethod;
      if (acc.bdtBalanceByMethod[method] === undefined) {
          acc.bdtBalanceByMethod[method] = 0;
      }
      
      if (tx.type === TransactionType.TRANSFER) {
        // A transfer has a net zero effect on the total BDT balance
        // but moves funds between methods/accounts.
        const fromMethod = tx.paymentMethod;
        const toMethod = tx.toPaymentMethod;

        // Decrease from source
        if (acc.bdtBalanceByMethod[fromMethod] !== undefined) {
          acc.bdtBalanceByMethod[fromMethod] -= tx.bdtAmount;
        }
        if (fromMethod === 'Bank' && tx.bankAccount) {
          acc.bdtBalanceByBank[tx.bankAccount] = (acc.bdtBalanceByBank[tx.bankAccount] || 0) - tx.bdtAmount;
        }
        
        // Increase at destination
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
  }, [transactionsSource]);

  const getDailySummary = useCallback((date: string): DailySummary => {
    const dailyTransactions = transactionsSource.filter(tx => tx.date === date);

    return dailyTransactions.reduce((acc, tx) => {
      if (tx.type === TransactionType.BUY) {
        acc.totalBuyUSD += tx.usdAmount || 0;
        acc.totalBuyBDT += tx.bdtAmount;
      } else if (tx.type === TransactionType.SELL) {
        acc.totalSellUSD += tx.usdAmount || 0;
        acc.totalSellBDT += tx.bdtAmount;
      }
      acc.profit = acc.totalSellBDT - acc.totalBuyBDT;
      return acc;
    }, { totalBuyUSD: 0, totalBuyBDT: 0, totalSellUSD: 0, totalSellBDT: 0, profit: 0 });

  }, [transactionsSource]);

  return { transactions: transactionsWithRunningBalance, addTransaction, updateTransaction, deleteTransaction, summaries, getDailySummary };
};