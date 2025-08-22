import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, accessCode?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('buyer');
  
  const PhotographerLogin = () => {
    const [email, setEmail] = useState('photographer@example.com');
    const [password, setPassword] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      setTimeout(() => {
        if (email && password) {
          onLoginSuccess('user');
        } else {
          setError('Please enter both email and password.');
          setIsLoading(false);
        }
      }, 1000);
    };

    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Signing in...' : 'Sign in as Photographer'}
          </button>
        </div>
      </form>
    );
  };
  
  const BuyerLogin = () => {
    const [accessCode, setAccessCode] = useState('JUNE-WEDDING-2024');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      setTimeout(() => {
        if (accessCode) {
          onLoginSuccess('buyer', accessCode);
        } else {
          setError('Please enter a valid access code.');
          setIsLoading(false);
        }
      }, 1000);
    };
    
    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="access-code" className="sr-only">Gallery Access Code</label>
          <input id="access-code" name="access-code" type="text" required className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Gallery Access Code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Accessing...' : 'Access Gallery'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            CloudPhoto
          </h1>
          <p className="mt-2 text-gray-400">Welcome to your personal gallery</p>
        </div>

        <div className="flex p-1 bg-gray-900 rounded-lg">
          <button onClick={() => setActiveTab('buyer')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 rounded-md transition-colors ${activeTab === 'buyer' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/[0.12]'}`}>
            Client Access
          </button>
          <button onClick={() => setActiveTab('user')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 rounded-md transition-colors ${activeTab === 'user' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/[0.12]'}`}>
            Photographer Login
          </button>
        </div>
        
        <div className="mt-8">
            {activeTab === 'buyer' ? <BuyerLogin /> : <PhotographerLogin />}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
