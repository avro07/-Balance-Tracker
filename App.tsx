
import React, { useState, useMemo } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { Transaction, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import ExportModal from './components/ExportModal';
import ShareModal from './components/ShareModal';
import { AddIcon, ExportIcon, ShareIcon } from './components/Icons';
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
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

  const handleOpenShareModal = () => {
    if (!isAdmin) return;
    try {
      const rawTransactions = window.localStorage.getItem('transactions');
      if (!rawTransactions || JSON.parse(rawTransactions).length === 0) {
        alert("No transactions to share.");
        return;
      }

      const encodedData = encodeURIComponent(btoa(rawTransactions));
      const link = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      
      setShareableLink(link);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error("Error generating shareable link:", e);
      alert("Could not generate shareable link. The data might be too large.");
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="p-4 sm:p-6">
        <header className="bg-gradient-to-br from-sky-50 to-white shadow-md rounded-xl py-4 sm:py-5 border border-slate-200/60">
            <h1 className="text-center font-tiro-bangla text-2xl sm:text-3xl font-bold text-indigo-900 tracking-widest text-shadow-custom">আর.এস নেক্সাস লিমিটেড</h1>
        </header>
      </div>

      <main className="px-4 pb-24">
        <Dashboard summaries={summaries} getDailySummary={getDailySummary} transactions={transactions} isAdmin={isAdmin} />
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

      {isShareModalOpen && (
        <ShareModal
          link={shareableLink}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Bottom Action Bar - Only for Admins */}
      {isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-sky-50 to-white border-t border-slate-200/70 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="max-w-md mx-auto flex justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ExportIcon />
              <span>Export</span>
            </button>
             <button
              onClick={handleOpenShareModal}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ShareIcon />
              <span>Share</span>
            </button>
            <button
              onClick={handleOpenAddForm}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:-translate-y-0.5 transform transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AddIcon />
              <span>New Transaction</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
