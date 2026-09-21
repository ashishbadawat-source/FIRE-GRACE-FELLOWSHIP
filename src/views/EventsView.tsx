/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, Ticket, Share2, Sparkles, X, Flame } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ChurchEvent, EventRegistration } from '../types';

export const EventsView: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<EventRegistration | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    api.getEvents().then(res => setEvents(res.events)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.fullName);
      setAttendeeEmail(user.email);
      setAttendeePhone(user.mobile);
    }
  }, [user]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);
    try {
      const res = await api.registerForEvent(selectedEvent.id, {
        name: attendeeName,
        email: attendeeEmail,
        phone: attendeePhone,
      });
      setConfirmedRegistration(res.registration);
      setSuccessMessage(res.message);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="events-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Calendar className="w-3.5 h-3.5" /> Divine Encounters
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">UPCOMING CHURCH EVENTS</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Mark your calendar for upcoming conferences, revivals, baptismal services, leadership summits, and community outreaches.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div
            key={event.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition overflow-hidden flex flex-col justify-between shadow-xl"
          >
            {/* Banner */}
            <div className="relative aspect-video">
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold">
                {event.onlineOrOffline}
              </div>
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                {event.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>

                <h3 className="text-xl font-bold font-cinzel text-white leading-snug">{event.title}</h3>

                <div className="text-xs text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Ministering: <strong className="text-slate-200">{event.speaker}</strong></span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{event.venue} — {event.address}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {event.registrationRequired ? 'Free Registration Required' : 'Open Admission'}
                </span>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setConfirmedRegistration(null);
                    setSuccessMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
                >
                  Register / Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl p-6 sm:p-8 relative my-6">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!confirmedRegistration ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Event Pass</span>
                  <h3 className="text-xl font-bold font-cinzel text-white">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedEvent.date} @ {selectedEvent.time} • {selectedEvent.venue}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Attendee Full Name *</label>
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={e => setAttendeeName(e.target.value)}
                    placeholder="e.g. Samuel Grace"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={e => setAttendeeEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={attendeePhone}
                    onChange={e => setAttendeePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-400">
                  <p>Admission is 100% complimentary. Your pass will be recorded and accessible in your member dashboard.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                >
                  {isSubmitting ? 'Confirming Ticket...' : 'Confirm My Registration'}
                </button>
              </form>
            ) : (
              /* Success Pass Display */
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-cinzel text-white">Registration Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">{successMessage}</p>

                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-left space-y-2 max-w-sm mx-auto">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Confirmation ID:</span>
                    <span className="font-mono text-amber-300 font-bold">{confirmedRegistration.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Attendee:</span>
                    <span className="text-white font-semibold">{confirmedRegistration.userName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Event:</span>
                    <span className="text-amber-400 font-medium truncate max-w-[180px]">{selectedEvent.title}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
