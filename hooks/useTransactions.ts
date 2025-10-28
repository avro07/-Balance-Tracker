import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Transaction, TransactionType, DailySummary, GlobalSummaries } from '../types';

// Demo data for initial setup
const getDemoData = (): Transaction[] => [
  { id: '1', date: '2025-10-06', type: TransactionType.BUY, paymentMethod: 'Bank', usdAmount: 100, usdRate: 115.50, bdtCharge: 231, bdtAmount: 11781 },
  { id: '2', date: '2025-10-07', type: TransactionType.DEPOSIT, paymentMethod: 'Cash', bdtAmount: 50000, note: 'Initial capital injection.' },
  { id: '3', date: '2025-10-08', type: TransactionType.SELL, paymentMethod: 'bKash', usdAmount: 50, usdRate: 116.00, bdtCharge: 116, bdtAmount: 5916 },
  { id: '4', date: getTodayDateString(), type: TransactionType.BUY, paymentMethod: 'Bank', usdAmount: 200, usdRate: 115.80, bdtCharge: 347.4, bdtAmount: 23507.4 },
];

const getTodayDateString = (): string => new Date().toISOString().split('T')[0];

export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', getDemoData());

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [setTransactions]);
  
  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev
        .map(tx => (tx.id === updatedTransaction.id ? updatedTransaction : tx))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [setTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  }, [setTransactions]);

  const transactionsWithRunningBalance = useMemo(() => {
    // Sort chronologically to calculate running balance correctly
    const sorted = [...transactions].sort((a, b) => {
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
  }, [transactions]);


  const summaries: GlobalSummaries = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      acc.totalTransactions += 1;
      
      if (tx.type === TransactionType.BUY) {
        const usdAmount = tx.usdAmount || 0;
        acc.usdBalance += usdAmount;
        acc.totalBuy += usdAmount;
        acc.bdtBalance -= tx.bdtAmount;
        acc.totalChargesBdt += tx.bdtCharge || 0;
      } else if (tx.type === TransactionType.SELL) {
        const usdAmount = tx.usdAmount || 0;
        acc.usdBalance -= usdAmount;
        acc.totalSell += usdAmount;
        acc.bdtBalance += tx.bdtAmount;
        acc.totalChargesBdt += tx.bdtCharge || 0;
      } else if (tx.type === TransactionType.DEPOSIT) {
        acc.bdtBalance += tx.bdtAmount;
      } else if (tx.type === TransactionType.WITHDRAW) {
        acc.bdtBalance -= tx.bdtAmount;
      }

      return acc;
    }, {
      bdtBalance: 0,
      usdBalance: 0,
      totalBuy: 0,
      totalSell: 0,
      totalChargesBdt: 0,
      totalTransactions: 0,
    });
  }, [transactions]);

  const getDailySummary = useCallback((date: string): DailySummary => {
    const dailyTransactions = transactions.filter(tx => tx.date === date);

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

  }, [transactions]);

  return { transactions: transactionsWithRunningBalance, addTransaction, updateTransaction, deleteTransaction, summaries, getDailySummary };
};