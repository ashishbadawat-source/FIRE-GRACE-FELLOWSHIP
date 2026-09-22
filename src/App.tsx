/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { BibleView } from './views/BibleView';
import { SermonsView } from './views/SermonsView';
import { PhotosView } from './views/PhotosView';
import { VideosView } from './views/VideosView';
import { LiveView } from './views/LiveView';
import { EventsView } from './views/EventsView';
import { PrayerView } from './views/PrayerView';
import { MeetingsView } from './views/MeetingsView';
import { ActivitiesView } from './views/ActivitiesView';
import { ContactView } from './views/ContactView';
import { DonateView } from './views/DonateView';
import { SongsView } from './views/SongsView';
import { TestimoniesView } from './views/TestimoniesView';
import { UserDashboard } from './views/UserDashboard';
import { AdminDashboard } from './views/AdminDashboard';

const MainApp: React.FC = () => {
  const { openAuthModal, user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');

  // Check URL params for referral code or specific route
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !user) {
      openAuthModal('register');
    }

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentView(hash);
    }
  }, [user]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentView === 'about' && <AboutView onNavigate={handleNavigate} />}
        {currentView === 'bible' && <BibleView onNavigate={handleNavigate} />}
        {['testimonies', 'testimony', 'gawahi'].includes(currentView) && (
          <TestimoniesView onNavigate={handleNavigate} />
        )}
        {currentView === 'sermons' && <SermonsView onNavigateToBible={() => handleNavigate('bible')} />}
        {currentView === 'photos' && <PhotosView />}
        {currentView === 'videos' && <VideosView />}
        {currentView === 'live' && <LiveView />}
        {currentView === 'events' && <EventsView />}
        {currentView === 'prayer' && <PrayerView />}
        {currentView === 'meetings' && <MeetingsView />}
        {currentView === 'activities' && <ActivitiesView />}
        {currentView === 'contact' && <ContactView />}
        {['songs', 'worship', 'music'].includes(currentView) && <SongsView />}
        {['donate', 'give', 'giving'].includes(currentView) && (
          <DonateView onNavigate={handleNavigate} />
        )}
        {['dashboard', 'user-dashboard', 'user_dashboard', 'member-dashboard'].includes(currentView) && (
          <UserDashboard onNavigate={handleNavigate} />
        )}
        {['admin', 'admin-dashboard', 'admin_dashboard', 'adminpanel', 'admin-panel'].includes(currentView) && (
          <AdminDashboard />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Self-contained Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Analytics />
    </AuthProvider>
  );
}
