import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { downloadCSV } from '../utils/csv';
import { getTodayDateString } from '../utils/formatting';
import { DownloadIcon } from './Icons';

interface ExportModalProps {
  transactions: Transaction[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ transactions, onClose }) => {
  const today = getTodayDateString();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const start = new Date(fromDate);
      const end = new Date(toDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return txDate >= start && txDate <= end;
    });
  }, [transactions, fromDate, toDate]);

  const handleExport = () => {
    downloadCSV(filteredTransactions, `transactions_${fromDate}_to_${toDate}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200/60 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-indigo-200/60 dark:border-indigo-500/20">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Export Transactions</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="From Date" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <InputField label="To Date" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Records found in range</p>
            <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{filteredTransactions.length}</p>
          </div>
        </div>
        <div className="p-5 border-t border-indigo-200/60 dark:border-indigo-500/20 flex justify-center">
            <button
              onClick={handleExport}
              disabled={filteredTransactions.length === 0}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-500/50"
            >
              <DownloadIcon />
              <span>Download CSV</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
  </div>
);

export default ExportModal;