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
  iconColorClass: string;
  onClick?: () => void;
}> = ({ title, value, backgroundIcon, gradientClass, iconColorClass, onClick }) => {
    
  // Safe extraction of existing className to prevent runtime errors
  const iconProps = (backgroundIcon as React.ReactElement<{ className?: string }>).props;
  const existingIconClass = iconProps?.className || '';

  return (
  <div
    onClick={onClick}
    className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 transition-all duration-300 ${gradientClass} ${onClick ? 'cursor-pointer active:scale-95' : ''} overflow-hidden min-h-[90px] sm:min-h-[110px] flex flex-col justify-center`}
  >
    <div className="relative z-10">
      <p className="text-[0.7rem] sm:text-xs font-bold text-slate-600/90 dark:text-slate-400 mb-1 uppercase tracking-wide">{title}</p>
      <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-hind-siliguri leading-normal tracking-tight truncate pb-1" title={value}>
        {value}
      </p>
    </div>
    
    <div className={`absolute -right-2 -top-2 sm:-right-4 sm:-top-4 opacity-15 dark:opacity-10 ${iconColorClass} pointer-events-none select-none`}>
      {React.cloneElement(backgroundIcon as React.ReactElement<{ className?: string }>, { 
        // Reduced size from w-16/h-16 to w-12/h-12 for mobile
        className: `${existingIconClass} w-12 h-12 sm:w-24 sm:h-24` 
      })}
    </div>
  </div>
)};

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaries, isAdmin, onBdtBalanceClick }) => {
    const cards = [
        { 
            title: 'BDT Balance',
            value: formatCurrency(summaries.bdtBalance), 
            // Reduced font size to match the smaller container
            backgroundIcon: <span className="font-bold font-hind-siliguri flex items-center justify-center text-[3rem] sm:text-[5rem]">৳</span>,
            gradientClass: 'bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5] dark:from-green-950/40 dark:to-slate-900', 
            iconColorClass: 'text-green-600 dark:text-green-400',
            ...(isAdmin && { onClick: onBdtBalanceClick })
        },
        { 
            title: 'USD Balance', 
            value: formatCurrency(summaries.usdBalance, 'USD'), 
             // Reduced font size to match the smaller container
            backgroundIcon: <span className="font-bold flex items-center justify-center text-[3rem] sm:text-[5rem]">$</span>,
            gradientClass: 'bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] dark:from-blue-950/40 dark:to-slate-900', 
            iconColorClass: 'text-blue-600 dark:text-blue-400',
        },
        { 
            title: 'Total Buy (USD)', 
            value: formatCurrency(summaries.totalBuy, 'USD'), 
            backgroundIcon: <BuyIcon />,
            gradientClass: 'bg-gradient-to-br from-[#f0f9ff] to-white dark:from-sky-950/40 dark:to-slate-900', 
            iconColorClass: 'text-sky-400 dark:text-sky-400',
        },
        { 
            title: 'Total Sell (USD)', 
            value: formatCurrency(summaries.totalSell, 'USD'), 
            backgroundIcon: <SellIcon />,
            gradientClass: 'bg-gradient-to-br from-[#fef2f2] to-[#fff1f2] dark:from-red-950/40 dark:to-slate-900', 
            iconColorClass: 'text-red-400 dark:text-red-400',
        },
        { 
            title: 'Total Charges', 
            value: formatCurrency(summaries.totalChargesBdt, 'BDT'), 
            backgroundIcon: <ChargeIcon />,
            gradientClass: 'bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] dark:from-yellow-950/40 dark:to-slate-900', 
            iconColorClass: 'text-yellow-400 dark:text-yellow-400',
        },
        {
            title: 'Transactions',
            value: summaries.totalTransactions.toLocaleString('en-US'),
            backgroundIcon: <TransactionIcon />,
            gradientClass: 'bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-purple-950/40 dark:to-slate-900', 
            iconColorClass: 'text-purple-400 dark:text-purple-400',
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {cards.map(card => <SummaryCard key={card.title} {...card} />)}
        </div>
    );
};

export default SummaryCards;