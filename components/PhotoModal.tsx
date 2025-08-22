import React, { useEffect, useState } from 'react';
import { type MediaItem, UserRole } from '../types';
import { CloseIcon, DownloadIcon, TrashIcon, ShoppingCartIcon } from './icons';

interface PhotoModalProps {
  photo: MediaItem;
  onClose: () => void;
  onDelete: (photoId: string) => void;
  role: UserRole;
  onDownload: () => void;
  purchased: boolean;
  onSinglePhotoPurchase: (photo: MediaItem) => void;
  onGalleryPurchaseClick: () => void;
  galleryPrice: number;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  onClose, 
  onDelete, 
  role, 
  onDownload, 
  purchased,
  onSinglePhotoPurchase,
  onGalleryPurchaseClick,
  galleryPrice
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isVideo = photo.type === 'video';
  
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
  
  const handlePurchaseClick = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      onSinglePhotoPurchase(photo);
      setIsLoading(false);
    }, 1500);
  };

  const BuyerPurchaseView = () => (
    <div className="p-4 sm:p-6 text-center">
      <h3 className="text-2xl font-bold mb-2">Unlock This {isVideo ? 'Video' : 'Photo'}</h3>
      <p className="text-gray-400 mb-6">Purchase this single item or get the best value by unlocking the entire gallery.</p>
      <div className="space-y-4">
        <button
          onClick={handlePurchaseClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </>
          ) : (
            <>
              <ShoppingCartIcon className="w-5 h-5" />
              Buy {isVideo ? 'Video' : 'Photo'} for ${photo.price.toFixed(2)}
            </>
          )}
        </button>
        <button
          onClick={onGalleryPurchaseClick}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Buy Full Gallery for ${galleryPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
  
  const MediaViewer = () => {
    if (!purchased && role === 'buyer') {
        return (
            <div className="w-full h-full flex items-center justify-center relative bg-black">
                <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    className="max-w-full max-h-[70vh] object-contain opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }} className="text-white/40 font-bold text-5xl md:text-6xl transform -rotate-30 select-none">
                        CloudPhoto
                    </span>
                </div>
            </div>
        );
    }

    if (isVideo) {
        return (
            <video
                src={photo.url}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] object-contain"
                aria-label={photo.title}
            />
        );
    }
    
    return (
        <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[70vh] object-contain"
        />
    );
};


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
            <p className="text-sm text-gray-400">{photo.date}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-2 md:p-4 flex items-center justify-center overflow-hidden bg-black">
          <MediaViewer />
        </div>
        
        {purchased ? (
          <div className="p-4 flex justify-end items-center space-x-2 border-t border-gray-700">
            <a href={photo.url} onClick={onDownload} download={photo.title} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                <DownloadIcon className="w-5 h-5"/>
                Download
            </a>
            {role === 'user' && (
              <button onClick={() => onDelete(photo.id)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  <TrashIcon className="w-5 h-5"/>
                  Delete
              </button>
            )}
          </div>
        ) : (
          <div className="border-t border-gray-700">
            <BuyerPurchaseView />
          </div>
        )}

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

export default PhotoModal;
