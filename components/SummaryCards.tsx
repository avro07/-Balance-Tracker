import React from 'react';
import { GlobalSummaries } from '../types';
import { formatCurrency } from '../utils/formatting';
import { BdtIcon, UsdIcon, BuyIcon, SellIcon, ChargeIcon, TransactionIcon } from './Icons';

interface SummaryCardsProps {
    summaries: GlobalSummaries;
}

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; gradient: string; iconColor: string }> = ({ title, value, icon, gradient, iconColor }) => (
    <div className={`relative overflow-hidden p-4 rounded-xl shadow-sm border border-slate-200/60 ${gradient}`}>
        <div className={`absolute -top-3 -right-3 w-20 h-20 ${iconColor} opacity-10 pointer-events-none`}>
            {React.cloneElement(icon as React.ReactElement, { className: "w-20 h-20" })}
        </div>
        <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-600 truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1 truncate">{value}</p>
        </div>
    </div>
);


const SummaryCards: React.FC<SummaryCardsProps> = ({ summaries }) => {
    const cards = [
        { title: 'BDT Balance', value: formatCurrency(summaries.bdtBalance), icon: <BdtIcon />, gradient: 'bg-gradient-to-br from-green-50 to-white', iconColor: 'text-green-500' },
        { title: 'USD Balance', value: formatCurrency(summaries.usdBalance, 'USD'), icon: <UsdIcon />, gradient: 'bg-gradient-to-br from-blue-50 to-white', iconColor: 'text-blue-500' },
        { title: 'Total Buy (USD)', value: formatCurrency(summaries.totalBuy, 'USD'), icon: <BuyIcon />, gradient: 'bg-gradient-to-br from-sky-50 to-white', iconColor: 'text-sky-500' },
        { title: 'Total Sell (USD)', value: formatCurrency(summaries.totalSell, 'USD'), icon: <SellIcon />, gradient: 'bg-gradient-to-br from-rose-50 to-white', iconColor: 'text-rose-500' },
        { title: 'Total Charges (BDT)', value: formatCurrency(summaries.totalChargesBdt, 'BDT'), icon: <ChargeIcon />, gradient: 'bg-gradient-to-br from-amber-50 to-white', iconColor: 'text-amber-500' },
        { title: 'Total Transactions', value: summaries.totalTransactions.toString(), icon: <TransactionIcon />, gradient: 'bg-gradient-to-br from-indigo-50 to-white', iconColor: 'text-indigo-500' },
    ];

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {cards.map(card => <SummaryCard key={card.title} {...card} />)}
            </div>
        </div>
    );
};

export default SummaryCards;