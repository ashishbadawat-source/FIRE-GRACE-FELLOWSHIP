/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Heart, Shield, Award, Users, BookOpen, CheckCircle, ArrowRight, Phone, MessageCircle, Globe } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div id="about-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Flame className="w-3.5 h-3.5" /> Our Heritage & Calling
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-white tracking-tight">
          ABOUT FIRE & GRACE FELLOWSHIP
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Ignited by the consuming fire of God's presence, transformed by the inexhaustible riches of His grace, and commissioned to disciple the nations.
        </p>
      </div>

      {/* Senior Pastoral Leadership */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
              alt="Pastors David & Grace Emmanuel"
              className="w-full h-[420px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="font-cinzel text-lg font-bold text-white">Pastor David & Grace Emmanuel</h3>
              <p className="text-xs text-amber-300">Founders & Senior Lead Pastors</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Apostolic & Pastoral Vision</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white leading-tight">
            Building a Generation of Uncompromising Believers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Founded under a clear divine mandate, Fire & Grace Fellowship began as a consecrated prayer gathering of believers hungry for the authentic power of the Holy Spirit. Over the years, God has expanded this altar into an international fellowship impacting thousands of lives worldwide.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Pastor David Emmanuel carries an apostolic teaching and revival mantle, emphasizing the pure gospel of grace, righteousness in Christ, supernatural signs and wonders, and radical holiness. Together with Pastor Grace Emmanuel, they are passionate about mentoring spiritual fathers and mothers, raising vibrant youth, and healing broken families.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
              <span className="font-bold text-amber-400 block font-cinzel text-base">20+ Years</span>
              <span className="text-slate-400">Pastoral Ministry</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
              <span className="font-bold text-amber-400 block font-cinzel text-base">Christ Alone</span>
              <span className="text-slate-400">Foundational Anchor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/30 transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-cinzel text-white">Our Vision</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            To see every believer fully ignited by the Holy Ghost, living victorious over sin and sickness, and radiating the glory of Jesus Christ in every sphere of society.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/30 transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-cinzel text-white">Our Mission</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            To proclaim the unadulterated message of Jesus Christ, demonstrate the kingdom through miracles, train passionate disciples, and extend compassionate aid to the poor and vulnerable.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/30 transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-cinzel text-white">Our Pillars</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Rooted in Word & Spirit, fervent prayer, heartfelt fellowship, relentless outreach, and a lifestyle of generosity and integrity in all things.
          </p>
        </div>
      </div>

      {/* Statement of Faith */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/20 p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Biblical Foundations</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">What We Believe</h2>
          <p className="text-xs text-slate-400">We hold unswervingly to the historical orthodox Christian faith revealed in the Holy Scriptures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          {[
            {
              title: 'The Infallible Scriptures',
              desc: 'We believe the Bible (66 canonical books) is the inspired, inerrant, and authoritative Word of God, the supreme rule of faith and conduct.',
            },
            {
              title: 'The Triune God',
              desc: 'We believe in one God, eternally existent in three co-equal persons: Father, Son, and Holy Spirit.',
            },
            {
              title: 'The Lord Jesus Christ',
              desc: 'We believe in His virgin birth, sinless life, substitutionary atoning death on the cross, bodily resurrection, and imminent glorious return.',
            },
            {
              title: 'Salvation by Grace through Faith',
              desc: 'We are justified freely by God’s grace through faith in the shed blood of Christ, not by human deeds or rituals.',
            },
            {
              title: 'The Holy Spirit & Power',
              desc: 'We believe in the baptism of the Holy Spirit with spiritual gifts, empowering believers for supernatural ministry and holy living.',
            },
            {
              title: 'Divine Healing & Deliverance',
              desc: 'Deliverance and divine physical and emotional healing are provided in the Atonement of Jesus Christ for every believer today.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-cinzel text-sm">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Four Core Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Vision In Action</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">The Four Core Pillars</h2>
          <p className="text-xs text-slate-400">"He will baptize you with the Holy Spirit and fire." — Luke 3:16</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-cinzel font-bold text-white text-base">LOVE GOD</h4>
            <p className="text-xs font-semibold text-amber-400">Wholeheartedly</p>
            <p className="text-xs text-slate-400 leading-relaxed">Exalting the Lord in prayer, worship, holiness, and steadfast obedience.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-cinzel font-bold text-white text-base">LOVE PEOPLE</h4>
            <p className="text-xs font-semibold text-blue-400">Unconditionally</p>
            <p className="text-xs text-slate-400 leading-relaxed">Serving every soul with genuine compassion, restoration, and brotherly affection.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-cinzel font-bold text-white text-base">IMPACT THE WORLD</h4>
            <p className="text-xs font-semibold text-amber-400">For His Glory</p>
            <p className="text-xs text-slate-400 leading-relaxed">Transforming society with the supernatural gospel and kingdom influence.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-cinzel font-bold text-white text-base">WALK BY FAITH</h4>
            <p className="text-xs font-semibold text-emerald-400">Not by sight</p>
            <p className="text-xs text-slate-400 leading-relaxed">Trusting God's promises completely for breakthroughs, signs, and wonders.</p>
          </div>
        </div>
      </div>

      {/* Leadership & Ministry Team (Ashish & Aniket) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
            <Users className="w-3.5 h-3.5" /> Ministry Leadership
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">OUR TEAM</h2>
          <p className="text-xs text-slate-400">
            Pastoral coordinators and outreach leaders serving the congregation and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Ashish */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-cinzel font-bold text-lg shadow-md shrink-0">
              AS
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-cinzel font-bold text-white text-base">ASHISH</h4>
              <p className="text-xs text-amber-400">Pastoral Coordinator & Administration</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <a
                  href="tel:+917066463676"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 7066463676</span>
                </a>
                <a
                  href="https://wa.me/917066463676"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Aniket */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-cinzel font-bold text-lg shadow-md shrink-0">
              AN
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-cinzel font-bold text-white text-base">ANIKET</h4>
              <p className="text-xs text-blue-400">Outreach & Fellowship Lead</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <a
                  href="tel:+917841817431"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 78418 17431</span>
                </a>
                <a
                  href="https://wa.me/917841817431"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Fellowship CTA */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="text-xl font-bold font-cinzel text-white">Join Our Family This Sunday</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We would love to greet you in person or connect with you online. Experience the warmth of true Christian fellowship.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Visit Our Church Location
          </button>
          <button
            onClick={() => onNavigate('live')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
          >
            Watch Broadcast Live
          </button>
        </div>
      </div>
    </div>
  );
};
