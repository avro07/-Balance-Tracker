
import React from 'react';
import { CloseIcon } from './Icons';
import BalanceByMethod from './BalanceByMethod';

interface BalanceByMethodModalProps {
  balances: { [key: string]: number };
  onClose: () => void;
}

const BalanceByMethodModal: React.FC<BalanceByMethodModalProps> = ({ balances, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-xl w-full max-w-md border border-slate-200/60">
        <div className="p-5 border-b border-green-200/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Account Balance</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><CloseIcon /></button>
        </div>
        <div className="p-5">
          <BalanceByMethod balances={balances} />
        </div>
      </div>
    </div>
  );
};

export default BalanceByMethodModal;