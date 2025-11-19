import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '6175') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // Shake effect duration
      setPin(''); // Clear pin on error
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col justify-between relative font-sans text-slate-800 dark:text-slate-200 z-50 fixed inset-0 transition-colors duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 pt-8 sm:pt-8">
         <ThemeToggle />
         <div className="border border-orange-500 rounded-full px-3 py-1 text-xs font-bold flex gap-2 text-slate-600 dark:text-slate-300 items-center">
            <span>বাংলা</span>
            <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-sm">ENG</span>
         </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center pt-10 px-8">
        {/* Logo */}
        <div className="w-32 mb-16">
             <img src="https://zroos.com/wp-content/uploads/ar.png" alt="Logo" className="w-full" />
        </div>

        {/* PIN Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
           <div className={`flex items-end border-b-2 ${error ? 'border-red-500' : 'border-orange-500'} pb-2 mb-10 transition-colors duration-300`}>
              <div className="text-orange-500 mr-3 pb-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
              </div>
              <div className="flex-grow">
                 <label className="text-xs text-slate-400 block mb-1">PIN</label>
                 <input 
                    type="password" 
                    value={pin}
                    onChange={e => {
                        if(e.target.value.length <= 4) setPin(e.target.value);
                    }}
                    className="w-full outline-none text-xl font-bold text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 bg-transparent tracking-[0.2em]"
                    placeholder="••••" 
                    inputMode="numeric"
                    autoFocus
                 />
              </div>
           </div>
           {error && <p className="text-red-500 text-sm text-center -mt-8 mb-5 font-medium">PIN Incorrect</p>}

           {/* Login Button */}
           <button 
              type="submit" 
              className="w-full rounded-full border-2 border-orange-500 py-3 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wide hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-95 transition-all"
           >
              LOGIN
           </button>
        </form>
      </div>
      
      {/* Footer Spacer */}
      <div className="pb-6"></div>
    </div>
  );
};

export default LockScreen;