
import React from 'react';
import { formatCurrency } from '../utils/formatting';
import PaymentMethodIcon from './PaymentMethodIcon';

interface BalanceByMethodProps {
  balances: { [key: string]: number };
}

const BalanceByMethod: React.FC<BalanceByMethodProps> = ({ balances }) => {
  const sortedBalances = (Object.entries(balances) as [string, number][])
    .sort(([, balanceA], [, balanceB]) => balanceB - balanceA);

  return (
    <ul className="space-y-3">
      {sortedBalances.map(([method, balance]) => (
        <li key={method} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-green-100/50">
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
  );
};

export default BalanceByMethod;