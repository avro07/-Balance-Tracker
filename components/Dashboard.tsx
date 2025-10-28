
import React from 'react';
import { DailySummary, GlobalSummaries, Transaction } from '../types';
import SummaryCards from './SummaryCards';
import DailyRecord from './DailyRecord';

interface DashboardProps {
  summaries: GlobalSummaries;
  getDailySummary: (date: string) => DailySummary;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, getDailySummary, transactions }) => {
  return (
    <div className="space-y-6">
      <SummaryCards summaries={summaries} />
      <DailyRecord getDailySummary={getDailySummary} transactions={transactions} />
    </div>
  );
};

export default Dashboard;