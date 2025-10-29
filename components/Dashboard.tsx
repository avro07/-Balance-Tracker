
import React, { useState } from 'react';
import { DailySummary, GlobalSummaries, Transaction } from '../types';
import SummaryCards from './SummaryCards';
import DailyRecord from './DailyRecord';
import BalanceByMethodModal from './BalanceByMethodModal';

interface DashboardProps {
  summaries: GlobalSummaries;
  getDailySummary: (date: string) => DailySummary;
  transactions: Transaction[];
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, getDailySummary, transactions, isAdmin }) => {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <SummaryCards 
        summaries={summaries} 
        isAdmin={isAdmin}
        onBdtBalanceClick={() => setIsBalanceModalOpen(true)}
      />
      
      <DailyRecord getDailySummary={getDailySummary} transactions={transactions} />

      {isBalanceModalOpen && isAdmin && summaries.bdtBalanceByMethod && (
        <BalanceByMethodModal
          balances={summaries.bdtBalanceByMethod}
          onClose={() => setIsBalanceModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;