import React, { useState } from 'react';
import { DailySummary, GlobalSummaries, Transaction } from '../types';
import SummaryCards from './SummaryCards';
import DailyRecord from './DailyRecord';
import BalanceByMethodModal from './BalanceByMethodModal';
import BankBalanceDetailsModal from './BankBalanceDetailsModal';

interface DashboardProps {
  summaries: GlobalSummaries;
  transactions: Transaction[];
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, transactions, isAdmin }) => {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isBankDetailsModalOpen, setIsBankDetailsModalOpen] = useState(false);

  const handleShowBankDetails = () => {
    setIsBalanceModalOpen(false);
    setIsBankDetailsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <SummaryCards 
        summaries={summaries} 
        isAdmin={isAdmin}
        onBdtBalanceClick={() => setIsBalanceModalOpen(true)}
      />
      
      <DailyRecord transactions={transactions} />

      {isBalanceModalOpen && isAdmin && summaries.bdtBalanceByMethod && (
        <BalanceByMethodModal
          balances={summaries.bdtBalanceByMethod}
          onClose={() => setIsBalanceModalOpen(false)}
          onShowBankDetails={handleShowBankDetails}
        />
      )}

      {isBankDetailsModalOpen && isAdmin && summaries.bdtBalanceByBank && (
        <BankBalanceDetailsModal
          balances={summaries.bdtBalanceByBank}
          onClose={() => setIsBankDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;