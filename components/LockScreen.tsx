import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('en');

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
      <div className="flex justify-end p-6">
         <div 
            onClick={() => setLanguage(prev => prev === 'en' ? 'bn' : 'en')}
            className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center cursor-pointer shadow-inner border border-slate-200 dark:border-slate-700 select-none"
         >
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${language === 'bn' ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-orange-500'}`}>
              বাংলা
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${language === 'en' ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-orange-500'}`}>
              ENG
            </span>
         </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center -mt-20 px-8">
        {/* Logo */}
        <div className="w-36 mb-12 animate-fade-in">
             <img src="https://zroos.com/wp-content/uploads/ar.png" alt="Logo" className="w-full drop-shadow-lg" />
        </div>

        {/* PIN Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
           <div className={`relative flex items-center justify-center mb-10`}>
              <div className={`absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-300 ${error ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}></div>
              
              <input 
                type="password" 
                value={pin}
                onChange={e => {
                    if(e.target.value.length <= 4) setPin(e.target.value);
                }}
                className="w-full bg-transparent text-center text-3xl font-bold text-slate-800 dark:text-white tracking-[0.5em] placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none py-2"
                placeholder="••••" 
                inputMode="numeric"
                autoFocus
              />
              <div className={`absolute -bottom-6 text-xs font-medium transition-all duration-300 ${error ? 'text-red-500 opacity-100' : 'text-transparent opacity-0'}`}>
                Incorrect PIN
              </div>
           </div>

           {/* Unique Login Button */}
           <button 
              type="submit" 
              className="group w-full relative py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg tracking-widest shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transform transition-all duration-300 overflow-hidden"
           >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-in-out -skew-x-12 -translate-x-full"></div>
              <span className="relative flex items-center justify-center gap-2">
                LOGIN
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
           </button>
        </form>
      </div>
      
      {/* Footer Spacer */}
      <div className="pb-8 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium tracking-wider uppercase">
          Secured by R.S. Nexus
        </p>
      </div>
    </div>
  );
};

export default LockScreen;