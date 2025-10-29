import React from 'react';
import { formatCurrency } from '../utils/formatting';
import PaymentMethodIcon from './PaymentMethodIcon';
import { BalanceIcon } from './Icons';

interface BalanceByMethodProps {
  balances: { [key: string]: number };
}

const BalanceByMethod: React.FC<BalanceByMethodProps> = ({ balances }) => {
  // FIX: Explicitly cast the result of Object.entries(balances) to `[string, number][]`.
  // This resolves type errors by ensuring balance variables are correctly typed as 'number' for sorting, comparison, and formatting.
  const sortedBalances = (Object.entries(balances) as [string, number][])
    .sort(([, balanceA], [, balanceB]) => balanceB - balanceA);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
          <BalanceIcon />
          <h2 className="text-lg font-semibold text-slate-800">Account Balance</h2>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
        <ul className="space-y-3">
          {sortedBalances.map(([method, balance]) => (
            <li key={method} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <PaymentMethodIcon method={method} className="w-6 h-6" />
                <span className="font-semibold text-slate-700">{method}</span>
              </div>
              <span className={`font-bold text-lg ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BalanceByMethod;