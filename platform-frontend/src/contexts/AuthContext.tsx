'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';
import { UserOut, LoginRequest, LoginResponse, UserDetailsOut } from '@/types';

interface AuthContextType {
  user: UserOut | null;
  userDetails: UserDetailsOut | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUserDetails: () => Promise<void>;
  createUser: (userData: any) => Promise<UserOut>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth status after mounting
  useEffect(() => {
    if (mounted) {
      checkAuthStatus();
    }
  }, [mounted]);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('access_token');
      if (token) {
        // Get current user info from backend
        const userData = await apiClient.get<UserOut>('/me');
        setUser(userData);
        await fetchUserDetails(userData.id);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      const details = await apiClient.get<UserDetailsOut>(`/users/${userId}/details`);
      setUserDetails(details);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const login = async (credentials: LoginRequest) => {
  setIsLoading(true); // Add loading state
  try {
    console.log('Attempting login with:', credentials);
    
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    
    if (!data.access_token || !data.user) {
      throw new Error('Invalid response from server');
    }

    // Set token in cookies
    Cookies.set('access_token', data.access_token, { expires: 7 });
    
    // Set user state
    setUser(data.user);
    
    console.log('Login successful');
    
    // Don't await fetchUserDetails here, it can load in background
    fetchUserDetails(data.user.id).catch(console.error);
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setIsLoading(false); // Always reset loading state
  }
};
  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('access_token');
      setUser(null);
      setUserDetails(null);
    }
  };

  const createUser = async (userData: any) => {
    try {
      console.log('Creating user:', userData);
      const newUser = await apiClient.post<UserOut>('/users/create', userData);
      console.log('User created successfully:', newUser);
      return newUser;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  };

  const refreshUserDetails = async () => {
    if (user) {
      await fetchUserDetails(user.id);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const value = {
    user,
    userDetails,
    isLoading,
    login,
    logout,
    createUser,
    isAuthenticated: !!user,
    refreshUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
