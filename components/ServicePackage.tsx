import React from 'react';

const ServicePackage: React.FC = () => {
  const features = [
    "COM/INFO/XYZ Domain",
    "5 GB Hosting",
    "Premium Theme",
    "Free SSL Certificate",
    "Mobile Friendly Web Design",
    "C-Panel",
    "WordPress Admin Panel",
    "Stock Management System",
    "Wallet System",
    "Payment Gateways Bkash, Rocket, Nagad, Credit Card, Bank Transfer etc."
  ];

  return (
    <div className="mt-8 mb-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700 overflow-hidden font-sans">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
         {/* Decorative background element */}
         <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
         
         <h2 className="relative z-10 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-hind-siliguri">
            Ekattor E-Commerce Package
         </h2>
         <p className="relative z-10 text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive solution for your business
         </p>
      </div>
      <div className="p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-3">
            {features.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 group">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{item}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ServicePackage;