
import React from 'react';
import { DailySummary, GlobalSummaries, Transaction } from '../types';
import SummaryCards from './SummaryCards';
import DailyRecord from './DailyRecord';
import BalanceByMethod from './BalanceByMethod';

interface DashboardProps {
  summaries: GlobalSummaries;
  getDailySummary: (date: string) => DailySummary;
  transactions: Transaction[];
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, getDailySummary, transactions, isAdmin }) => {
  return (
    <div className="space-y-8">
      <SummaryCards summaries={summaries} />
      {isAdmin && summaries.bdtBalanceByMethod && (
        <BalanceByMethod balances={summaries.bdtBalanceByMethod} />
      )}
      <DailyRecord getDailySummary={getDailySummary} transactions={transactions} />
    </div>
  );
};

export default Dashboard;