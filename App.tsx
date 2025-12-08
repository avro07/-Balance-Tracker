
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
import { serializeTransactionsForSharing, encodeData } from './utils/sharing';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
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
      
      // Match against various fields.
      // For numbers, use startsWith for a better experience.
      // For text, use includes for partial matching.
      
      if (tx.date.includes(query)) return true;
      if (tx.type.toLowerCase().includes(query)) return true;
      if (tx.paymentMethod.toLowerCase().includes(query)) return true;
      if (tx.bankAccount?.toLowerCase().includes(query)) return true;
      if (tx.bdtAmount.toString().startsWith(query)) return true;
      if ((tx.bdtCharge ?? 0).toString().startsWith(query)) return true;
      if (tx.note?.toLowerCase().includes(query)) return true;
      
      // For USD-specific fields
      if (isUsdTx) {
        if ((tx.usdAmount ?? 0).toString().startsWith(query)) return true;
        if ((tx.usdRate ?? 0).toString().startsWith(query)) return true;
      }

      // For Transfer-specific fields
      if (tx.type === TransactionType.TRANSFER) {
        if (tx.toPaymentMethod?.toLowerCase().includes(query)) return true;
        if (tx.toBankAccount?.toLowerCase().includes(query)) return true;
      }
      
      return false;
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
      const encodedDataStr = encodeURIComponent(encodeData(compactData));
      const link = `${window.location.origin}${window.location.pathname}?data=${encodedDataStr}`;
      
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
      const encodedDataStr = encodeURIComponent(encodeData(compactData));
      const link = `${window.location.origin}${window.location.pathname}?mode=admin&data=${encodedDataStr}`;
      
      setShareableLink(link);
      setIsShareOptionsOpen(false);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error("Error generating shareable admin link:", e);
      alert("Could not generate shareable link. The data might be too large.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-[#020617] dark:to-[#0f172a] min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <div className="px-3 sm:px-6 pt-2 pb-4 header-container-safe-area flex-shrink-0">
        <header className="relative bg-transparent shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 rounded-lg py-3 border border-slate-200/60 dark:border-slate-800">
            <h1 className="text-center font-hind-siliguri text-xl sm:text-3xl font-semibold text-shadow-custom animate-gradient-text px-10">আর.এস নেক্সাস লিমিটেড</h1>
            <div className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2">
              <ThemeToggle />
            </div>
        </header>
      </div>
      
      <div className="bg-slate-50 dark:bg-[#020617] flex-grow rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-white/50 dark:border-slate-800/50 relative overflow-hidden">
        <main className={`px-3 pt-6 sm:px-4 sm:pt-8 ${isAdmin ? 'pb-32' : 'pb-10'}`}>
          <Dashboard summaries={summaries} transactions={transactions} isAdmin={isAdmin} />
          <div className="mt-6 sm:mt-8">
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
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] transition-all duration-300">
            <div className="max-w-xl mx-auto px-8 h-20 flex justify-between items-center relative">
              <button
                onClick={() => setIsExportModalOpen(true)}
                aria-label="Export Transactions"
                className="group flex flex-col items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors active:scale-95"
              >
                <div className="p-2 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-slate-800 transition-colors">
                  <ExportIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Export</span>
              </button>
              
              <div className="relative -top-10 group cursor-pointer" onClick={handleOpenAddForm}>
                {/* Pulsing Glow Background */}
                <div className="absolute inset-3 bg-indigo-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity duration-500"></div>
                
                {/* Main Button */}
                <button
                  aria-label="New Transaction"
                  className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all duration-300 border-[6px] border-slate-50 dark:border-slate-900 z-10 overflow-hidden"
                >
                  {/* Inner sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                  
                  {/* Icon with Animation */}
                  <AddIcon className="w-9 h-9 animate-plus-icon drop-shadow-md relative z-20" />
                </button>
              </div>

              <button
                onClick={() => setIsShareOptionsOpen(true)}
                aria-label="Share Transactions"
                className="group flex flex-col items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors active:scale-95"
              >
                <div className="p-2 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-slate-800 transition-colors">
                   <ShareIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Share</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
