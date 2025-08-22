import React, { useState } from 'react';
import { ChartBarIcon, DollarSignIcon, DownloadIcon, PencilIcon, DatabaseIcon, WalletIcon, GiftIcon } from './icons';
import { Folder } from '../types';

interface FolderSettingsProps {
  folder: Folder;
  onGalleryPriceChange: (newPrice: number) => void;
  onPhotoPriceChange: (newPrice: number) => void;
  onFreeAccessToggle: (isEnabled: boolean) => void;
  onUpdateName: (newName: string) => void;
  storage: {
    usedGB: number;
    totalGB: number;
  };
  onUpgradeClick: () => void;
  balance: number;
  onWithdrawClick: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center">
    <div className="p-3 rounded-full bg-indigo-600/20 text-indigo-400 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const PriceEditor: React.FC<{label: string; price: number; onPriceChange: (newPrice: number) => void; disabled?: boolean}> = ({label, price, onPriceChange, disabled = false}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newPrice, setNewPrice] = useState(price.toString());

    const handleSave = () => {
        const priceValue = parseFloat(newPrice);
        if (!isNaN(priceValue) && priceValue >= 0) {
            onPriceChange(priceValue);
            setIsEditing(false);
        } else {
            setNewPrice(price.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setIsEditing(false);
            setNewPrice(price.toString());
        }
    };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg flex items-center justify-between col-span-1 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-600/20 text-purple-400 mr-4">
              <DollarSignIcon className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              {isEditing && !disabled ? (
                <div className="flex items-center">
                   <span className="text-2xl font-bold text-white mr-1">$</span>
                   <input
                     type="number"
                     step="0.01"
                     value={newPrice}
                     onChange={(e) => setNewPrice(e.target.value)}
                     onKeyDown={handleKeyDown}
                     onBlur={handleSave}
                     autoFocus
                     className="w-24 bg-gray-900 text-2xl font-bold text-white p-0 border-0 focus:ring-0"
                   />
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">${price.toFixed(2)}</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <button disabled={disabled} onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent">
              <PencilIcon className="w-5 h-5"/>
            </button>
          )}
        </div>
    )
}

const StorageStatus: React.FC<{ usedGB: number; totalGB: number; onUpgrade: () => void; }> = ({ usedGB, totalGB, onUpgrade }) => {
    const usagePercentage = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;
    const usageColor = usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <DatabaseIcon className="w-5 h-5 text-gray-400"/>
                    <h4 className="font-semibold text-white">Account Storage</h4>
                </div>
                <span className="text-sm font-mono text-gray-300">
                    {usedGB.toFixed(2)} GB / {totalGB} GB Used
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div className={`${usageColor} h-2.5 rounded-full`} style={{ width: `${usagePercentage}%` }}></div>
            </div>
             <button onClick={onUpgrade} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Upgrade Plan
             </button>
        </div>
    )
}

const FolderSettings: React.FC<FolderSettingsProps> = ({ 
  folder, 
  onGalleryPriceChange, 
  onPhotoPriceChange,
  onFreeAccessToggle,
  storage, 
  onUpgradeClick, 
  balance, 
  onWithdrawClick,
}) => {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8 shadow-md">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6" />
        Gallery Analytics &amp; Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarSignIcon className="w-6 h-6"/>} label="Gallery Purchases" value={folder.analytics.purchases} />
        <StatCard icon={<DownloadIcon className="w-6 h-6"/>} label="Total Downloads" value={folder.analytics.downloads} />
        
        <div className={`bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2 transition-all ${folder.isFreeAccess ? 'bg-green-900/30 border border-green-500' : ''}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-600/20 text-green-400 mr-4">
                        <GiftIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Free Access Mode</p>
                        <p className="text-sm text-gray-400">
                            {folder.isFreeAccess ? 'Client has full free access.' : 'Client must purchase to access.'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onFreeAccessToggle(!folder.isFreeAccess)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${folder.isFreeAccess ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${folder.isFreeAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>

        <PriceEditor label="Gallery Price" price={folder.galleryPrice} onPriceChange={onGalleryPriceChange} disabled={folder.isFreeAccess} />
        <PriceEditor label="Price Per Item" price={folder.photoPrice} onPriceChange={onPhotoPriceChange} disabled={folder.isFreeAccess} />
        
        <div className="bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-green-600/20 text-green-400 mr-4">
                <WalletIcon className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-sm text-gray-400">Folder Balance</p>
                <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
            </div>
          </div>
          <button onClick={onWithdrawClick} disabled={balance <= 0} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">
            Withdraw Funds
          </button>
        </div>

        <StorageStatus usedGB={storage.usedGB} totalGB={storage.totalGB} onUpgrade={onUpgradeClick} />
      </div>
    </div>
  );
};

export default FolderSettings;