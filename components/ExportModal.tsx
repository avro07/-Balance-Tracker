
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
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-xl w-full max-w-md border border-slate-200/60" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-indigo-200/60">
          <h2 className="text-lg font-semibold">Export Transactions</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="From Date" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <InputField label="To Date" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <p className="text-sm text-slate-500">Records found in range</p>
            <p className="font-bold text-lg text-indigo-600">{filteredTransactions.length}</p>
          </div>
        </div>
        <div className="p-5 border-t border-indigo-200/60 flex justify-center">
            <button
              onClick={handleExport}
              disabled={filteredTransactions.length === 0}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
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
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
  </div>
);

export default ExportModal;