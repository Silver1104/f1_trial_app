'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Trophy, Users, Home, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400">
              🏎️ F1 Platform
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  href="/drivers" 
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Drivers
                </Link>
                <Link 
                  href="/constructors" 
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Constructors
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/login"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-red-400 hover:text-red-300 px-4 py-2 rounded-md text-sm font-medium border border-red-600 hover:border-red-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  href="/drivers" 
                  className="flex items-center text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Drivers
                </Link>
                <Link 
                  href="/constructors" 
                  className="flex items-center text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Constructors
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
