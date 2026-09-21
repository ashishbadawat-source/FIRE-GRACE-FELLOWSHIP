/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Share2,
  Copy,
  Check,
  Calendar,
  Heart,
  Bookmark,
  Award,
  Users,
  ExternalLink,
  Edit2,
  QrCode,
  Shield,
  Sparkles,
  Ticket,
  CreditCard,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { EventRegistration, PrayerRequest, BibleBookmark, DonationRecord } from '../types';

interface UserDashboardProps {
  onNavigate: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'events' | 'prayers' | 'giving' | 'profile'>('overview');
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [myDonations, setMyDonations] = useState<DonationRecord[]>([]);

  // Profile Edit form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setMobile(user.mobile);
      setProfilePhoto(user.profilePhoto || '');
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const [regRes, prayRes, bookRes, refRes, donRes] = await Promise.all([
        api.getMyRegistrations(),
        api.getMyPrayers(),
        api.getBibleBookmarks(),
        api.getReferralStats(),
        api.getMyDonations(),
      ]);
      const mappedRegs: EventRegistration[] = (regRes.registrations || []).map((r: any) => ({
        ...r.registration,
        eventTitle: r.event?.title || r.registration?.eventTitle || 'Fire Grace Gathering',
      }));
      setRegistrations(mappedRegs);
      setPrayers(prayRes.prayers || []);
      setBookmarks(bookRes.bookmarks || []);
      setReferralStats(refRes);
      setMyDonations(donRes.donations || []);
    } catch {
      // ignore
    }
  };

  const handleCopy = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg('');
    try {
      const res = await api.updateProfile({ fullName, mobile, profilePhoto });
      await refreshUser();
      setUpdateMsg(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-white text-base">Please sign in to access your member portal.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const referralUrl = `${window.location.origin}?ref=${user.referralCode}`;

  return (
    <div id="user-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Digital Member Badge */}
      <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Member Avatar & Basic Info (Col 7) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
              alt={user.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] uppercase shadow">
              {user.role}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold font-cinzel text-white">{user.fullName}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Member #{user.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email} • {user.mobile || 'No phone set'}</p>
            <p className="text-xs text-amber-400/90 font-medium">
              Member of Fire & Grace Fellowship since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Shield className="w-3.5 h-3.5" /> Switch to Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Digital Membership Pass Card (Col 5) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-amber-500/40 relative space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                FGF
              </div>
              <span className="text-xs font-cinzel font-bold text-white tracking-wider">FIRE & GRACE PASS</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ACTIVE COVENANT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Referral Code</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{user.referralCode}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Kingdom Points</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {user.referralPoints || (referralStats?.totalReferrals ? referralStats.totalReferrals * 100 : 0)} pts
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Scan for sanctuary check-in:</span>
            <div className="p-1 rounded bg-white text-slate-950">
              <QrCode className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Member Overview', icon: Sparkles },
          { id: 'giving', label: `My Giving (${myDonations.length})`, icon: CreditCard },
          { id: 'referrals', label: `Referral Rewards (${referralStats?.totalReferred || 0})`, icon: Users },
          { id: 'events', label: `My Events & Passes (${registrations.length})`, icon: Ticket },
          { id: 'prayers', label: `Prayer Petitions (${prayers.length})`, icon: Heart },
          { id: 'profile', label: 'Account Settings', icon: User },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- OVERVIEW TAB ---------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Registered Events</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{registrations.length}</span>
                <Ticket className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Prayers</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{prayers.length}</span>
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Saved Bookmarks</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{bookmarks.length}</span>
                <Bookmark className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Souls Invited</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">
                  {referralStats?.totalReferrals || user.referredUsers?.length || 0}
                </span>
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Quick Shortcuts & Referral Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Referral Quick Box (Col 7) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-white">Invite Others to Fire & Grace</h3>
                  <p className="text-xs text-slate-400">
                    Earn 50 Kingdom Points for every believer who joins through your personal referral.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Share2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-amber-300 truncate">{referralUrl}</span>
                <button
                  onClick={() => handleCopy(referralUrl, 'link')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join me at Fire & Grace Fellowship! Register using my church invite link: ${referralUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  Share to WhatsApp
                </a>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  View Referral Network
                </button>
              </div>
            </div>

            {/* Bookmarks Quick Access (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-cinzel text-white">Saved Scriptures</h3>
                <button
                  onClick={() => onNavigate('bible')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Open Bible Reader
                </button>
              </div>

              {bookmarks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">No bookmarks saved yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {bookmarks.slice(0, 3).map(bm => (
                    <div key={bm.id} className="p-3 bg-slate-950 rounded-xl border border-white/5 text-xs">
                      <span className="font-bold text-amber-400">{bm.book} {bm.chapter}:{bm.verse}</span>
                      <p className="text-slate-300 font-serif italic line-clamp-2 mt-1">"{bm.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REFERRALS TAB ---------------- */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Kingdom Growth Network</span>
              <h2 className="text-2xl font-bold font-cinzel text-white mt-1">Church Referral & Soul Winning</h2>
              <p className="text-xs text-slate-400 mt-1">
                "Go into all the world and preach the gospel to every creature." — Mark 16:15
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Total Souls Invited</span>
                <span className="text-3xl font-bold font-mono text-white block">
                  {referralStats?.totalReferred || 0}
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Your Referral Code</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold font-mono text-amber-400">{user.referralCode}</span>
                  <button
                    onClick={() => handleCopy(user.referralCode, 'code')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Kingdom Reward Points</span>
                <span className="text-3xl font-bold font-mono text-emerald-400 block">
                  {referralStats?.points || 0} pts
                </span>
              </div>
            </div>

            {/* Copy Links Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Your Direct Share Link:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 select-all"
                />
                <button
                  onClick={() => handleCopy(referralUrl, 'link')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* List of Referred Members */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="font-cinzel text-lg font-bold text-white">Referred Members Directory</h3>
              {!referralStats?.members || referralStats.members.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs">You haven't referred any members yet.</p>
                  <p className="text-[11px] text-slate-500">Share your link via WhatsApp or email to welcome your family and friends!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {referralStats.members.map((m: any) => (
                    <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{m.fullName}</span>
                        <span className="text-slate-400">{m.email}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-semibold block">+50 Points</span>
                        <span className="text-slate-500 text-[10px]">
                          Joined {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- EVENTS TAB ---------------- */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-cinzel text-white">Your Event Admissions & Passes</h2>
            <button
              onClick={() => onNavigate('events')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Browse All Events
            </button>
          </div>

          {registrations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No active event registrations.</p>
              <p className="text-xs text-slate-500">Register for upcoming conferences and revival meetings to receive your passes here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map(reg => (
                <div
                  key={reg.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4 shadow-xl relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      OFFICIAL ADMISSION PASS
                    </span>
                    <span className="font-mono text-xs text-slate-400">ID: {reg.id.slice(0, 8)}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-cinzel text-white">{reg.eventTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Attendee: {reg.userName} ({reg.userEmail})</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirmed Free Entry
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- PRAYERS TAB ---------------- */}
      {activeTab === 'prayers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-cinzel text-white">Your Personal Prayer Petitions</h2>
            <button
              onClick={() => onNavigate('prayer')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Submit New Prayer
            </button>
          </div>

          {prayers.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-2">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No prayer requests recorded.</p>
              <p className="text-xs text-slate-500">Submit your needs or thanksgiving reports anytime to our prayer altar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prayers.map(p => (
                <div
                  key={p.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{p.category}</span>
                      {p.isPrivate && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Confidential</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">{p.request}</p>

                  {p.adminReply && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-amber-300 block">Pastoral Response:</span>
                      <p className="text-slate-300 font-serif italic">{p.adminReply}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Intercession Status:</span>
                    <span className="text-emerald-400 font-semibold capitalize">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- GIVING & TITHES TAB ---------------- */}
      {activeTab === 'giving' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  My Giving & Covenant Stewardship
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track your tithes, Sunday offerings, building seeds, and payment receipts
                </p>
              </div>

              <button
                onClick={() => onNavigate('donate')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition shrink-0"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Sow a Seed Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Total Amount Sown</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  ${myDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">Across all payment channels</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Contributions</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {myDonations.length}
                </div>
                <span className="text-[11px] text-slate-400">Tithes, offerings & seeds</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Supported Channels</span>
                <div className="text-xs font-semibold text-white mt-1.5 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">Google Pay</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">PhonePe</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Bank</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Automatic instant verification</span>
              </div>
            </div>

            {/* Donations List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Giving Records & Electronic Receipts
              </h3>

              {myDonations.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-semibold">No giving records yet</p>
                    <p className="text-xs text-slate-400 italic max-w-md mx-auto">
                      "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." (2 Corinthians 9:7)
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('donate')}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400 transition inline-flex items-center gap-2"
                  >
                    <span>Give via Google Pay, PhonePe or Bank</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myDonations.map(don => (
                    <div
                      key={don.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {don.receiptNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                            {don.fundType}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            don.status === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : don.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {don.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-0.5">
                          <span>Channel: <strong className="text-slate-200 capitalize">{don.paymentMethod.replace('_', ' ')}</strong></span>
                          <span>Ref/UTR: <code className="text-amber-400 font-mono text-[11px]">{don.transactionReference}</code></span>
                          <span>Date: {new Date(don.date).toLocaleDateString()}</span>
                        </div>
                        {don.notes && (
                          <p className="text-[11px] text-slate-400 italic">Note: {don.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <div className="text-right">
                          <span className="text-lg font-bold font-mono text-white">
                            ${don.amount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono">{don.currency}</span>
                        </div>
                        <button
                          onClick={() => onNavigate('donate')}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Open Giving Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PROFILE TAB ---------------- */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-white">Profile & Account Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Keep your church contact details updated</p>
          </div>

          {updateMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              {updateMsg}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal / Preferred Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Avatar Image URL</label>
              <input
                type="url"
                value={profilePhoto}
                onChange={e => setProfilePhoto(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                readOnly
                disabled
                value={user.email}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Contact administration to change primary account email.</span>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
