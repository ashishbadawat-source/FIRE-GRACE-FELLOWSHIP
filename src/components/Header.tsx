/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Menu,
  X,
  Radio,
  User,
  Shield,
  Bell,
  LogOut,
  ChevronDown,
  BookOpen,
  Video,
  Calendar,
  HeartHandshake,
  Users,
  Camera,
  Layers,
  PhoneCall,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { api } from '../services/api';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, openAuthModal, logout, unreadNotifCount, loginAsAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleAdminAccess = async () => {
    if (user?.role === 'admin') {
      handleNav('admin-dashboard');
      return;
    }
    setIsAdminLoading(true);
    await loginAsAdmin();
    setIsAdminLoading(false);
    handleNav('admin-dashboard');
  };

  useEffect(() => {
    // Check live status
    api.getLiveConfig().then(res => {
      setIsLive(res.liveConfig?.isLive || false);
    }).catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setMediaDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl'
          : 'bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition shrink-0">
              <img
                src="/logo.png"
                alt="Fire & Grace Fellowship Official Logo"
                className="w-full h-full object-cover rounded-full bg-slate-950"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-cinzel text-base sm:text-lg md:text-xl font-bold tracking-wider text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                FIRE & GRACE <span className="text-amber-400">FELLOWSHIP</span>
              </span>
              <p className="text-[9px] sm:text-[10px] tracking-wider text-amber-200/80 font-sans italic truncate max-w-[200px] sm:max-w-none">
                Ignited by Fire, Covered by Grace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-home"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'home' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              id="nav-about"
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'about' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </button>

            <button
              id="nav-bible"
              onClick={() => handleNav('bible')}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentView === 'bible' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Bible
            </button>

            <button
              id="nav-testimonies"
              onClick={() => handleNav('testimonies')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'testimonies' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Testimonies
            </button>

            <button
              id="nav-sermons"
              onClick={() => handleNav('sermons')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'sermons' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Sermons
            </button>

            {/* Media Dropdown (Photos & Videos) */}
            <div className="relative">
              <button
                id="nav-media-dropdown"
                onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${
                  ['photos', 'videos'].includes(currentView)
                    ? 'text-amber-400 font-semibold bg-amber-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Media
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {mediaDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-amber-500/20 rounded-xl shadow-2xl py-2 z-50">
                  <button
                    onClick={() => handleNav('photos')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 flex items-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5" /> Photos Gallery
                  </button>
                  <button
                    onClick={() => handleNav('videos')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 flex items-center gap-2"
                  >
                    <Video className="w-3.5 h-3.5" /> Video Library
                  </button>
                  <button
                    onClick={() => handleNav('testimonies')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-amber-400" /> गवाही पुस्तिका (Testimonies)
                  </button>
                </div>
              )}
            </div>

            {/* Watch Live Button with Status Indicator */}
            <button
              id="nav-live"
              onClick={() => handleNav('live')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 border ${
                currentView === 'live'
                  ? 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-red-500/40 bg-red-950/30 text-red-400 hover:bg-red-900/40'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-red-500' : 'bg-red-700'}`}></span>
              </span>
              <span className="font-semibold text-xs tracking-wider">LIVE</span>
            </button>

            <button
              id="nav-events"
              onClick={() => handleNav('events')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'events' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Events
            </button>

            <button
              id="nav-prayer"
              onClick={() => handleNav('prayer')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'prayer' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Prayer
            </button>

            <button
              id="nav-meetings"
              onClick={() => handleNav('meetings')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'meetings' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Meetings
            </button>

            <button
              id="nav-activities"
              onClick={() => handleNav('activities')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'activities' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Activities
            </button>

            <button
              id="nav-contact"
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'contact' ? 'text-amber-400 font-semibold bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </button>

            <button
              id="nav-donate"
              onClick={() => handleNav('donate')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                ['donate', 'give', 'giving'].includes(currentView)
                  ? 'text-amber-300 font-bold bg-amber-500/20 border border-amber-500/40 shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-amber-400/30 text-amber-400" />
              Give
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Direct Admin Access Button */}
            <button
              id="btn-desktop-admin-access"
              onClick={handleAdminAccess}
              disabled={isAdminLoading}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/40 border border-amber-400/60 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-500/10 transition group"
              title="Direct Admin Access / एडमिन पैनल"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>{isAdminLoading ? 'Logging In...' : 'Admin Access'}</span>
            </button>

            <button
              id="btn-desktop-give"
              onClick={() => handleNav('donate')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-yellow-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Give Online
            </button>

            <PWAInstallButton compact />

            {user ? (
              <div className="flex items-center gap-2">
                {/* Unread Notifs Icon */}
                <button
                  id="btn-nav-notifs"
                  onClick={() => handleNav(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Dashboard Shortcut */}
                <button
                  id="btn-nav-dashboard"
                  onClick={() => handleNav(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-slate-100 text-xs transition"
                >
                  <img
                    src={user.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                  <div className="text-left">
                    <span className="font-bold text-amber-300 block truncate max-w-[100px]">{user.fullName.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{user.memberId}</span>
                  </div>
                  {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-400 ml-0.5" />}
                </button>

                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-login"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition"
                >
                  Login
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition"
                >
                  Join / Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Quick Action */}
          <div className="flex items-center gap-2 lg:hidden">
            <PWAInstallButton compact />

            {/* Quick Live Pill */}
            <button
              onClick={() => handleNav('live')}
              className="p-2 text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-center"
              title="Watch Live"
            >
              <Radio className="w-4 h-4 animate-pulse" />
            </button>

            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-slate-950/98 backdrop-blur-xl border-t border-white/10 overflow-y-auto p-5 space-y-4 z-50">
          {/* Official Church Banner in Mobile Drawer */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Fire & Grace Fellowship"
              className="w-12 h-12 rounded-full border-2 border-amber-400 shrink-0 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h3 className="font-cinzel text-xs font-bold text-white tracking-wider">
                FIRE & GRACE FELLOWSHIP
              </h3>
              <p className="text-[10px] text-amber-300 italic truncate">
                Ignited by Fire, Covered by Grace
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300">
                <a href="tel:+917066463676" className="text-amber-400 hover:underline">📞 +91 7066463676</a>
                <span>•</span>
                <a href="tel:+917841817431" className="text-amber-400 hover:underline">+91 7841817431</a>
              </div>
            </div>
          </div>

          {/* Direct Admin Access Button (Mobile) */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleAdminAccess();
            }}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/60 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{user?.role === 'admin' ? 'Open Admin Dashboard (एडमिन पैनल)' : '👑 1-Click Admin Access (एडमिन लॉगिन)'}</span>
          </button>

          {/* User Status Bar */}
          {user ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                  alt={user.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{user.fullName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                      ID: {user.memberId}
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">ADMIN</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-3 text-center rounded-xl bg-slate-900 border border-white/10 text-white font-semibold text-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="w-full py-3 text-center rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Join / Register
              </button>
            </div>
          )}

          {/* Quick Dashboard Links if logged in */}
          {user && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNav(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" /> Open Dashboard
              </button>
              <button
                onClick={() => handleNav('bible')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" /> Holy Bible
              </button>
            </div>
          )}

          {/* Prominent Mobile Give Card Button */}
          <button
            onClick={() => handleNav('donate')}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 fill-slate-950 text-slate-950" />
              <div className="text-left">
                <span className="block font-bold">Online Giving & Tithes</span>
                <span className="text-[10px] text-slate-900 font-medium">Google Pay • PhonePe • Bank Account</span>
              </div>
            </div>
            <span className="text-[11px] bg-slate-950 text-amber-400 px-2 py-1 rounded-lg font-mono font-bold">GIVE</span>
          </button>

          {/* Navigation Items */}
          <div className="space-y-1 text-sm font-medium border-t border-white/10 pt-3">
            {[
              { id: 'home', label: 'Home' },
              { id: 'donate', label: 'Online Giving & Tithes' },
              { id: 'about', label: 'About Fire & Grace' },
              { id: 'bible', label: 'Holy Bible' },
              { id: 'testimonies', label: 'गवाही पुस्तिका (Testimonies)' },
              { id: 'sermons', label: 'Sermons Library' },
              { id: 'photos', label: 'Photo Gallery' },
              { id: 'videos', label: 'Video Ministry' },
              { id: 'live', label: 'Watch Live Broadcast' },
              { id: 'events', label: 'Upcoming Events' },
              { id: 'prayer', label: 'Prayer Requests' },
              { id: 'meetings', label: 'Zoom & Meet Gatherings' },
              { id: 'activities', label: 'Weekly Activities' },
              { id: 'contact', label: 'Contact & Location' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center justify-between ${
                  currentView === item.id
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'live' && isLive && (
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                    ON AIR
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            <p>Need urgent pastoral prayer?</p>
            <button
              onClick={() => handleNav('prayer')}
              className="mt-2 text-amber-400 underline font-semibold"
            >
              Submit Prayer Request
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
