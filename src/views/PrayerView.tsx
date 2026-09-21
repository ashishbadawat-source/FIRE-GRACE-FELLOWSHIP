/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Send, Lock, Globe, MessageSquare, CheckCircle, Flame, Shield, Users } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { PrayerRequest } from '../types';

export const PrayerView: React.FC = () => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Healing');
  const [request, setRequest] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [prayedCountMap, setPrayedCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    loadPrayers();
  }, [user]);

  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setEmail(user.email);
      setPhone(user.mobile);
    }
  }, [user]);

  const loadPrayers = async () => {
    try {
      const res = await api.getPrayers();
      setPrayers(res.prayers);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !request.trim()) return;
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const res = await api.submitPrayer({
        name,
        email,
        phone,
        category,
        request,
        isPrivate,
      });
      setSuccessMessage(res.message);
      setRequest('');
      loadPrayers();
    } catch (err: any) {
      alert(err.message || 'Unable to submit prayer request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrayedClick = (id: string) => {
    setPrayedCountMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div id="prayer-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Heart className="w-3.5 h-3.5" /> Divine Intercession
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">PRAYER REQUESTS & ALTAR</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          "For where two or three are gathered together in My name, I am there in the midst of them." — Matthew 18:20
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Submit Prayer Form (Col 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Carry Your Burden to the Lord</span>
            <h2 className="text-xl font-bold font-cinzel text-white mt-1">Submit a Prayer Petition</h2>
            <p className="text-xs text-slate-400 mt-1">
              Every request is lifted before God by our pastors and consecrated prayer team.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name or initials"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prayer Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Healing">Healing & Health</option>
                <option value="Family">Family & Marriage</option>
                <option value="Financial Breakthrough">Financial Breakthrough</option>
                <option value="Deliverance">Deliverance & Protection</option>
                <option value="Salvation of Loved Ones">Salvation of Loved Ones</option>
                <option value="Spiritual Growth">Spiritual Growth & Fire</option>
                <option value="Thanksgiving">Thanksgiving & Praise Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prayer Details *</label>
              <textarea
                required
                rows={4}
                value={request}
                onChange={e => setRequest(e.target.value)}
                placeholder="Share the situation you want us to stand in agreement with you for..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              ></textarea>
            </div>

            {/* Privacy Checkbox */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Keep this request strictly confidential (Pastors only)
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6">
                If unchecked, your prayer will also appear on the Fellowship Prayer Wall so believers can pray with you.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Petition...' : 'Send Prayer Request'}</span>
            </button>
          </form>
        </div>

        {/* Community Prayer Wall (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">Fellowship Prayer Wall</h2>
              <p className="text-xs text-slate-400">Stand in agreement with your brothers and sisters</p>
            </div>
            <a
              href="https://wa.me/15557774722"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/25 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Emergency Hotline
            </a>
          </div>

          <div className="space-y-4">
            {prayers.filter(p => !p.isPrivate).map(prayer => (
              <div
                key={prayer.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-amber-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel font-bold text-white text-sm">{prayer.name}</span>
                    <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {prayer.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">{prayer.request}</p>

                {/* Pastor Reply if present */}
                {prayer.adminReply && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-bold text-amber-300 block flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Pastoral Intercession Word:
                    </span>
                    <p className="text-slate-300 font-serif italic">{prayer.adminReply}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{prayer.status === 'prayed' ? 'Actively Prayed Over' : 'In Intercession'}</span>
                  </div>

                  <button
                    onClick={() => handlePrayedClick(prayer.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>I Prayed ({(prayedCountMap[prayer.id] || 0) + 12})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
