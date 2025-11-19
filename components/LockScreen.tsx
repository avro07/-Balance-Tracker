import React, { useState } from 'react';

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
    <div className="min-h-screen bg-white flex flex-col justify-between relative font-sans text-slate-800 z-50 fixed inset-0">
      {/* Top Bar */}
      <div className="flex justify-end p-4 pt-8 sm:pt-8">
         <div className="border border-orange-500 rounded-full px-3 py-1 text-xs font-bold flex gap-2 text-slate-600 items-center">
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

        {/* Mobile Number Removed */}

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
                    className="w-full outline-none text-xl font-bold text-slate-800 placeholder-slate-300 bg-transparent tracking-[0.2em]"
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
              className="w-full rounded-full border-2 border-orange-500 py-3 text-slate-600 font-bold uppercase tracking-wide hover:bg-orange-50 active:scale-95 transition-all"
           >
              LOGIN
           </button>
           
           <div className="text-center mt-6">
             <button type="button" className="text-slate-500 text-sm font-medium">Forgot PIN?</button>
           </div>
        </form>
      </div>

      {/* Bottom Nav (Visual Only - Matching Screenshot) */}
      <div className="flex justify-between px-8 pb-6 text-slate-500 text-[10px] font-bold">
         <div className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Store Locator</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-6 rounded-full border-2 border-dashed border-orange-500 flex items-center justify-center text-orange-500 font-bold text-xs">%</div>
            <span>Offers</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
         </div>
      </div>
    </div>
  );
};

export default LockScreen;