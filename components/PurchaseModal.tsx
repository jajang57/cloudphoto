import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';

interface PurchaseModalProps {
  onClose: () => void;
  onGalleryPurchaseSuccess: () => void;
  price: number;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose, onGalleryPurchaseSuccess, price }) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const handlePurchase = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      onGalleryPurchaseSuccess();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 relative animate-scaleIn text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4">
          Unlock Your Gallery
        </h2>
        <p className="text-gray-400 mb-6">
          Purchase this gallery to view, download, and share all photos in high resolution without watermarks.
        </p>

        <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center text-lg">
                <span className="text-gray-300">Wedding Photoshoot - June 2024</span>
                <span className="font-bold text-white">${price.toFixed(2)}</span>
            </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            'Pay with Card & Unlock Now'
          )}
        </button>
        <p className="text-xs text-gray-500 mt-4">This is a simulated payment for demonstration purposes.</p>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PurchaseModal;