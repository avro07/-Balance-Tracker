import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, getTodayDateString, formatRate } from '../utils/formatting';
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';
import PaymentMethodIcon from './PaymentMethodIcon';

interface DailyRecordProps {
  transactions: Transaction[];
}

const StatChip: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ${color}`}>
        <span>{label}:</span>
        <span className="font-bold">{value}</span>
    </div>
);

const DailyTransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction: tx }) => {
    const typeClasses = {
        [TransactionType.BUY]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Buy', gradient: 'bg-gradient-to-br from-green-50 to-white' },
        [TransactionType.SELL]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Sell', gradient: 'bg-gradient-to-br from-red-50 to-white' },
        [TransactionType.DEPOSIT]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Deposit', gradient: 'bg-gradient-to-br from-blue-50 to-white' },
        [TransactionType.WITHDRAW]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Withdraw', gradient: 'bg-gradient-to-br from-amber-50 to-white' },
    };
    const details = typeClasses[tx.type];
    const isUsdTransaction = tx.type === TransactionType.BUY || tx.type === TransactionType.SELL;
    const bdtChargeAmount = isUsdTransaction ? tx.bdtCharge || 0 : 0;

    return (
        <div className={`border border-slate-200/80 rounded-lg p-4 flex flex-col text-slate-700 shadow-sm h-full ${details.gradient}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${details.bg} ${details.text}`}>
                    {details.label}
                </span>
                <p className="text-xs text-slate-400">{tx.date}</p>
            </div>

            {/* Body */}
            <div className="flex-grow space-y-1.5 text-sm">
                {isUsdTransaction && (
                    <>
                        <div className="flex justify-between">
                            <span className="text-slate-500">USD:</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(tx.usdAmount!, 'USD')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Rate:</span>
                            <span className="font-semibold text-slate-900">{formatRate(tx.usdRate, 2)}</span>
                        </div>
                    </>
                )}
                <div className="flex justify-between">
                    <span className="text-slate-500">Charge:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(bdtChargeAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500">Payment:</span>
                    <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <PaymentMethodIcon method={tx.paymentMethod} className="w-4 h-4" />
                        {tx.paymentMethod}
                    </span>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-base font-bold text-slate-800 flex justify-between items-center">
                    <span>BDT Amount:</span>
                    <span className="text-indigo-600 text-lg">{formatCurrency(tx.bdtAmount)}</span>
                </p>
            </div>
        </div>
    );
};


const DailyRecord: React.FC<DailyRecordProps> = ({ transactions }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());

    const dailyTransactions = useMemo(() => {
        return transactions.filter(tx => tx.date === selectedDate);
    }, [selectedDate, transactions]);

    const dailySummary = useMemo(() => {
        const summary = dailyTransactions.reduce((acc, tx) => {
            const usdAmount = tx.usdAmount || 0;
            if (tx.type === TransactionType.BUY) {
                acc.totalBuyBDT += tx.bdtAmount;
                acc.totalBuyUSD += usdAmount;
                acc.totalBuyRateWeighted += (tx.usdRate || 0) * usdAmount;
            } else if (tx.type === TransactionType.SELL) {
                acc.totalSellBDT += tx.bdtAmount;
                acc.totalSellUSD += usdAmount;
                acc.totalSellRateWeighted += (tx.usdRate || 0) * usdAmount;
            }
            return acc;
        }, {
            totalBuyBDT: 0, totalBuyUSD: 0, totalBuyRateWeighted: 0,
            totalSellBDT: 0, totalSellUSD: 0, totalSellRateWeighted: 0,
        });

        const avgBuyRate = summary.totalBuyUSD > 0 ? summary.totalBuyRateWeighted / summary.totalBuyUSD : 0;
        const avgSellRate = summary.totalSellUSD > 0 ? summary.totalSellRateWeighted / summary.totalSellUSD : 0;
        const profit = summary.totalSellBDT - summary.totalBuyBDT;

        return { ...summary, avgBuyRate, avgSellRate, profit };
    }, [dailyTransactions]);


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };
    
    const navigateDate = (offset: number) => {
        const currentDate = new Date(selectedDate + 'T00:00:00'); // Avoid timezone issues by setting time
        currentDate.setDate(currentDate.getDate() + offset);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const profitColor = dailySummary.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <CalendarIcon />
                <h2 className="text-lg font-semibold text-slate-800">Daily Record</h2>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-center mb-4">
                    <div className="relative flex items-center gap-2">
                         <button onClick={() => navigateDate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeftIcon />
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={() => navigateDate(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <StatChip label="Avg. Buy Rate" value={formatCurrency(dailySummary.avgBuyRate, 'BDT', 2)} color="bg-green-100 text-green-800" />
                    <StatChip label="Avg. Sell Rate" value={formatCurrency(dailySummary.avgSellRate, 'BDT', 2)} color="bg-orange-100 text-orange-800" />
                    <StatChip label="Total Buy" value={formatCurrency(dailySummary.totalBuyBDT)} color="bg-purple-100 text-purple-800" />
                    <StatChip label="Total Sell" value={formatCurrency(dailySummary.totalSellBDT)} color="bg-yellow-100 text-yellow-800" />
                    <StatChip label="Profit" value={formatCurrency(dailySummary.profit)} color={profitColor} />
                </div>
                
                {dailyTransactions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {dailyTransactions.map(tx => (
                            <DailyTransactionCard key={tx.id} transaction={tx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-6">
                        <p>No transactions found for this date.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyRecord;