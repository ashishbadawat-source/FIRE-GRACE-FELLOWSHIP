/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle, Flame } from 'lucide-react';
import { api } from '../services/api';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const res = await api.sendContactMessage({ name, email, mobile, message });
      setSuccessMessage(res.message);
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Phone className="w-3.5 h-3.5" /> Connect With Us
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">CONTACT & SANCTUARY LOCATION</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Have a question about church activities, dedications, counseling, or attending our next service? Our ministry pastoral team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information & Map (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <h3 className="font-cinzel text-xl font-bold text-white">Church Headquarters</h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Main Cathedral Sanctuary</span>
                  <span>777 Fire Grace Cathedral Way, Los Angeles, CA 90001, USA</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Church Office & Prayer Line</span>
                  <a href="tel:+15557774722" className="text-amber-400 hover:underline">+1 (555) 777-GRACE (4722)</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Direct Pastoral Lines</span>
                  <div className="space-y-1 mt-0.5 text-[11px]">
                    <div>
                      <span className="text-slate-400">Ashish: </span>
                      <a href="tel:+917066463676" className="text-amber-400 hover:underline">+91 7066463676</a>
                    </div>
                    <div>
                      <span className="text-slate-400">Aniket: </span>
                      <a href="tel:+917841817431" className="text-amber-400 hover:underline">+91 78418 17431</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Email Inquiries</span>
                  <a href="mailto:info@firegrace.org" className="text-amber-400 hover:underline">info@firegrace.org</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Office Pastoral Hours</span>
                  <span>Monday – Friday: 9:00 AM – 5:00 PM PST</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href="https://wa.me/15557774722"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via Official WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl h-64 bg-slate-950">
            <iframe
              title="Church Sanctuary Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105828.98982348507!2d-118.34301385412497!3d34.02073049187315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Message Submission Form (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Send a Message</span>
            <h2 className="text-2xl font-bold font-cinzel text-white mt-1">Get in Touch With Administration</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please complete the form below and a pastoral staff member will respond promptly.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message or Inquiry *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How may we serve, guide, or pray with you?"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Church Office'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
