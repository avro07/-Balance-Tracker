
import React from 'react';

export const BalanceIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l-6-2m0 0l-3 9m12-9l-3 9m0 0l-3-9m-9 9h12" />
    </svg>
);

export const BuyIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const SellIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

export const ChargeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const TransactionIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

export const DepositIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const WithdrawIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const AddIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const ExportIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-slate-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const BdtIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold">৳</text>
    </svg>
);

export const UsdIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold">$</text>
    </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5 text-slate-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const DeleteIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-1.025l-4.94-2.47a3.027 3.027 0 000-.742l4.94-2.47A3 3 0 0015 8z" />
    </svg>
);
  
export const CopyIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
    </svg>
);


// Payment Method Icons
export const BankIconSimple: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M11.5,1L2,6V8H21V6M16,10V17H19V10M10,10V17H13V10M4,10V17H7V10M2.5,18H20.5V20H2.5V18Z" /></svg>
);

export const CashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const BKashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#ED1C68"/>
        <path d="M5.5,3.5 L4,7 L8,20 L12,17 L16,12 L20,9 L17,8 L12.5,9.5 Z" fill="white" />
    </svg>
);

export const NagadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M92.5,69.3c-10.5-10.7-24-17.7-38.9-20.1C65.9,23.3,77.3,1,50,1C22.7,1,1,22.7,1,50c0,11.4,3.9,22,10.6,30.3 c-4.2-1.9-8-4.4-11.2-7.5c-4.1,8.9-6.3,18.9-6.3,29.3c0,0.1,0,0.2,0,0.3c33-1.6,63.9-16.6,86.4-40.4 C92.5,69.5,92.5,69.4,92.5,69.3z" fill="#f37622"/>
        <path d="M50,1c-1.3,0-2.5,0-3.8,0.1C23.9,2.8,4.7,23.5,2.1,47.4c-0.1,0.8-0.1,1.7-0.1,2.6c0,11.4,3.9,22,10.6,30.3 c-4.2-1.9-8-4.4-11.2-7.5c10.3,19.4,28,33.5,48.6,36.5c33-1.6,63.9-16.6,86.4-40.4c1.1-1.3,2.1-2.6,3.1-4 C117.3,34.4,86.5,1,50,1z" fill="#d7282f"/>
        <path d="M98.9,62.3c-23.5,24.8-55.7,40.1-90.1,40.1c-0.1,0-0.2,0-0.3,0c4.1,1.8,8.5,2.8,13,2.8c27.3,0,49.5-22.2,49.5-49.5 c0-11-3.6-21.2-9.7-29.5C92.9,24.1,99.8,42.5,98.9,62.3z" fill="#f37622"/>
        <circle cx="50" cy="50" r="32" fill="#fff"/>
        <path d="M57.6,41.9c0.1-0.7,0.3-1.4,0.5-2c0.5-1.4,1.4-2.6,2.6-3.4c1.5-1,3.4-1.3,5.1-0.8c1.3,0.4,2.4,1.2,3.2,2.3 c0.9,1.3,1.3,2.8,1.1,4.3c-0.2,1.3-0.8,2.5-1.6,3.5l-6,5.9l-2.4,14.3l5.5,1.1l0.7-3.9l6.3-1.2l-0.7,4.3l-10.4,2l1-5.9l-6.7-1.3 l-0.9,5.1l-4.5-0.9l3-17.5l-12.8,2.5l-0.1-4.7l14.7-2.8l0.2-1.3L44,46.3l-2.3-0.4l5.3-30.4h4.7l-4.2,24l10-1.9L57.6,41.9z" fill="#d7282f"/>
        <path d="M37.3,62.1c-1.2,0-2.2,1-2.2,2.2c0,1.2,1,2.2,2.2,2.2c1.2,0,2.2-1,2.2-2.2C39.5,63.1,38.5,62.1,37.3,62.1z M37.3,67.4 c-2.3,0-4.2,1.9-4.2,4.2s1.9,4.2,4.2,4.2s4.2-1.9,4.2-4.2S39.6,67.4,37.3,67.4z" fill="#d7282f"/>
    </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <g fill="#942583">
            {/* Paper Plane */}
            <path d="M110.3,5.1l-25,25L110.3,55.1l25-25L110.3,5.1z M125.4,30.1l-15.1,15.1l15.1,15.1l15.1-15.1L125.4,30.1z"/>
            {/* Bengali 'রকেট' */}
            <path d="M2.5,95.2c0-12.8,7.1-21.4,17.8-21.4s17.8,8.6,17.8,21.4s-7.1,21.4-17.8,21.4S2.5,108,2.5,95.2z M29.5,95.2c0-6.4-3-12.2-9.2-12.2s-9.2,5.8-9.2,12.2s3,12.2,9.2,12.2S29.5,101.6,29.5,95.2z"/>
            <path d="M49.8,73.8v42.8h11.9V73.8H49.8z"/>
            <path d="M96.7,96c-8.4-14.9-15.3-22.6-26.6-22.6h-1.8V61.5h1.8c14.9,0,22.6,10.7,32,31.8L96.7,96z"/>
            <path d="M123.3,95.2c0-11.9,6.5-17.8,16-17.8s16,5.9,16,17.8s-6.5,17.8-16,17.8S123.3,107.1,123.3,95.2z M146.4,95.2c0-5.9-2.9-9.5-7.7-9.5s-7.7,3.5-7.7,9.5s2.9,9.5,7.7,9.5S146.4,101.1,146.4,95.2z"/>
            <circle cx="166.7" cy="95.2" r="6.5"/>
        </g>
    </svg>
);

export const DefaultPaymentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
