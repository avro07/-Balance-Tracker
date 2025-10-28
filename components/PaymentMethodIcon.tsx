import React from 'react';
import { BankIconSimple, CashIcon, BKashIcon, NagadIcon, RocketIcon, DefaultPaymentIcon } from './Icons';

interface PaymentMethodIconProps {
  method: string;
  className?: string;
}

const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method, className="w-5 h-5" }) => {
  switch (method) {
    case 'Bank':
      return <BankIconSimple className={`${className} text-blue-600`} />;
    case 'Cash':
      return <CashIcon className={`${className} text-green-600`} />;
    case 'bKash':
      return <BKashIcon className={className} />;
    case 'Nagad':
      return <NagadIcon className={className} />;
    case 'Rocket':
      return <RocketIcon className={className} />;
    default:
      return <DefaultPaymentIcon className={`${className} text-slate-500`} />;
  }
};

export default PaymentMethodIcon;
