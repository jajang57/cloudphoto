import React from 'react';
import Header from './Header';
import { type Folder, type MediaItem } from '../types';
import { FolderIcon, PlusCircleIcon } from './icons';

interface DashboardScreenProps {
  folders: Folder[];
  mediaItems: Record<string, MediaItem>;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: () => void;
  onLogout: () => void;
}

const FolderCard: React.FC<{folder: Folder, mediaCount: number, thumbnailUrl?: string, onSelect: () => void}> = ({ folder, mediaCount, thumbnailUrl, onSelect }) => (
    <div 
        className="group relative cursor-pointer aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-800 shadow-lg"
        onClick={onSelect}
    >
        {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={folder.name} className="object-cover w-full h-full transform transition-all duration-300 group-hover:scale-110" />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <FolderIcon className="w-24 h-24 text-gray-700" />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white font-bold text-lg truncate">{folder.name}</h3>
            <p className="text-gray-300 text-sm">{mediaCount} items</p>
            <p className="text-xs text-gray-400 font-mono mt-1">Code: {folder.accessCode}</p>
        </div>
    </div>
);

const CreateFolderCard: React.FC<{onCreate: () => void}> = ({ onCreate }) => (
    <div 
        onClick={onCreate}
        className="cursor-pointer aspect-w-1 aspect-h-1 rounded-lg border-2 border-dashed border-gray-600 hover:border-indigo-500 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-indigo-400"
    >
        <PlusCircleIcon className="w-12 h-12 mb-2" />
        <span className="font-semibold">Create New Gallery</span>
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ folders, mediaItems, onSelectFolder, onCreateFolder, onLogout }) => {
  return (
    <>
      <Header onLogout={onLogout} role="user" />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Your Galleries</h2>
          <p className="text-gray-400 mt-1">Select a gallery to manage or create a new one.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {folders.map(folder => {
            const firstMediaId = folder.mediaIds[0];
            const firstMediaItem = firstMediaId ? mediaItems[firstMediaId] : null;
            const thumbnailUrl = firstMediaItem?.thumbnailUrl || firstMediaItem?.url;

            return (
              <FolderCard
                key={folder.id}
                folder={folder}
                mediaCount={folder.mediaIds.length}
                thumbnailUrl={thumbnailUrl}
                onSelect={() => onSelectFolder(folder.id)}
              />
            );
          })}
          <CreateFolderCard onCreate={onCreateFolder} />
        </div>
      </main>
    </>
  );
};

export default DashboardScreen;
