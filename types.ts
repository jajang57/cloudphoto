export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string; // For video thumbnails
  title: string;
  date: string;
  sizeMB: number;
  price: number;
  type: 'photo' | 'video';
}

export interface Folder {
  id: string;
  name: string;
  accessCode: string;
  mediaIds: string[];
  galleryPrice: number;
  photoPrice: number;
  isFreeAccess: boolean;
  analytics: {
    purchases: number;
    downloads: number;
  };
  totalRevenue: number;
  paidOutBalance: number;
}

export type UserRole = 'user' | 'buyer';

export interface AuthState {
  role: UserRole;
  activeFolderId?: string;
}
