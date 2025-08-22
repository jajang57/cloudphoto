import React, { useState, useEffect } from 'react';
import { CloseIcon, CopyIcon } from './icons';

interface ShareModalProps {
  onClose: () => void;
  accessCode: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, accessCode }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://cloud.photo/gallery/${accessCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-4">Share Gallery</h2>
        <p className="text-center text-gray-400 mb-6">Your client can use this secure link or QR code to access the gallery with code: <strong className="text-white">{accessCode}</strong></p>

        <div className="bg-white p-4 rounded-lg flex justify-center mb-6">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareLink)}`} alt="QR Code" />
        </div>

        <div className="space-y-2">
            <label htmlFor="share-link" className="text-sm font-medium text-gray-300">Shareable Link</label>
            <div className="flex items-center space-x-2">
                <input
                    id="share-link"
                    type="text"
                    readOnly
                    value={shareLink}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleCopy}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex-shrink-0"
                >
                    {copied ? 'Copied!' : <CopyIcon className="w-5 h-5"/>}
                </button>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ShareModal;
