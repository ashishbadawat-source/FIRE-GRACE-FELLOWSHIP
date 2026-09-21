/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Users, Flame, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import type { ChurchActivity } from '../types';

export const ActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<ChurchActivity[]>([]);
  const [joinedActivityId, setJoinedActivityId] = useState<string | null>(null);

  useEffect(() => {
    api.getActivities().then(res => setActivities(res.activities)).catch(() => {});
  }, []);

  const handleJoin = (id: string) => {
    setJoinedActivityId(id);
    setTimeout(() => setJoinedActivityId(null), 3000);
  };

  return (
    <div id="activities-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Flame className="w-3.5 h-3.5" /> Active Fellowship
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">CHURCH PROGRAMS & MINISTRIES</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Find your spiritual family and area of calling. We have vibrant ministries that nurture, build, and deploy believers of all ages.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(act => (
          <div
            key={act.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition p-6 flex flex-col justify-between space-y-5 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {act.day}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {act.time}
                </span>
              </div>

              <h3 className="text-xl font-bold font-cinzel text-white">{act.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{act.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  {act.leader}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {act.venue}
                </span>
              </div>

              <button
                onClick={() => handleJoin(act.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                  joinedActivityId === act.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white'
                }`}
              >
                {joinedActivityId === act.id ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Interest Registered! Leader Notified</span>
                  </>
                ) : (
                  <span>Connect with This Ministry</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
