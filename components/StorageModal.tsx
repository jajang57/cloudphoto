import React, { useState, useEffect } from 'react';
import { CloseIcon, DatabaseIcon } from './icons';

interface StorageModalProps {
  onClose: () => void;
  onPurchase: (newSizeGB: number) => void;
  currentPlanGB: number;
}

const storagePackages = [
  { sizeGB: 25, price: 0.50 },
  { sizeGB: 50, price: 1.00 },
  { sizeGB: 100, price: 1.22 },
];

const StorageModal: React.FC<StorageModalProps> = ({ onClose, onPurchase, currentPlanGB }) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePurchase = (sizeGB: number) => {
    setSelectedPlan(sizeGB);
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      onPurchase(sizeGB);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4 p-8 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-2">
              Upgrade Your Storage
            </h2>
            <p className="text-gray-400">Choose a plan that fits your needs. More space for more memories.</p>
        </div>

        <div className="space-y-4">
          {storagePackages.map((pkg) => {
            const isCurrentPlan = pkg.sizeGB === currentPlanGB;
            const isSelected = pkg.sizeGB === selectedPlan;
            return (
              <div
                key={pkg.sizeGB}
                className={`p-4 border rounded-lg flex justify-between items-center transition-all duration-200 ${isCurrentPlan ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 hover:border-indigo-600'}`}
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <DatabaseIcon className="w-5 h-5"/>
                    {pkg.sizeGB} GB Storage
                  </h3>
                  {isCurrentPlan && <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">Current Plan</span>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${pkg.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">per month</p>
                </div>
                <button
                  onClick={() => handlePurchase(pkg.sizeGB)}
                  disabled={isCurrentPlan || isLoading}
                  className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-32"
                >
                  {isLoading && isSelected ? 'Processing...' : isCurrentPlan ? 'Active' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">This is a simulated purchase for demonstration purposes.</p>
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

export default StorageModal;