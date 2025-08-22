import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { type MediaItem, type UserRole, type Folder } from '../types';
import Header from './Header';
import PhotoCard from './PhotoCard';
import PhotoModal from './PhotoModal';
import ShareModal from './ShareModal';
import PurchaseModal from './PurchaseModal';
import FolderSettings from './FolderSettings';
import StorageModal from './StorageModal';
import PayoutModal from './PayoutModal';
import { ShareIcon, UploadIcon, PencilIcon } from './icons';

interface GalleryScreenProps {
  role: UserRole;
  onLogout: () => void;
  onBackToDashboard?: () => void;
  folder: Folder;
  media: MediaItem[];
  onUpdateFolder: (folder: Folder) => void;
  onAddMedia: (mediaItem: MediaItem) => void;
  onDeleteMedia: (mediaId: string) => void;
  storage: {
    totalGB: number;
    usedMB: number;
    onUpgrade: (newSizeGB: number) => void;
  }
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ 
  role, onLogout, onBackToDashboard, 
  folder, media, onUpdateFolder, onAddMedia, onDeleteMedia,
  storage
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  
  // Buyer state for the current folder
  const [isGalleryPurchased, setIsGalleryPurchased] = useState<boolean>(role === 'user');
  const [purchasedPhotoIds, setPurchasedPhotoIds] = useState<Set<string>>(new Set());

  // Name editing state
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>(folder.name);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const availableBalance = useMemo(() => {
    return folder.totalRevenue - folder.paidOutBalance;
  }, [folder.totalRevenue, folder.paidOutBalance]);

  const handleSelectMedia = useCallback((item: MediaItem) => {
    const isPurchased = isGalleryPurchased || purchasedPhotoIds.has(item.id) || folder.isFreeAccess;
    if (isPurchased || role === 'user') {
      setSelectedMedia(item);
    } else {
       // For buyers, clicking a locked item opens the modal to buy it
      setSelectedMedia(item);
    }
  }, [isGalleryPurchased, purchasedPhotoIds, role, folder.isFreeAccess]);

  const handleCloseModal = useCallback(() => {
    setSelectedMedia(null);
  }, []);
  
  const handleDelete = useCallback((mediaId: string) => {
    if (role === 'user') {
      onDeleteMedia(mediaId);
      setSelectedMedia(null);
    }
  }, [role, onDeleteMedia]);

  const handleGalleryPurchaseSuccess = useCallback(() => {
    setIsGalleryPurchased(true);
    setIsPurchaseModalOpen(false);
    if (role === 'buyer') {
        const updatedFolder = {
            ...folder,
            analytics: { ...folder.analytics, purchases: folder.analytics.purchases + 1 },
            totalRevenue: folder.totalRevenue + folder.galleryPrice,
        };
        onUpdateFolder(updatedFolder);
    }
  }, [role, folder, onUpdateFolder]);
  
  const handleSinglePhotoPurchase = useCallback((item: MediaItem) => {
    setPurchasedPhotoIds(prev => new Set(prev).add(item.id));
    if (role === 'buyer') {
      const updatedFolder = {
          ...folder,
          analytics: { ...folder.analytics, downloads: folder.analytics.downloads + 1 }, // Count as download
          totalRevenue: folder.totalRevenue + item.price,
      };
      onUpdateFolder(updatedFolder);
    }
    // Close the modal after purchase
    setTimeout(() => setSelectedMedia(null), 500);
  }, [role, folder, onUpdateFolder]);
  
  const handleTrackDownload = useCallback(() => {
    const updatedFolder = {
        ...folder,
        analytics: { ...folder.analytics, downloads: folder.analytics.downloads + 1 },
    };
    onUpdateFolder(updatedFolder);
  }, [folder, onUpdateFolder]);
  
  const handlePhotoPriceChange = useCallback((newPrice: number) => {
    onUpdateFolder({ ...folder, photoPrice: newPrice });
  }, [folder, onUpdateFolder]);

  const handleGalleryPriceChange = useCallback((newPrice: number) => {
    onUpdateFolder({ ...folder, galleryPrice: newPrice });
  }, [folder, onUpdateFolder]);

  const handleFreeAccessToggle = useCallback((isEnabled: boolean) => {
    onUpdateFolder({ ...folder, isFreeAccess: isEnabled });
  }, [folder, onUpdateFolder]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newMediaSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
      const availableStorageMB = (storage.totalGB * 1024) - storage.usedMB;

      if (newMediaSizeMB > availableStorageMB) {
        alert("Not enough storage space. Please upgrade your plan to upload this file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
        
        const newMediaItem: MediaItem = {
          id: `media-${Date.now()}`,
          url: e.target?.result as string,
          thumbnailUrl: fileType === 'video' ? `https://picsum.photos/seed/${Date.now()}/800/600` : undefined,
          title: file.name,
          date: new Date().toLocaleDateString(),
          sizeMB: newMediaSizeMB,
          price: fileType === 'photo' ? folder.photoPrice : (folder.photoPrice * 2),
          type: fileType,
        };
        onAddMedia(newMediaItem);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePayoutSuccess = useCallback(() => {
      onUpdateFolder({ ...folder, paidOutBalance: folder.totalRevenue });
      setIsPayoutModalOpen(false);
  }, [folder, onUpdateFolder]);

  const handleNameSave = () => {
    if (currentName.trim() && currentName !== folder.name) {
      onUpdateFolder({ ...folder, name: currentName.trim() });
    }
    setIsEditingName(false);
  };

  const buyerHasAccess = isGalleryPurchased || folder.isFreeAccess;

  const photoGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {media.map(item => (
        <PhotoCard 
          key={item.id} 
          photo={item} 
          onSelect={handleSelectMedia} 
          locked={!buyerHasAccess && !purchasedPhotoIds.has(item.id)}
          purchased={purchasedPhotoIds.has(item.id)}
        />
      ))}
    </div>
  ), [media, handleSelectMedia, buyerHasAccess, purchasedPhotoIds]);

  const PurchaseBanner = () => (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 mb-8 text-center shadow-lg">
      <h3 className="text-2xl font-bold mb-2">Unlock Full Access</h3>
      <p className="text-indigo-100 mb-4">Purchase the full gallery to view and download all items in high-resolution.</p>
      <button 
        onClick={() => setIsPurchaseModalOpen(true)}
        className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors"
      >
        Unlock All for ${folder.galleryPrice.toFixed(2)}
      </button>
    </div>
  );
  
  return (
    <>
      <Header onLogout={onLogout} role={role} folderName={folder.name} onBackToDashboard={onBackToDashboard}/>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              {isEditingName && role === 'user' ? (
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter') handleNameSave(); 
                    if (e.key === 'Escape') { 
                      setIsEditingName(false); 
                      setCurrentName(folder.name); 
                    } 
                  }}
                  className="text-3xl font-bold bg-gray-700 text-white rounded-md px-2 -mx-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              ) : (
                <h2 className="text-3xl font-bold">{folder.name}</h2>
              )}
              {role === 'user' && !isEditingName && (
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Edit gallery name"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-400 mt-1">{role === 'user' ? `Access Code: ${folder.accessCode}` : 'Your Private Gallery'}</p>
          </div>
          <div className="flex items-center space-x-2">
            {role === 'user' && (
              <>
                <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button 
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    aria-label="Upload media"
                >
                  <UploadIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </>
            )}
            <button 
                onClick={() => setIsShareModalOpen(true)} 
                disabled={!(buyerHasAccess || role === 'user')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-label={buyerHasAccess || role === 'user' ? "Share gallery" : "Purchase gallery to share"}
            >
              <ShareIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {role === 'user' && <FolderSettings
            folder={folder}
            onGalleryPriceChange={handleGalleryPriceChange}
            onPhotoPriceChange={handlePhotoPriceChange}
            onFreeAccessToggle={handleFreeAccessToggle}
            onUpdateName={(newName) => onUpdateFolder({...folder, name: newName})}
            storage={{ usedGB: storage.usedMB / 1024, totalGB: storage.totalGB }}
            onUpgradeClick={() => setIsStorageModalOpen(true)}
            balance={availableBalance}
            onWithdrawClick={() => setIsPayoutModalOpen(true)}
        />}
        {role === 'buyer' && !buyerHasAccess && <PurchaseBanner />}

        {photoGrid}
      </main>

      {selectedMedia && (
        <PhotoModal 
          photo={selectedMedia} 
          onClose={handleCloseModal} 
          onDelete={handleDelete} 
          role={role} 
          onDownload={handleTrackDownload}
          purchased={role === 'user' || buyerHasAccess || purchasedPhotoIds.has(selectedMedia.id)}
          onSinglePhotoPurchase={handleSinglePhotoPurchase}
          onGalleryPurchaseClick={() => {
            handleCloseModal();
            setIsPurchaseModalOpen(true);
          }}
          galleryPrice={folder.galleryPrice}
        />
      )}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} accessCode={folder.accessCode}/>}
      {isPurchaseModalOpen && <PurchaseModal onClose={() => setIsPurchaseModalOpen(false)} onGalleryPurchaseSuccess={handleGalleryPurchaseSuccess} price={folder.galleryPrice} />}
      {isStorageModalOpen && <StorageModal onClose={() => setIsStorageModalOpen(false)} onPurchase={storage.onUpgrade} currentPlanGB={storage.totalGB} />}
      {isPayoutModalOpen && <PayoutModal onClose={() => setIsPayoutModalOpen(false)} onSuccess={handlePayoutSuccess} balance={availableBalance} />}
    </>
  );
};

export default GalleryScreen;