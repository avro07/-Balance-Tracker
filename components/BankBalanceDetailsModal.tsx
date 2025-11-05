import React from 'react';
import { CloseIcon, BankIconSimple } from './Icons';
import { formatCurrency } from '../utils/formatting';

interface BankBalanceDetailsModalProps {
  balances: { [key: string]: number };
  onClose: () => void;
}

const BankBalanceDetailsModal: React.FC<BankBalanceDetailsModalProps> = ({ balances, onClose }) => {
  const sortedBalances = (Object.entries(balances) as [string, number][])
    .filter(([, balance]) => balance !== 0) // Hide zero-balance accounts
    .sort(([, balanceA], [, balanceB]) => balanceB - balanceA);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-xl w-full max-w-md border border-slate-200/60">
        <div className="p-5 border-b border-blue-200/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Bank Account Balances</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CloseIcon /></button>
        </div>
        <div className="p-5">
          {sortedBalances.length > 0 ? (
            <ul className="space-y-3">
              {sortedBalances.map(([bank, balance]) => (
                <li key={bank} className="flex items-center justify-between p-2 rounded-md">
                  <div className="flex items-center gap-3">
                    <BankIconSimple className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-slate-700">{bank}</span>
                  </div>
                  <span className={`font-bold text-lg ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                    {formatCurrency(balance)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500">No bank transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankBalanceDetailsModal;