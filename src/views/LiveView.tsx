/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Radio, Calendar, Clock, Heart, MessageSquare, ExternalLink, Flame, Users, Volume2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { LiveStreamConfig } from '../types';

export const LiveView: React.FC = () => {
  const [liveConfig, setLiveConfig] = useState<LiveStreamConfig | null>(null);
  const [notes, setNotes] = useState<string>(() => localStorage.getItem('fgf_sermon_notes') || '');
  const [savedNotesMessage, setSavedNotesMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    loadLiveConfig();
    const interval = setInterval(loadLiveConfig, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveConfig = async () => {
    try {
      const res = await api.getLiveConfig();
      setLiveConfig(res.liveConfig);
    } catch {
      // ignore
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (!liveConfig?.countdownTarget) return;
    const target = new Date(liveConfig.countdownTarget).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [liveConfig]);

  const handleSaveNotes = () => {
    localStorage.setItem('fgf_sermon_notes', notes);
    setSavedNotesMessage(true);
    setTimeout(() => setSavedNotesMessage(false), 2500);
  };

  const isLive = liveConfig?.isLive || false;

  return (
    <div id="live-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Live Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isLive
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}
          >
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isLive ? 'LIVE BROADCASTING NOW' : 'OFFLINE • NEXT BROADCAST SCHEDULED'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-cinzel text-white mt-1">
              {isLive ? liveConfig?.title : 'Fire Grace Fellowship Sanctuary Broadcast'}
            </h1>
          </div>
        </div>

        {/* Streaming links */}
        <div className="flex items-center gap-2">
          {liveConfig?.youtubeLiveUrl && (
            <a
              href={liveConfig.youtubeLiveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-red-600/20"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
            </a>
          )}
          {liveConfig?.facebookLiveUrl && (
            <a
              href={liveConfig.facebookLiveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Watch on Facebook
            </a>
          )}
        </div>
      </div>

      {/* Main Broadcast Screen or Countdown Screen */}
      {isLive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Video Stream Player (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl relative">
              <iframe
                src={liveConfig?.youtubeLiveUrl || 'https://www.youtube.com/embed/live_stream?channel=UCexample'}
                title="Church Live Broadcast"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Preaching Live</span>
                <span className="text-xs text-slate-400">Audio: High Definition Stereo</span>
              </div>
              <h2 className="text-xl font-bold font-cinzel text-white">{liveConfig?.title}</h2>
              <p className="text-xs text-slate-300">
                You are participating in live sanctuary worship with Fire & Grace Fellowship. Open your heart to receive the touch of God.
              </p>
            </div>
          </div>

          {/* Interactive Sermon Notes Box (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white font-cinzel flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Live Sermon Notes
                </h3>
                {savedNotesMessage && (
                  <span className="text-[11px] text-emerald-400 font-medium">Saved!</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Take notes during the sermon. Your notes are automatically preserved locally on this device.
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={14}
                placeholder="Key scriptures, revelations, personal rhema words..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
              ></textarea>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSaveNotes}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow"
              >
                Save Sermon Notes
              </button>
              <a
                href="https://wa.me/15557774722"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Connect with Live Prayer Chaplain
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Broadcast Offline Countdown */
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/20 p-10 md:p-16 text-center space-y-8">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Next Scheduled Stream</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-white">
              {liveConfig?.nextScheduleTitle || liveConfig?.nextSchedule || 'Sunday Glorious Worship Service'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              We stream all our major services live from our main sanctuary with multi-camera high definition.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase">Days</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase">Hours</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase">Minutes</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase">Seconds</span>
            </div>
          </div>

          {/* Weekly Schedule Reference */}
          <div className="max-w-2xl mx-auto pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-1">
              <span className="font-bold text-amber-300 block">Sunday Main Worship Service</span>
              <span className="text-slate-400 block">Every Sunday @ 10:00 AM PST</span>
              <span className="text-[11px] text-slate-500">Praise, Worship & Ministry of the Word</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-1">
              <span className="font-bold text-amber-300 block">Friday Miracle & Fire Night</span>
              <span className="text-slate-400 block">Every Friday @ 7:30 PM PST</span>
              <span className="text-[11px] text-slate-500">Holy Spirit Deliverance & Revival</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
