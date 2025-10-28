
import React from 'react';
import { GlobalSummaries } from '../types';
import { formatCurrency } from '../utils/formatting';
import { BdtIcon, UsdIcon, BuyIcon, SellIcon, ChargeIcon, TransactionIcon } from './Icons';

interface SummaryCardsProps {
    summaries: GlobalSummaries;
}

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="flex-shrink-0 w-48 bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <p className="text-sm text-slate-500 mt-3">{title}</p>
        <p className="text-xl font-bold text-slate-800 truncate">{value}</p>
    </div>
);


const SummaryCards: React.FC<SummaryCardsProps> = ({ summaries }) => {
    const cards = [
        { title: 'BDT Balance', value: formatCurrency(summaries.bdtBalance), icon: <BdtIcon />, color: 'bg-green-100 text-green-600' },
        { title: 'USD Balance', value: formatCurrency(summaries.usdBalance, 'USD'), icon: <UsdIcon />, color: 'bg-blue-100 text-blue-600' },
        { title: 'Total Buy (USD)', value: formatCurrency(summaries.totalBuy, 'USD'), icon: <BuyIcon />, color: 'bg-sky-100 text-sky-600' },
        { title: 'Total Sell (USD)', value: formatCurrency(summaries.totalSell, 'USD'), icon: <SellIcon />, color: 'bg-rose-100 text-rose-600' },
        { title: 'Total Charges (BDT)', value: formatCurrency(summaries.totalChargesBdt, 'BDT'), icon: <ChargeIcon />, color: 'bg-amber-100 text-amber-600' },
        { title: 'Total Transactions', value: summaries.totalTransactions.toString(), icon: <TransactionIcon />, color: 'bg-indigo-100 text-indigo-600' },
    ];

    return (
        <div>
            <div className="flex justify-center gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                {cards.map(card => <SummaryCard key={card.title} {...card} />)}
            </div>
        </div>
    );
};

export default SummaryCards;
