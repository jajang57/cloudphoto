import React, { useState, useCallback, useMemo } from 'react';
import LoginScreen from './components/LoginScreen';
import GalleryScreen from './components/GalleryScreen';
import DashboardScreen from './components/DashboardScreen';
import { type UserRole, type Folder, type MediaItem } from './types';

// Simulate a random file size between 2MB and 8MB for photos, 10-50MB for videos
const getRandomSizeMB = (type: 'photo' | 'video') =>
  type === 'photo' ? Math.random() * 6 + 2 : Math.random() * 40 + 10;

const defaultPhotoPrice = 1.99;
const defaultVideoPrice = 4.99;

const initialMedia: MediaItem[] = [
  // Photos
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `media-${i + 1}`,
    url: `https://picsum.photos/seed/${i + 1}/800/600`,
    title: `Nature Scene ${i + 1}`,
    date: new Date(Date.now() - (i + 4) * 1000 * 60 * 60 * 24).toLocaleDateString(),
    sizeMB: getRandomSizeMB('photo'),
    price: defaultPhotoPrice,
    type: 'photo' as 'photo',
  })),
  // Videos
  {
    id: 'media-15',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
    date: new Date(Date.now() - 3 * 1000 * 60 * 60 * 24).toLocaleDateString(),
    sizeMB: getRandomSizeMB('video'),
    price: defaultVideoPrice,
    type: 'video' as 'video',
  },
  {
    id: 'media-16',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'Elephants Dream',
    date: new Date(Date.now() - 2 * 1000 * 60 * 60 * 24).toLocaleDateString(),
    sizeMB: getRandomSizeMB('video'),
    price: defaultVideoPrice,
    type: 'video' as 'video',
  },
];


const initialFolders: Folder[] = [
    {
        id: 'folder-1',
        name: 'Wedding Photoshoot - June 2024',
        accessCode: 'JUNE-WEDDING-2024',
        mediaIds: initialMedia.map(m => m.id),
        galleryPrice: 24.99,
        photoPrice: 1.99,
        isFreeAccess: false,
        analytics: { purchases: 1, downloads: 7 },
        totalRevenue: 24.99,
        paidOutBalance: 0,
    }
];

interface AuthState {
  role: UserRole;
  activeFolderId?: string; // Client will always have one, user (photographer) might not
}

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [mediaItems, setMediaItems] = useState<Record<string, MediaItem>>(
    initialMedia.reduce((acc, item) => ({...acc, [item.id]: item}), {})
  );

  // Photographer state
  const [totalStorageGB, setTotalStorageGB] = useState(25);
  const usedStorageMB = useMemo(() => {
    return Object.values(mediaItems).reduce((acc, item) => acc + item.sizeMB, 0);
  }, [mediaItems]);

  const handleLoginSuccess = useCallback((role: UserRole, accessCode?: string) => {
    if (role === 'buyer' && accessCode) {
      const folder = folders.find(f => f.accessCode.toUpperCase() === accessCode.toUpperCase());
      if (folder) {
        setAuthState({ role, activeFolderId: folder.id });
      } else {
        // In a real app, the login screen would show this error
        alert("Invalid Access Code");
      }
    } else if (role === 'user') {
      setAuthState({ role }); // No active folder, go to dashboard
    }
  }, [folders]);
  
  const handleLogout = useCallback(() => {
    setAuthState(null);
  }, []);

  const handleSelectFolder = useCallback((folderId: string) => {
    if (authState?.role === 'user') {
        setAuthState(prev => prev ? {...prev, activeFolderId: folderId } : null);
    }
  }, [authState?.role]);

  const handleBackToDashboard = useCallback(() => {
    if (authState?.role === 'user') {
        setAuthState(prev => prev ? {...prev, activeFolderId: undefined } : null);
    }
  }, [authState?.role]);

  const handleCreateFolder = useCallback(() => {
    const newId = `folder-${Date.now()}`;
    const newAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newFolder: Folder = {
      id: newId,
      name: 'New Untitled Gallery',
      accessCode: newAccessCode,
      mediaIds: [],
      galleryPrice: 29.99,
      photoPrice: 2.99,
      isFreeAccess: false,
      analytics: { purchases: 0, downloads: 0 },
      totalRevenue: 0,
      paidOutBalance: 0,
    };
    setFolders(prev => [...prev, newFolder]);
    handleSelectFolder(newId);
  }, [handleSelectFolder]);

  const handleUpdateFolder = useCallback((updatedFolder: Folder) => {
    setFolders(prev => prev.map(f => f.id === updatedFolder.id ? updatedFolder : f));
  }, []);

  const handleAddMediaToFolder = useCallback((folderId: string, newMediaItem: MediaItem) => {
    // Add media to global store
    setMediaItems(prev => ({ ...prev, [newMediaItem.id]: newMediaItem }));
    // Add media ID to folder
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, mediaIds: [newMediaItem.id, ...f.mediaIds] };
      }
      return f;
    }));
  }, []);

  const handleDeleteMedia = useCallback((folderId: string, mediaId: string) => {
    // We'll keep media in the global store for now, but remove from folder
    // A real app might have a cleanup process for orphaned media
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, mediaIds: f.mediaIds.filter(id => id !== mediaId) };
      }
      return f;
    }));
  }, []);

  const renderContent = () => {
    if (!authState) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    const { role, activeFolderId } = authState;

    if (role === 'user' && !activeFolderId) {
      return (
        <DashboardScreen
          folders={folders}
          mediaItems={mediaItems}
          onSelectFolder={handleSelectFolder}
          onCreateFolder={handleCreateFolder}
          onLogout={handleLogout}
        />
      );
    }
    
    if (activeFolderId) {
      const activeFolder = folders.find(f => f.id === activeFolderId);
      if (activeFolder) {
        const activeMedia = activeFolder.mediaIds.map(id => mediaItems[id]).filter(Boolean);
        return (
          <GalleryScreen 
            key={activeFolder.id} // Re-mount when folder changes
            role={role} 
            onLogout={handleLogout}
            onBackToDashboard={role === 'user' ? handleBackToDashboard : undefined}
            folder={activeFolder}
            media={activeMedia}
            onUpdateFolder={handleUpdateFolder}
            onAddMedia={ (newMedia) => handleAddMediaToFolder(activeFolder.id, newMedia) }
            onDeleteMedia={ (mediaId) => handleDeleteMedia(activeFolder.id, mediaId) }
            storage={{
              totalGB: totalStorageGB,
              usedMB: usedStorageMB,
              onUpgrade: setTotalStorageGB,
            }}
          />
        );
      }
    }
    
    // Fallback if something is wrong
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {renderContent()}
    </div>
  );
};

export default App;
