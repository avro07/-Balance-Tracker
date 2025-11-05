

import React, { useState } from 'react';
import { CloseIcon, CopyIcon, ShareIcon } from './Icons';

interface ShareModalProps {
  link: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'R.S. Nexus Ltd. Transactions',
        text: 'View the latest transactions from R.S. Nexus Ltd.',
        url: link,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // User might have cancelled the share action, so no alert is needed.
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-xl w-full max-w-lg border border-slate-200/60" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={link}
              readOnly
              className="w-full px-3 py-2 bg-slate-50 text-slate-700 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onFocus={(e) => e.target.select()}
            />
            {canShare ? (
              <button
                onClick={handleShare}
                className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 w-32 justify-center"
              >
                <ShareIcon />
                <span>Share</span>
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 w-32 justify-center"
              >
                <CopyIcon />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
