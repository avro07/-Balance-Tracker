import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatting';
import { BuyIcon, SellIcon, DepositIcon, WithdrawIcon, EditIcon, DeleteIcon, TransferIcon } from './Icons';
import PaymentMethodIcon from './PaymentMethodIcon';

interface TransactionListProps {
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  isAdmin: boolean;
}

const typeDetails = {
  [TransactionType.BUY]: { icon: <BuyIcon />, color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300', sign: '-', gradient: 'bg-gradient-to-br from-sky-50 to-white dark:from-slate-800/50 dark:to-slate-800/20' },
  [TransactionType.SELL]: { icon: <SellIcon />, color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300', sign: '+', gradient: 'bg-gradient-to-br from-rose-50 to-white dark:from-slate-800/50 dark:to-slate-800/20' },
  [TransactionType.DEPOSIT]: { icon: <DepositIcon />, color: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300', sign: '+', gradient: 'bg-gradient-to-br from-green-50 to-white dark:from-slate-800/50 dark:to-slate-800/20' },
  [TransactionType.WITHDRAW]: { icon: <WithdrawIcon />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300', sign: '-', gradient: 'bg-gradient-to-br from-amber-50 to-white dark:from-slate-800/50 dark:to-slate-800/20' },
  [TransactionType.TRANSFER]: { icon: <TransferIcon />, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300', sign: '', gradient: 'bg-gradient-to-br from-cyan-50 to-white dark:from-slate-800/50 dark:to-slate-800/20' },
};

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction: tx, onEdit, onDelete, isAdmin }) => {
  const details = typeDetails[tx.type];
  const isUsdTransaction = tx.type === TransactionType.BUY || tx.type === TransactionType.SELL;
  const isTransfer = tx.type === TransactionType.TRANSFER;

  return (
    <li className={`p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-4 ${details.gradient}`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${details.color}`}>
        {details.icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{tx.type}</span>
          <span className={`font-bold ${isTransfer ? 'text-slate-800 dark:text-slate-200' : (details.sign === '+' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}`}>
            {details.sign} {formatCurrency(tx.bdtAmount)}
          </span>
        </div>
        <div className="flex justify-between items-end text-sm text-slate-500 dark:text-slate-400 mt-1">
          <div>
            <div className="flex items-center gap-2 text-xs">
                <span>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1">
                    <PaymentMethodIcon method={tx.paymentMethod} className="w-4 h-4" />
                    <span>{tx.paymentMethod}</span>
                </div>
            </div>
            {isUsdTransaction && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatCurrency(tx.usdAmount || 0, 'USD')} @ {tx.usdRate?.toFixed(2)} (+{formatCurrency(tx.bdtCharge || 0, 'BDT')} charge)
                </p>
            )}
             {isTransfer && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {tx.bankAccount}
                    <span className="font-sans mx-1">→</span>
                    {tx.toPaymentMethod === 'Bank' ? tx.toBankAccount : tx.toPaymentMethod}
                </p>
            )}
          </div>
        </div>

        {tx.note && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                <p><strong className="font-medium text-slate-500 dark:text-slate-400">Note:</strong> {tx.note}</p>
            </div>
        )}
        
        {(tx.runningBdtBalance !== undefined && tx.runningUsdBalance !== undefined) && (
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4 text-xs">
                <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500">BDT Balance</span>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(tx.runningBdtBalance)}</p>
                </div>
                <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500">USD Balance</span>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(tx.runningUsdBalance, 'USD')}</p>
                </div>
            </div>
        )}
      </div>
      {isAdmin && (
        <div className="flex flex-col space-y-2 -mr-2">
          <button onClick={() => onEdit(tx)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-slate-700 rounded-md transition-colors">
            <EditIcon />
          </button>
          <button onClick={() => onDelete(tx.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-slate-700 rounded-md transition-colors">
            <DeleteIcon />
          </button>
        </div>
      )}
    </li>
  );
};

const FilterInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
  />
);

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  searchQuery,
  setSearchQuery,
  onEditTransaction, 
  onDeleteTransaction,
  isAdmin
}) => {
  return (
    <div>
      <div className="mb-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <FilterInput
          type="search"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map(tx => <TransactionItem key={tx.id} transaction={tx} onEdit={onEditTransaction} onDelete={onDeleteTransaction} isAdmin={isAdmin} />)}
        </ul>
      ) : (
        <div className="text-center py-10 px-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/80">
            <p className="text-slate-500 dark:text-slate-400">No transactions found.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters or add a new transaction.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;