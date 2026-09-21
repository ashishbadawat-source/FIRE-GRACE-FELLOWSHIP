/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  Calendar,
  BookOpen,
  Heart,
  Radio,
  ArrowRight,
  Clock,
  MapPin,
  Check,
  Copy,
  Share2,
  Users,
  Video,
  Camera,
  MessageSquare,
  Sparkles,
  Building,
  CreditCard,
  QrCode,
  Globe,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HomeHeroBanner } from '../components/HomeHeroBanner';
import type { Sermon, ChurchEvent, PhotoItem, VideoItem, ChurchActivity, HomepageSettings } from '../types';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenSermonModal?: (sermon: Sermon) => void;
  onOpenRegisterModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenRegisterModal }) => {
  const { user, openAuthModal, loginAsAdmin, detectedRefCode } = useAuth();
  const [adminLoading, setAdminLoading] = useState(false);

  const handleHeroAdminClick = async () => {
    if (user?.role === 'admin') {
      onNavigate('admin-dashboard');
      return;
    }
    setAdminLoading(true);
    await loginAsAdmin();
    setAdminLoading(false);
    onNavigate('admin-dashboard');
  };

  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activities, setActivities] = useState<ChurchActivity[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeSermonVideo, setActiveSermonVideo] = useState<Sermon | null>(null);

  useEffect(() => {
    // Load Homepage Data
    api.getSettings().then(res => setSettings(res.homepageSettings)).catch(() => {});
    api.getSermons().then(res => setSermons(res.sermons.slice(0, 3))).catch(() => {});
    api.getEvents().then(res => setEvents(res.events.slice(0, 3))).catch(() => {});
    api.getPhotos().then(res => setPhotos(res.photos.slice(0, 6))).catch(() => {});
    api.getVideos().then(res => setVideos(res.videos.slice(0, 2))).catch(() => {});
    api.getActivities().then(res => setActivities(res.activities.slice(0, 4))).catch(() => {});
    api.getLiveConfig().then(res => setIsLive(res.liveConfig.isLive)).catch(() => {});
  }, []);

  const handleCopyVerse = (vText: string, vRef: string, vVer: string) => {
    const text = `"${vText}" — ${vRef} (${vVer}) | Fire Grace Fellowship`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 3000);
  };

  const handleShareVerse = (vText: string, vRef: string, vVer: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Verse of the Day',
        text: `"${vText}" — ${vRef} (${vVer})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyVerse(vText, vRef, vVer);
    }
  };

  const heroBanner = settings?.heroBanner || 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=1600&auto=format&fit=crop&q=80';
  const verseRef = settings?.verseOfTheDay?.reference ||
    (settings?.verseOfTheDay?.book ? `${settings.verseOfTheDay.book} ${settings.verseOfTheDay.chapter}:${settings.verseOfTheDay.verseNumber || settings.verseOfTheDay.verse}` : 'Zechariah 4:6');
  const verseText = settings?.verseOfTheDay?.text || 'Not by might nor by power, but by My Spirit, says the LORD of hosts.';
  const verseVersion = settings?.verseOfTheDay?.version || 'NKJV';
  const verseCommentary = settings?.verseOfTheDay?.commentary || 'Walk in the confidence that what human effort cannot achieve, the Holy Spirit accomplishes with ease and divine favor.';

  return (
    <div id="home-view" className="space-y-16 pb-20">
      {/* ------------------------------------------------------------------
          1. OFFICIAL FIRE & GRACE HERO BANNER (As specified)
      ------------------------------------------------------------------ */}
      <HomeHeroBanner onNavigate={onNavigate} onOpenAuthModal={() => openAuthModal('register')} />

      {/* Detected Referral Invitation Alert & Live Banner */}
      {(detectedRefCode || isLive) && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4">
          {detectedRefCode && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You were invited by Sponsor: <strong className="font-mono">{detectedRefCode}</strong></span>
            </div>
          )}

          {isLive && (
            <button
              onClick={() => onNavigate('live')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 border border-red-500 text-white text-xs font-bold tracking-wider hover:bg-red-500 transition shadow-lg shadow-red-600/30"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>CHURCH SERVICE IS STREAMING LIVE NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Quick Action Buttons for Members / Guests */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4">
        {user ? (
          <button
            id="btn-hero-dashboard"
            onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Enter Your Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              id="btn-hero-register"
              onClick={() => openAuthModal('register')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Join & Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-hero-login"
              onClick={() => openAuthModal('login')}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white font-semibold text-xs transition"
            >
              Member Login
            </button>
          </>
        )}

        <button
          id="btn-hero-live"
          onClick={() => onNavigate('live')}
          className="px-5 py-3 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition flex items-center gap-2"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Watch Live</span>
        </button>

        <button
          id="btn-hero-admin-direct"
          onClick={handleHeroAdminClick}
          disabled={adminLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/40 border border-amber-400/60 text-amber-300 font-bold text-xs shadow-lg shadow-amber-500/10 transition flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>{adminLoading ? 'Opening...' : '👑 Admin Access'}</span>
        </button>

        <button
          id="btn-hero-give"
          onClick={() => onNavigate('donate')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-yellow-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Give / Tithes</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------
          2. BIBLE VERSE OF THE DAY
      ------------------------------------------------------------------ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden">
          {/* Decorative Corner Icon */}
          <div className="absolute top-4 right-4 text-amber-500/10 pointer-events-none">
            <BookOpen className="w-32 h-32" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                <span>Verse of the Day</span>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                {verseVersion}
              </span>
            </div>

            <blockquote className="font-lora text-xl md:text-2xl text-white italic leading-relaxed">
              "{verseText}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div>
                <cite className="font-cinzel text-base font-bold text-amber-300 not-italic block">
                  — {verseRef}
                </cite>
                {verseCommentary && (
                  <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
                    {verseCommentary}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyVerse(verseText, verseRef, verseVersion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition"
                  title="Copy verse text"
                >
                  {copiedVerse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVerse ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleShareVerse(verseText, verseRef, verseVersion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition"
                  title="Share verse"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => onNavigate('bible')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition"
                >
                  <span>Open Bible</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2C. FOUR CORE PILLARS (OFFICIAL VISION)
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Foundational Pillars</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">Our Core Mission Pillars</h2>
          <p className="text-xs text-slate-400">
            Rooted in scripture, ignited by fire, and sent forth to make a kingdom difference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-cinzel text-white group-hover:text-amber-300 transition">
              LOVE GOD
            </h3>
            <p className="text-xs font-semibold text-amber-400/90 mt-0.5">Wholeheartedly</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Exalting the Father with all our heart, soul, mind, and strength through passionate worship and obedience.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-cinzel text-white group-hover:text-blue-300 transition">
              LOVE PEOPLE
            </h3>
            <p className="text-xs font-semibold text-blue-400/90 mt-0.5">Unconditionally</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Embracing every individual with Christ-like compassion, authentic fellowship, forgiveness, and unconditional grace.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-cinzel text-white group-hover:text-amber-300 transition">
              IMPACT THE WORLD
            </h3>
            <p className="text-xs font-semibold text-amber-400/90 mt-0.5">For His Glory</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Taking the gospel of Jesus Christ into every community, city, and nation with supernatural demonstration of power.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-cinzel text-white group-hover:text-emerald-300 transition">
              WALK BY FAITH
            </h3>
            <p className="text-xs font-semibold text-emerald-400/90 mt-0.5">Not by sight</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Standing immovable upon the promises of God's inerrant Word, expecting miracles, breakthroughs, and divine provision.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2D. OUR LEADERSHIP TEAM (OUR TEAM)
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/25 p-8 md:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
              <Users className="w-3.5 h-3.5" /> Pastoral & Ministry Leadership
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">OUR TEAM</h2>
            <p className="text-xs text-slate-300">
              Dedicated servants of God available for spiritual counseling, prayer, and ministry guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Team Member 1: Ashish */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-cinzel font-bold text-xl text-amber-300">
                  AS
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-white">ASHISH</h3>
                  <p className="text-xs text-amber-400 font-medium">Ministry Coordinator & Pastoral Team</p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <a
                    href="tel:+917066463676"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 7066463676</span>
                  </a>
                  <a
                    href="https://wa.me/917066463676"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2: Aniket */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-cinzel font-bold text-xl text-blue-300">
                  AN
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-white">ANIKET</h3>
                  <p className="text-xs text-blue-400 font-medium">Outreach & Fellowship Leader</p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <a
                    href="tel:+917841817431"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 78418 17431</span>
                  </a>
                  <a
                    href="https://wa.me/917841817431"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. WELCOME MESSAGE FROM SENIOR PASTOR
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12">
          {/* Pastor Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30">
              <img
                src={settings?.pastorPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'}
                alt="Senior Pastor"
                className="w-full h-96 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="font-cinzel text-lg font-bold text-white block">
                  {settings?.pastorName || 'Pastor David Emmanuel & Grace'}
                </span>
                <span className="text-xs text-amber-300">Senior Lead Pastors, Fire Grace Fellowship</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
              <Heart className="w-3.5 h-3.5" /> Welcome to Our Church Home
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cinzel text-white leading-tight">
              {settings?.welcomeTitle || 'You Are Lovingly Welcomed at Fire Grace Fellowship'}
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed font-light">
              <p>
                {settings?.welcomeMessage ||
                  'No matter where you are on your spiritual journey, you belong here. At Fire Grace Fellowship, we believe in the untamed power of the Holy Spirit to heal, restore, and set captives free, coupled with the tender, unshakeable grace of Jesus Christ that welcomes you home.'}
              </p>
              <p>
                Whether you join us in person at our cathedral sanctuary or participate through our online broadcasts and digital fellowship, we pray that you will experience God's tangible presence and discover your divine purpose.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
              >
                Learn Our Vision & Beliefs
              </button>
              <button
                onClick={() => onNavigate('meetings')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                Join Fellowship Gatherings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. LATEST SERMONS SECTION
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Spiritual Nourishment</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">Latest Sermons & Teachings</h2>
          </div>
          <button
            onClick={() => onNavigate('sermons')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            View All Sermons <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sermons.map(sermon => (
            <div
              key={sermon.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <button
                  onClick={() => setActiveSermonVideo(sermon)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-black/70 text-amber-300 px-2 py-0.5 rounded">
                  {sermon.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{sermon.speaker}</span>
                    <span>{new Date(sermon.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-serif italic mt-1">{sermon.bibleReference}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 font-light">{sermon.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveSermonVideo(sermon)}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Watch Now
                  </button>
                  <span className="text-[11px] text-slate-500">Audio Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. UPCOMING EVENTS SECTION
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Church Calendar</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">Upcoming Events & Revivals</h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition"
            >
              <div className="relative aspect-video">
                <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 text-xs font-bold">
                  {event.onlineOrOffline}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue} — {event.address}</span>
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Speaker: <strong className="text-slate-200">{event.speaker}</strong></span>
                  <button
                    onClick={() => onNavigate('events')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    Register / Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. WEEKLY ACTIVITIES & MINISTRIES TIMELINE
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/20 p-8 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Weekly Gatherings</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">Church Programs & Activities</h2>
            <p className="text-xs text-slate-400">Join our vibrant fellowships throughout the week designed for every stage of life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.map(act => (
              <div key={act.id} className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2.5 hover:border-amber-500/30 transition">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {act.day} • {act.time}
                </span>
                <h4 className="text-base font-bold text-white">{act.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Leader: {act.leader.split(' ')[0]}</span>
                  <span className="text-slate-500">{act.venue}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('activities')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Explore All Ministries & Activities
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7. PRAYER REQUEST TEASER
      ------------------------------------------------------------------ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-amber-600/20 via-slate-900 to-slate-950 border border-amber-500/30 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
            <Heart className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">Can We Pray For You Today?</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our consecrated prayer team and pastors intercede over every submitted request daily. There is no circumstance too difficult for our God.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('prayer')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              Submit Prayer Request
            </button>
            <a
              href="https://wa.me/15557774722"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Prayer Chaplain</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          8. PHOTO GALLERY PREVIEW
      ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Life at Fire & Grace</span>
            <h2 className="text-2xl font-bold font-cinzel text-white mt-0.5">Photo Gallery</h2>
          </div>
          <button
            onClick={() => onNavigate('photos')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            All Photos <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-800"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          SERMON VIDEO PLAYER MODAL
      ------------------------------------------------------------------ */}
      {activeSermonVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{activeSermonVideo.title}</h4>
                <p className="text-xs text-amber-400">{activeSermonVideo.speaker} • {activeSermonVideo.bibleReference}</p>
              </div>
              <button
                onClick={() => setActiveSermonVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              {activeSermonVideo.youtubeUrl ? (
                <iframe
                  src={activeSermonVideo.youtubeUrl}
                  title={activeSermonVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Play className="w-12 h-12 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-white">Full Video Recorded Live</p>
                  <p className="text-xs mt-1">This sermon recording is archived in our Media Vault.</p>
                </div>
              )}
            </div>
            <div className="p-4 text-xs text-slate-300 space-y-2">
              <p>{activeSermonVideo.description}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveSermonVideo(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          PHOTO LIGHTBOX MODAL
      ------------------------------------------------------------------ */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" />
            <div className="mt-3 text-center text-white">
              <h4 className="font-bold text-sm">{selectedPhoto.title}</h4>
              {selectedPhoto.description && <p className="text-xs text-slate-400 mt-0.5">{selectedPhoto.description}</p>}
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
