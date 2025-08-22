import React, { useState, useEffect } from 'react';
import { CloseIcon, WalletIcon } from './icons';

interface PayoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
  balance: number;
}

type PayoutMethod = 'bank' | 'ewallet';

const PayoutModal: React.FC<PayoutModalProps> = ({ onClose, onSuccess, balance }) => {
  const [activeTab, setActiveTab] = useState<PayoutMethod>('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [bankDetails, setBankDetails] = useState({ account: '', routing: '' });
  const [ewalletDetails, setEwalletDetails] = useState({ provider: '', email: '' });

  const isFormValid = activeTab === 'bank'
    ? bankDetails.account.length > 5 && bankDetails.routing.length > 5
    : ewalletDetails.provider.length > 2 && ewalletDetails.email.includes('@');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  const SuccessView = () => (
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Payout Successful!</h2>
      <p className="text-gray-400">Your funds are on the way. It may take 3-5 business days to appear in your account.</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        {isSuccess ? <SuccessView /> : (
          <form onSubmit={handlePayout} className="p-8">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 mb-2">
                  Withdraw Your Earnings
                </h2>
                <p className="text-gray-400">Transferring <span className="font-bold text-white">${balance.toFixed(2)}</span> to your account.</p>
            </div>
            
            <div className="flex p-1 bg-gray-900 rounded-lg mb-6">
              <button type="button" onClick={() => setActiveTab('bank')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 rounded-md transition-colors ${activeTab === 'bank' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/[0.12]'}`}>
                Bank Transfer
              </button>
              <button type="button" onClick={() => setActiveTab('ewallet')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 rounded-md transition-colors ${activeTab === 'ewallet' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/[0.12]'}`}>
                E-Wallet
              </button>
            </div>

            {activeTab === 'bank' ? (
              <div className="space-y-4">
                <input type="text" placeholder="Bank Account Number" required value={bankDetails.account} onChange={e => setBankDetails({...bankDetails, account: e.target.value})} className="w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <input type="text" placeholder="Routing Number" required value={bankDetails.routing} onChange={e => setBankDetails({...bankDetails, routing: e.target.value})} className="w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" placeholder="E-Wallet Provider (e.g., PayPal)" required value={ewalletDetails.provider} onChange={e => setEwalletDetails({...ewalletDetails, provider: e.target.value})} className="w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <input type="email" placeholder="E-Wallet Email or ID" required value={ewalletDetails.email} onChange={e => setEwalletDetails({...ewalletDetails, email: e.target.value})} className="w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing Payout...
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5 mr-2"/>
                  Request Payout of ${balance.toFixed(2)}
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Payouts are simulated for demonstration purposes.</p>
          </form>
        )}
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

export default PayoutModal;
