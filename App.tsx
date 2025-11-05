import React, { useState, useMemo } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { Transaction, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import ExportModal from './components/ExportModal';
import ShareModal from './components/ShareModal';
import ShareOptionsMenu from './components/ShareOptionsMenu';
import { AddIcon, ExportIcon, ShareIcon } from './components/Icons';
import { useAuth } from './contexts/AuthContext';
import { serializeTransactionsForSharing } from './utils/sharing';

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
  const [isShareOptionsOpen, setIsShareOptionsOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // State for new simplified search
  const [searchQuery, setSearchQuery] = useState('');

  const { isAdmin } = useAuth();


  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return transactions;
    }
    
    return transactions.filter(tx => {
      const isUsdTx = tx.type === TransactionType.BUY || tx.type === TransactionType.SELL;
      
      const dateMatch = tx.date.includes(query);
      const amountMatch = isUsdTx && (tx.usdAmount ?? 0).toString().startsWith(query);
      const rateMatch = isUsdTx && (tx.usdRate ?? 0).toString().startsWith(query);
      
      return dateMatch || amountMatch || rateMatch;
    });
  }, [transactions, searchQuery]);

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

  const handleOpenShareReadOnlyModal = () => {
    if (!isAdmin) return;
    try {
      const rawTransactionsJson = window.localStorage.getItem('transactions');
      if (!rawTransactionsJson) {
        alert("No transactions to share.");
        return;
      }
      const transactionsToShare = JSON.parse(rawTransactionsJson);
      if (transactionsToShare.length === 0) {
        alert("No transactions to share.");
        return;
      }

      const compactData = serializeTransactionsForSharing(transactionsToShare);
      
      const unicodeBtoa = (str: string) => {
        const encoder = new TextEncoder();
        const uint8array = encoder.encode(str);
        let binStr = '';
        uint8array.forEach((byte) => {
            binStr += String.fromCharCode(byte);
        });
        return btoa(binStr);
      };

      const encodedData = encodeURIComponent(unicodeBtoa(compactData));
      const link = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      
      setShareableLink(link);
      setIsShareOptionsOpen(false);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error("Error generating shareable link:", e);
      alert("Could not generate shareable link. The data might be too large.");
    }
  };

  const handleOpenShareAdminModal = () => {
    if (!isAdmin) return;
    try {
      const rawTransactionsJson = window.localStorage.getItem('transactions');
      if (!rawTransactionsJson) {
        alert("No transactions to share.");
        return;
      }
      const transactionsToShare = JSON.parse(rawTransactionsJson);
      if (transactionsToShare.length === 0) {
        alert("No transactions to share.");
        return;
      }

      const compactData = serializeTransactionsForSharing(transactionsToShare);
      
      const unicodeBtoa = (str: string) => {
        const encoder = new TextEncoder();
        const uint8array = encoder.encode(str);
        let binStr = '';
        uint8array.forEach((byte) => {
            binStr += String.fromCharCode(byte);
        });
        return btoa(binStr);
      };

      const encodedData = encodeURIComponent(unicodeBtoa(compactData));
      const link = `${window.location.origin}${window.location.pathname}?mode=admin&data=${encodedData}`;
      
      setShareableLink(link);
      setIsShareOptionsOpen(false);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error("Error generating shareable admin link:", e);
      alert("Could not generate shareable link. The data might be too large.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        <header className="bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-500/20 rounded-xl py-4 sm:py-5 border border-slate-200/60">
            <h1 className="text-center font-hind-siliguri text-2xl sm:text-3xl font-bold text-indigo-900 text-shadow-custom">আর.এস নেক্সাস লিমিটেড</h1>
        </header>
      </div>

      <main className="px-4 pb-24">
        <Dashboard summaries={summaries} getDailySummary={getDailySummary} transactions={transactions} isAdmin={isAdmin} />
        <div className="mt-8">
          <TransactionList
            transactions={filteredTransactions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
      
      {isShareOptionsOpen && (
        <ShareOptionsMenu
          onClose={() => setIsShareOptionsOpen(false)}
          onShareReadOnly={handleOpenShareReadOnlyModal}
          onShareAdmin={handleOpenShareAdminModal}
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
        <div className="fixed bottom-4 left-4 right-4 z-10">
          <div className="max-w-md mx-auto flex justify-center items-center gap-3 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-500/20 rounded-xl p-2 border border-slate-200/60">
            <button
              onClick={() => setIsExportModalOpen(true)}
              aria-label="Export Transactions"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-br from-sky-500 to-blue-500 text-white font-semibold rounded-lg shadow-md shadow-sky-500/20 hover:-translate-y-0.5 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ExportIcon />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleOpenAddForm}
              aria-label="New Transaction"
              className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full hover:-translate-y-1 transform transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <AddIcon className="w-7 h-7" />
            </button>

            <button
              onClick={() => setIsShareOptionsOpen(true)}
              aria-label="Share Transactions"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;