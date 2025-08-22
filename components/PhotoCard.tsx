import React from 'react';
import { type MediaItem } from '../types';
import { ShoppingCartIcon, CheckCircleIcon, PlayIcon } from './icons';

interface PhotoCardProps {
  photo: MediaItem;
  onSelect: (photo: MediaItem) => void;
  locked: boolean;
  purchased: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onSelect, locked, purchased }) => {
  const isLockedAndUnpurchased = locked && !purchased;
  const isVideo = photo.type === 'video';

  return (
    <div
      className="group aspect-w-1 aspect-h-1 relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-800"
      onClick={() => onSelect(photo)}
    >
      <img
        src={photo.thumbnailUrl || photo.url}
        alt={photo.title}
        className={`object-cover w-full h-full transform transition-all duration-300 group-hover:scale-110`}
        loading="lazy"
      />
      
      {/* Video indicator */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <PlayIcon className="w-16 h-16 text-white/50 drop-shadow-lg group-hover:text-white/80 transition-colors" />
        </div>
      )}


      {/* Watermark and purchase prompt for locked photos */}
      {isLockedAndUnpurchased && (
        <>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }} className="text-white/40 font-bold text-2xl transform -rotate-30 select-none">
              CloudPhoto
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <ShoppingCartIcon className="w-12 h-12 text-white/90" />
          </div>
        </>
      )}

      {/* Checkmark for purchased photos */}
      {purchased && (
        <div className="absolute top-2 right-2 bg-green-500/90 text-white rounded-full p-1.5 shadow-lg">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
      )}

      {/* Hover info for unlocked photos (photographer view or after gallery purchase) */}
      {(!locked || purchased) && !isLockedAndUnpurchased && (
        <>
          <div className="absolute inset-0 bg-black transition-all duration-300 bg-opacity-0 group-hover:bg-opacity-50" />
          <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <h3 className="text-white font-semibold text-sm truncate">{photo.title}</h3>
            <p className="text-gray-300 text-xs">{photo.date}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoCard;
