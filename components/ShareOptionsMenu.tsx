import React from 'react';
import { CloseIcon, ShareIcon, AdminIcon } from './Icons';

interface ShareOptionsMenuProps {
    onClose: () => void;
    onShareReadOnly: () => void;
    onShareAdmin: () => void;
}

const ShareOptionsMenu: React.FC<ShareOptionsMenuProps> = ({ onClose, onShareReadOnly, onShareAdmin }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-xl w-full max-w-sm border border-slate-200/60 font-hind-siliguri" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-indigo-200/60 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">শেয়ার অপশন বেছে নিন</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CloseIcon /></button>
                </div>
                <div className="p-5 space-y-4">
                    <button
                        onClick={onShareReadOnly}
                        className="w-full flex items-center text-left p-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200"
                    >
                        <div className="p-3 bg-purple-100 rounded-full mr-4">
                            <ShareIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">রিড-অনলি ভিউ শেয়ার করুন</p>
                            <p className="text-sm text-slate-500">
                                শুধু দেখার জন্য বর্তমান ডেটার একটি লিঙ্ক শেয়ার করুন।
                            </p>
                        </div>
                    </button>
                    <button
                        onClick={onShareAdmin}
                        className="w-full flex items-center text-left p-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200"
                    >
                        <div className="p-3 bg-amber-100 rounded-full mr-4">
                            <AdminIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">অ্যাডমিন প্যানেল শেয়ার করুন</p>
                            <p className="text-sm text-slate-500">
                                সম্পূর্ণ অ্যাডমিন অ্যাক্সেস সহ একটি লিঙ্ক শেয়ার করুন।
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareOptionsMenu;
