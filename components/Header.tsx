import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  onLogout: () => void;
  role: UserRole;
  folderName?: string;
  onBackToDashboard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, role, folderName, onBackToDashboard }) => {
  const userName = role === 'user' ? 'Photographer' : 'Valued Client';

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
              CloudPhoto
            </h1>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} className="text-sm text-gray-300 hover:text-white transition-colors">
                &larr; Back to Dashboard
              </button>
            )}
            {folderName && !onBackToDashboard && (
                 <span className="text-gray-400 hidden sm:block">/ {folderName}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                className="h-8 w-8 rounded-full"
                src={`https://i.pravatar.cc/150?u=${role}`}
                alt="User avatar"
              />
              <span className="text-sm font-medium text-gray-300 hidden sm:block">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
