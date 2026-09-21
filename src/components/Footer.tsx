/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  MapPin,
  Phone,
  Mail,
  Clock,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  ExternalLink,
  Shield,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  const handleNav = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-amber-500/20 pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-md shadow-amber-500/20 shrink-0">
                <img
                  src="/logo.png"
                  alt="Fire & Grace Fellowship"
                  className="w-full h-full object-cover rounded-full bg-slate-950"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold text-white tracking-wider block">
                  FIRE & GRACE <span className="text-amber-400">FELLOWSHIP</span>
                </span>
                <span className="text-[10px] text-amber-300 italic block font-sans">
                  Ignited by Fire, Covered by Grace
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-amber-400/50 pl-3">
              "Ignited by Fire, Covered by Grace, Sent to Make a Difference."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              A vibrant Christ-centered fellowship ignited by the fire of the Holy Spirit and rooted in the boundless grace of God. Igniting faith, transforming lives, and sending forth disciples.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/40 transition"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917066463676"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                title="WhatsApp Pastoral Line (Ashish)"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Service Times */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-cinzel text-amber-300 tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Weekly Worship Services
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="pb-2 border-b border-slate-800/80">
                <span className="font-semibold text-white block">Sunday Glorious Worship</span>
                <span className="text-slate-400">10:00 AM – 12:30 PM PST</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">In Sanctuary & Online Live</span>
              </li>
              <li className="pb-2 border-b border-slate-800/80">
                <span className="font-semibold text-white block">Wednesday Deep Word & Intercession</span>
                <span className="text-slate-400">7:00 PM – 8:30 PM PST</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">Zoom & Google Meet</span>
              </li>
              <li>
                <span className="font-semibold text-white block">Friday Holy Ghost Fire Revival</span>
                <span className="text-slate-400">7:30 PM – 9:30 PM PST</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">Miracle & Deliverance Night</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-cinzel text-amber-300 tracking-wider">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleNav('bible')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Holy Bible
              </button>
              <button onClick={() => handleNav('sermons')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Sermons
              </button>
              <button onClick={() => handleNav('events')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Events
              </button>
              <button onClick={() => handleNav('live')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Watch Live
              </button>
              <button onClick={() => handleNav('prayer')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Prayer Wall
              </button>
              <button onClick={() => handleNav('meetings')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Zoom Meetings
              </button>
              <button onClick={() => handleNav('photos')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Photo Gallery
              </button>
              <button onClick={() => handleNav('videos')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Video Ministry
              </button>
              <button onClick={() => handleNav('activities')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Ministries
              </button>
              <button onClick={() => handleNav('donate')} className="text-left text-amber-400 font-semibold hover:text-amber-300 py-1 flex items-center gap-1">
                <Heart className="w-3 h-3 fill-amber-400" /> Give / Tithes
              </button>
              <button onClick={() => handleNav('contact')} className="text-left text-slate-400 hover:text-amber-300 py-1">
                Contact Us
              </button>
            </div>

            {/* Portal Access Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleNav('donate')}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-center hover:bg-amber-500/30 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Give Online (GPay / PhonePe / Bank)
              </button>

              {user ? (
                <button
                  onClick={() => handleNav(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold text-center hover:bg-amber-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {user.role === 'admin' ? 'Open Admin Control Room' : 'My Member Dashboard'}
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold text-center hover:text-white hover:border-amber-500/40 transition"
                >
                  Member & Admin Portal Sign In
                </button>
              )}
            </div>
          </div>

          {/* Col 4: Church Location & Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-cinzel text-amber-300 tracking-wider">Sanctuary Address</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  777 Fire Grace Cathedral Way<br />
                  Los Angeles, CA 90001, United States
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+15557774722" className="hover:text-amber-300">+1 (555) 777-GRACE</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:pastor@firegrace.org" className="hover:text-amber-300">info@firegrace.org</a>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-amber-500/15 to-transparent rounded-xl border border-amber-500/20 text-xs text-amber-200">
              <p className="font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                Everyone is Welcome!
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Experience heartfelt praise, uncompromised biblical truth, and genuine community.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fire & Grace Fellowship. All rights reserved. Soli Deo Gloria.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('about')} className="hover:text-slate-300">Statement of Faith</button>
            <span>•</span>
            <button onClick={() => handleNav('prayer')} className="hover:text-slate-300">Confidential Prayer Line</button>
            <span>•</span>
            <button onClick={() => openAuthModal('login')} className="text-amber-400/80 hover:text-amber-300">Staff Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
