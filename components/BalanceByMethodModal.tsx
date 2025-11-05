

import React, { useMemo } from 'react';
import BalanceByMethod from './BalanceByMethod';
import { formatCurrency } from '../utils/formatting';

interface BalanceByMethodModalProps {
  balances: { [key: string]: number };
  onClose: () => void;
  onShowBankDetails: () => void;
}

const BalanceByMethodModal: React.FC<BalanceByMethodModalProps> = ({ balances, onClose, onShowBankDetails }) => {
  const totalBalance = useMemo(() => {
    // FIX: Explicitly typed the accumulator and current value in the reduce function to solve a type inference issue.
    return Object.values(balances).reduce((sum: number, current: number) => sum + current, 0);
  }, [balances]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-xl w-full max-w-md border border-slate-200/60" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <BalanceByMethod
            balances={balances}
            onMethodClick={(method) => {
              if (method === 'Bank') {
                onShowBankDetails();
              }
            }}
          />
        </div>
        <div className="p-5 border-t border-green-200/60 flex justify-between items-center bg-green-50/50 rounded-b-lg">
          <h3 className="font-semibold text-slate-700 font-tiro-bangla">মোট বিডিটি ব্যালেন্স</h3>
          <span className={`font-bold text-xl ${totalBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(totalBalance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceByMethodModal;