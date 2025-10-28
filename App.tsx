
import React, { useState, useMemo } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { Transaction, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import ExportModal from './components/ExportModal';
import { AddIcon, ExportIcon } from './components/Icons';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getDailySummary,
    summaries,
  } = useTransactions();

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // State for new range filters
  const [searchDate, setSearchDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const { isAdmin } = useAuth();


  const filteredTransactions = useMemo(() => {
    const minAmt = minAmount ? parseFloat(minAmount) : -Infinity;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    const minRt = minRate ? parseFloat(minRate) : -Infinity;
    const maxRt = maxRate ? parseFloat(maxRate) : Infinity;

    return transactions.filter(tx => {
      const isUsdTx = tx.type === TransactionType.BUY || tx.type === TransactionType.SELL;

      const matchesDate = searchDate === '' || tx.date === searchDate;

      // Only apply amount and rate filters to BUY/SELL transactions
      const matchesAmount = !isUsdTx || (
        (tx.usdAmount ?? 0) >= minAmt && (tx.usdAmount ?? 0) <= maxAmt
      );

      const matchesRate = !isUsdTx || (
        (tx.usdRate ?? 0) >= minRt && (tx.usdRate ?? 0) <= maxRt
      );

      return matchesDate && matchesAmount && matchesRate;
    });
  }, [transactions, searchDate, minAmount, maxAmount, minRate, maxRate]);

  const handleOpenAddForm = () => {
    if (!isAdmin) return;
    setEditingTransaction(null);
    setIsTransactionFormOpen(true);
  };

  const handleOpenEditForm = (transaction: Transaction) => {
    if (!isAdmin) return;
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTransaction(null);
    setIsTransactionFormOpen(false);
  };


  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <header className="flex justify-center my-6">
          <div className="bg-gradient-to-br from-sky-50 to-white shadow-xl rounded-full py-2 px-6 sm:py-3 sm:px-8 border border-slate-200/60">
              <h1 className="font-tiro-bangla text-2xl sm:text-3xl font-bold text-indigo-900 tracking-widest text-shadow-custom">আর.এস নেক্সাস লিমিটেড</h1>
          </div>
      </header>

      <main className="px-4 pt-2 pb-24">
        <Dashboard summaries={summaries} getDailySummary={getDailySummary} transactions={transactions} />
        <div className="mt-8">
          <TransactionList
            transactions={filteredTransactions}
            searchDate={searchDate}
            setSearchDate={setSearchDate}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            maxAmount={maxAmount}
            setMaxAmount={setMaxAmount}
            minRate={minRate}
            setMinRate={setMinRate}
            maxRate={maxRate}
            setMaxRate={setMaxRate}
            onEditTransaction={handleOpenEditForm}
            onDeleteTransaction={deleteTransaction}
            isAdmin={isAdmin}
          />
        </div>
      </main>
      
      {isTransactionFormOpen && (
        <TransactionForm
          onClose={handleCloseForm}
          onAddTransaction={addTransaction}
          onUpdateTransaction={updateTransaction}
          transactionToEdit={editingTransaction}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          transactions={transactions}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-center items-center gap-4">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ExportIcon />
            <span>Export</span>
          </button>
          <button
            onClick={handleOpenAddForm}
            disabled={!isAdmin}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            <AddIcon />
            <span>New Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
