
import React, { useState } from 'react';
import { CloseIcon, CopyIcon } from './Icons';

interface ShareModalProps {
  link: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      },
      (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy the link.');
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Share Transactions Link</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">
            Share this link with users to give them a read-only view of the current transactions. If you add new transactions, you will need to generate a new link.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={link}
              readOnly
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:bg-indigo-300 w-32 justify-center"
            >
              <CopyIcon />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
