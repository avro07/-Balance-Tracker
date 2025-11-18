import React from 'react';
import { formatCurrency } from '../utils/formatting';
import PaymentMethodIcon from './PaymentMethodIcon';
import { ArrowRightIcon } from './Icons';

interface BalanceByMethodProps {
  balances: { [key: string]: number };
  onMethodClick?: (method: string) => void;
}

const BalanceByMethod: React.FC<BalanceByMethodProps> = ({ balances, onMethodClick }) => {
  const sortedBalances = (Object.entries(balances) as [string, number][])
    .sort(([, balanceA], [, balanceB]) => balanceB - balanceA);

  return (
    <ul className="space-y-3">
      {sortedBalances.map(([method, balance]) => {
        const isBank = method === 'Bank';
        const isClickable = isBank && onMethodClick;

        return (
          <li
            key={method}
            onClick={() => isClickable && onMethodClick(method)}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${isClickable ? 'cursor-pointer hover:bg-green-100/50 dark:hover:bg-slate-700/50' : ''}`}
            role={isClickable ? 'button' : 'listitem'}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={(e) => {
              if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                onMethodClick(method);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <PaymentMethodIcon method={method} className="w-6 h-6" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{method}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg ${balance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </span>
              {isClickable && <ArrowRightIcon className="w-4 h-4 text-slate-400" />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BalanceByMethod;