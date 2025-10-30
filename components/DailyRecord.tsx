
import React, { useState, useMemo } from 'react';
// FIX: Import DailySummary to be used in the props interface.
import { Transaction, TransactionType, DailySummary } from '../types';
import { formatCurrency, getTodayDateString, formatRate } from '../utils/formatting';
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon } from './Icons';
import PaymentMethodIcon from './PaymentMethodIcon';

interface DailyRecordProps {
  transactions: Transaction[];
  // FIX: Added getDailySummary to props to match what is passed from Dashboard.tsx
  getDailySummary: (date: string) => DailySummary;
}

const DailySummaryPopup: React.FC<{
  summary: any;
  date: string;
  onClose: () => void;
}> = ({ summary, date, onClose }) => {
    const profitColor = summary.profit >= 0 ? 'text-green-600' : 'text-red-500';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl shadow-xl w-full max-w-xs border border-slate-200/60" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700">Daily Summary</h3>
                    <p className="text-sm text-slate-500">{new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
                <ul className="p-4 space-y-3 text-sm text-slate-600">
                    <li className="flex justify-between items-center">
                        <span>Avg. Buy Rate</span>
                        <span className="font-bold text-slate-800">{formatCurrency(summary.avgBuyRate, 'BDT', 2)}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Avg. Sell Rate</span>
                        <span className="font-bold text-slate-800">{formatCurrency(summary.avgSellRate, 'BDT', 2)}</span>
                    </li>
                     <li className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span>Total Buy</span>
                        <span className="font-bold text-slate-800">{formatCurrency(summary.totalBuyBDT)}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Total Sell</span>
                        <span className="font-bold text-slate-800">{formatCurrency(summary.totalSellBDT)}</span>
                    </li>
                </ul>
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                     <h4 className="font-semibold text-slate-700">Profit</h4>
                     <span className={`font-bold text-lg ${profitColor}`}>{formatCurrency(summary.profit)}</span>
                </div>
            </div>
        </div>
    );
};


const DailyTransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction: tx }) => {
    const typeClasses = {
        [TransactionType.BUY]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Buy', gradient: 'bg-gradient-to-br from-green-50 to-white' },
        [TransactionType.SELL]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Sell', gradient: 'bg-gradient-to-br from-red-50 to-white' },
        [TransactionType.DEPOSIT]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Deposit', gradient: 'bg-gradient-to-br from-blue-50 to-white' },
        [TransactionType.WITHDRAW]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Withdraw', gradient: 'bg-gradient-to-br from-amber-50 to-white' },
        [TransactionType.TRANSFER]: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Transfer', gradient: 'bg-gradient-to-br from-cyan-50 to-white' },
    };
    const details = typeClasses[tx.type];
    const isUsdTransaction = tx.type === TransactionType.BUY || tx.type === TransactionType.SELL;
    const isTransfer = tx.type === TransactionType.TRANSFER;
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
                
                {isTransfer ? (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">From:</span>
                            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <PaymentMethodIcon method={tx.paymentMethod} className="w-4 h-4" />
                                <span>{tx.bankAccount}</span>
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">To:</span>
                             <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <PaymentMethodIcon method={tx.toPaymentMethod || ''} className="w-4 h-4" />
                                <span>{tx.toPaymentMethod === 'Bank' && tx.toBankAccount ? tx.toBankAccount : tx.toPaymentMethod}</span>
                            </span>
                        </div>
                     </>
                ) : (
                    <>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Charge:</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(bdtChargeAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Payment:</span>
                            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <PaymentMethodIcon method={tx.paymentMethod} className="w-4 h-4" />
                                <span>{tx.paymentMethod === 'Bank' && tx.bankAccount ? tx.bankAccount : tx.paymentMethod}</span>
                            </span>
                        </div>
                    </>
                )}
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-base font-bold text-slate-800 flex justify-between items-center">
                    <span>{isTransfer ? 'Amount:' : 'BDT Amount:'}</span>
                    <span className="text-indigo-600 text-lg">{formatCurrency(tx.bdtAmount)}</span>
                </p>
            </div>
        </div>
    );
};


const DailyRecord: React.FC<DailyRecordProps> = ({ transactions, getDailySummary }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());
    const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);

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

    return (
        <div>
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
                        <button
                            onClick={() => setIsSummaryPopupOpen(true)}
                            aria-label="Show daily summary"
                            className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                            <InfoIcon />
                        </button>
                    </div>
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
            
            {isSummaryPopupOpen && (
                <DailySummaryPopup
                    summary={dailySummary}
                    date={selectedDate}
                    onClose={() => setIsSummaryPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default DailyRecord;
