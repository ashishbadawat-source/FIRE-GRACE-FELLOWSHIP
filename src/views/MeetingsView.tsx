/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Video, Users, Calendar, Clock, Lock, Copy, Check, ExternalLink, Flame, Shield } from 'lucide-react';
import { api } from '../services/api';
import type { ZoomMeeting, GoogleMeet } from '../types';

export const MeetingsView: React.FC = () => {
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
  const [googleMeets, setGoogleMeets] = useState<GoogleMeet[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'zoom' | 'meet'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.getZoomMeetings().then(res => setZoomMeetings(res.meetings)).catch(() => {});
    api.getGoogleMeetings().then(res => setGoogleMeets(res.meetings)).catch(() => {});
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="meetings-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Users className="w-3.5 h-3.5" /> Virtual Church Rooms
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">ZOOM & GOOGLE MEET GATHERINGS</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Stay interconnected throughout the week. Join our live virtual prayer meetings, Bible classes, and discipleship circles from anywhere in the world.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          All Online Rooms ({zoomMeetings.length + googleMeets.length})
        </button>
        <button
          onClick={() => setActiveTab('zoom')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'zoom'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Zoom Meetings ({zoomMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('meet')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'meet'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Google Meet ({googleMeets.length})
        </button>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zoom Meetings */}
        {(activeTab === 'all' || activeTab === 'zoom') &&
          zoomMeetings.map(zm => (
            <div
              key={zm.id}
              className="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4 hover:border-blue-400 transition shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Video className="w-3 h-3" /> ZOOM CONFERENCE
                </span>
                <span className="text-xs text-amber-400 font-semibold">{zm.date}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-white">{zm.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{zm.description}</p>
              </div>

              {/* Time & Meeting IDs */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Time:
                  </span>
                  <span className="font-semibold">{zm.startTime} – {zm.endTime}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Meeting ID:</span>
                  <div className="flex items-center gap-1.5 font-mono text-white">
                    <span>{zm.meetingId}</span>
                    <button
                      onClick={() => handleCopy(zm.meetingId, `id_${zm.id}`)}
                      className="p-1 hover:text-amber-400"
                    >
                      {copiedId === `id_${zm.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Passcode:</span>
                  <div className="flex items-center gap-1.5 font-mono text-amber-300">
                    <span>{zm.password || 'None'}</span>
                    {zm.password && (
                      <button
                        onClick={() => handleCopy(zm.password || '', `pass_${zm.id}`)}
                        className="p-1 hover:text-amber-400"
                      >
                        {copiedId === `pass_${zm.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={zm.zoomLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch & Join Zoom Meeting</span>
              </a>
            </div>
          ))}

        {/* Google Meet Sessions */}
        {(activeTab === 'all' || activeTab === 'meet') &&
          googleMeets.map(gm => (
            <div
              key={gm.id}
              className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4 hover:border-emerald-400 transition shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Users className="w-3 h-3" /> GOOGLE MEET
                </span>
                <span className="text-xs text-amber-400 font-semibold">{gm.date}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-white">{gm.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{gm.description}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Scheduled Time:
                  </span>
                  <span className="font-semibold">{gm.time}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Platform:</span>
                  <span className="text-emerald-400 font-medium">Google Meet (Browser & Mobile App)</span>
                </div>
              </div>

              <a
                href={gm.meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Google Meet Room</span>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};
