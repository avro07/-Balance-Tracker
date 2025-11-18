import React from 'react';
import { GlobalSummaries } from '../types';
import { formatCurrency } from '../utils/formatting';
import { BuyIcon, SellIcon, ChargeIcon, TransactionIcon } from './Icons';

interface SummaryCardsProps {
    summaries: GlobalSummaries;
    isAdmin: boolean;
    onBdtBalanceClick: () => void;
}

const SummaryCard: React.FC<{
  title: string;
  value: string;
  backgroundIcon: React.ReactElement;
  gradientClass: string;
  iconClass: string;
  colSpan?: string;
  onClick?: () => void;
}> = ({ title, value, backgroundIcon, gradientClass, iconClass, colSpan, onClick }) => {
    
  // Safe extraction of existing className to prevent runtime errors
  const iconProps = (backgroundIcon as React.ReactElement<{ className?: string }>).props;
  const existingIconClass = iconProps?.className || '';

  return (
  <div
    onClick={onClick}
    className={`relative p-4 sm:p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-all duration-300 ${gradientClass} ${colSpan || ''} ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} flex items-center justify-between overflow-hidden`}
  >
    <div className="relative z-10 flex-1 min-w-0 mr-2">
      <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-slate-50 truncate font-hind-siliguri leading-tight tracking-tight" title={value}>{value}</p>
    </div>
    <div className={`flex-shrink-0 relative z-0 ${iconClass} opacity-90`}>
      {React.cloneElement(backgroundIcon as React.ReactElement<{ className?: string }>, { 
        className: `${existingIconClass} w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center` 
      })}
    </div>
  </div>
)};


const SummaryCards: React.FC<SummaryCardsProps> = ({ summaries, isAdmin, onBdtBalanceClick }) => {
    const cards = [
        { 
            title: 'BDT Balance',
            value: formatCurrency(summaries.bdtBalance), 
            backgroundIcon: <span className="font-bold leading-none flex items-center justify-center" style={{fontSize: '3.5rem'}}>৳</span>,
            gradientClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-slate-900/20',
            iconClass: 'text-green-600/40 dark:text-green-400/40',
            colSpan: 'col-span-2 sm:col-span-1', // Full width on mobile to fit large numbers
            ...(isAdmin && { onClick: onBdtBalanceClick })
        },
        { 
            title: 'USD Balance', 
            value: formatCurrency(summaries.usdBalance, 'USD'), 
            backgroundIcon: <span className="font-bold leading-none flex items-center justify-center" style={{fontSize: '3.5rem'}}>$</span>,
            gradientClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-slate-900/20',
            iconClass: 'text-blue-600/40 dark:text-blue-400/40',
            colSpan: 'col-span-2 sm:col-span-1', // Full width on mobile
        },
        { 
            title: 'Total Buy (USD)', 
            value: formatCurrency(summaries.totalBuy, 'USD'), 
            backgroundIcon: <BuyIcon />,
            gradientClass: 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-slate-900/20',
            iconClass: 'text-sky-600/40 dark:text-sky-400/40',
        },
        { 
            title: 'Total Sell (USD)', 
            value: formatCurrency(summaries.totalSell, 'USD'), 
            backgroundIcon: <SellIcon />,
            gradientClass: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-slate-900/20',
            iconClass: 'text-red-600/40 dark:text-red-400/40',
        },
        { 
            title: 'Total Charges (BDT)', 
            value: formatCurrency(summaries.totalChargesBdt, 'BDT'), 
            backgroundIcon: <ChargeIcon />,
            gradientClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-slate-900/20',
            iconClass: 'text-yellow-600/40 dark:text-yellow-400/40',
        },
        {
            title: 'Total Transactions',
            value: summaries.totalTransactions.toLocaleString('en-US'),
            backgroundIcon: <TransactionIcon />,
            gradientClass: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-slate-900/20',
            iconClass: 'text-purple-600/40 dark:text-purple-400/40',
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {cards.map(card => <SummaryCard key={card.title} {...card} />)}
        </div>
    );
};

export default SummaryCards;