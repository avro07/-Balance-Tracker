
import React, { useMemo } from 'react';
import { CloseIcon } from './Icons';
import BalanceByMethod from './BalanceByMethod';
import { formatCurrency } from '../utils/formatting';

interface BalanceByMethodModalProps {
  balances: { [key: string]: number };
  onClose: () => void;
  onShowBankDetails: () => void;
}

const BalanceByMethodModal: React.FC<BalanceByMethodModalProps> = ({ balances, onClose, onShowBankDetails }) => {
  const totalBalance = useMemo(() => {
    return Object.values(balances).reduce((sum, current) => sum + current, 0);
  }, [balances]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-xl w-full max-w-md border border-slate-200/60">
        <div className="p-5 border-b border-green-200/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 font-tiro-bangla">ওয়ালেট অনুযায়ী ব্যালেন্স</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><CloseIcon /></button>
        </div>
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
