/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  detectedRefCode: string;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  unreadNotifCount: number;
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: () => Promise<{ success: boolean; error?: string }>;
  register: (payload: any) => Promise<{ success: boolean; memberId?: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshNotifs: () => Promise<void>;
  setDetectedRefCode: (code: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fgf_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detectedRefCode, setDetectedRefCode] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Detect referral code from URL search param e.g. ?ref=FGF10001
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref') || urlParams.get('sponsor');
      if (ref) {
        const cleanRef = ref.trim().toUpperCase();
        setDetectedRefCode(cleanRef);
        localStorage.setItem('fgf_ref_code', cleanRef);
      } else {
        const stored = localStorage.getItem('fgf_ref_code');
        if (stored) setDetectedRefCode(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch current user on mount or token change
  const refreshUser = async () => {
    const savedToken = localStorage.getItem('fgf_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      localStorage.removeItem('fgf_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNotifs = async () => {
    try {
      const res = await api.getNotifications();
      const unread = res.notifications.filter(n => !n.isRead).length;
      setUnreadNotifCount(unread);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await api.login({ identifier, password: pass });
      localStorage.setItem('fgf_token', res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const loginAsAdmin = async () => {
    try {
      const res = await api.instantAdminLogin();
      localStorage.setItem('fgf_token', res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Admin login failed.' };
    }
  };

  const register = async (payload: any) => {
    try {
      const res = await api.register(payload);
      localStorage.setItem('fgf_token', res.token);
      setToken(res.token);
      setUser(res.user);
      // clear referral code once used
      localStorage.removeItem('fgf_ref_code');
      setDetectedRefCode('');
      closeAuthModal();
      return { success: true, memberId: res.memberId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fgf_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        detectedRefCode,
        authModalOpen,
        authModalTab,
        unreadNotifCount,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsAdmin,
        register,
        logout,
        refreshUser,
        refreshNotifs,
        setDetectedRefCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
