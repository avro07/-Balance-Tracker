import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('en');

  // Translations
  const texts = {
    en: {
      login: 'LOGIN',
      incorrect: 'Incorrect PIN',
      secured: 'Secured by R.S. Nexus'
    },
    bn: {
      login: 'লগইন',
      incorrect: 'ভুল পিন দেওয়া হয়েছে',
      secured: 'আর.এস নেক্সাস দ্বারা সুরক্ষিত'
    }
  };

  const t = texts[language];

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col justify-between relative font-sans text-slate-800 dark:text-slate-200 z-50 fixed inset-0 transition-colors duration-300 overflow-hidden">
       {/* Background Ambience - Enhanced */}
       <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-orange-400/20 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>
       <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal dark:opacity-20"></div>

      {/* Top Bar - Language Toggle Only */}
      <div className="flex justify-end p-6 relative z-10">
         <div 
            onClick={() => setLanguage(prev => prev === 'en' ? 'bn' : 'en')}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full p-1.5 flex items-center cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-white/50 dark:border-slate-700 select-none hover:scale-105 transition-transform duration-300"
         >
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-500 ease-out ${language === 'bn' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-orange-600'}`}>
              বাংলা
            </span>
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-500 ease-out ${language === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-orange-600'}`}>
              ENG
            </span>
         </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center -mt-20 px-8 relative z-10">
        {/* Logo */}
        <div className="w-32 sm:w-36 mb-12 sm:mb-16 drop-shadow-2xl animate-[fade-in_1s_ease-out]">
             <img src="https://zroos.com/wp-content/uploads/ar.png" alt="Logo" className="w-full hover:scale-105 transition-transform duration-500" />
        </div>

        {/* PIN Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-[260px] sm:max-w-[300px] flex flex-col items-center">
           <div className="relative mb-10 sm:mb-12 group w-full">
               {/* Input Line Animation */}
              <div className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full transition-all duration-500 ${error ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-slate-200 dark:bg-slate-700 group-focus-within:bg-transparent'}`}></div>
              
              {/* Gradient Line on Focus */}
              <div className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-500 ${error ? 'opacity-0' : 'opacity-0 group-focus-within:opacity-100 scale-x-0 group-focus-within:scale-x-100'}`}></div>
              
              <input 
                type="password" 
                value={pin}
                onChange={e => {
                    if(e.target.value.length <= 4) setPin(e.target.value);
                }}
                className="w-full bg-transparent text-center text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-[0.6em] placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none py-3 sm:py-4 transition-all selection:bg-orange-500/30"
                placeholder="••••" 
                inputMode="numeric"
                autoFocus
              />
           </div>
           
           {error && (
                <div className="absolute top-[58%] text-red-500 text-xs sm:text-sm font-bold animate-pulse tracking-wide bg-red-50 dark:bg-red-900/30 px-4 py-1 rounded-full border border-red-200 dark:border-red-800/50 shadow-sm">
                    {t.incorrect}
                </div>
           )}

           {/* Premium Login Button (Soft UI + Gradient Animation) */}
           <button 
              type="submit" 
              className="group relative w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 active:scale-95 active:translate-y-0 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.6)]"
           >
              {/* Animated Gradient Background Layer */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto]"
                style={{ animation: 'gradient-flow 3s linear infinite' }}
              ></div>
              
              {/* Soft Glow overlay inside */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/10 to-white/20 transition-opacity duration-300"></div>

              {/* Button Content */}
              <div className="relative h-full flex items-center justify-center gap-2 sm:gap-3 text-white">
                <span className="font-bold text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-sm group-hover:tracking-[0.2em] sm:group-hover:tracking-[0.25em] transition-all duration-300">
                    {t.login}
                </span>
                <div className="p-1 sm:p-1.5 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                    </svg>
                </div>
              </div>
           </button>
        </form>
      </div>
      
      {/* Footer */}
      <div className="pb-10 text-center relative z-10">
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600 font-semibold tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-default">
          {t.secured}
        </p>
      </div>
      
      {/* Injecting Keyframes locally */}
      <style>{`
        @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LockScreen;