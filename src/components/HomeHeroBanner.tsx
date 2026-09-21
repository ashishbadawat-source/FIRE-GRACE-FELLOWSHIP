/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  BookOpen,
  Heart,
  Users,
  Globe,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Cross,
  Radio,
} from 'lucide-react';

interface HomeHeroBannerProps {
  onNavigate: (view: string) => void;
  onOpenAuthModal?: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({ onNavigate, onOpenAuthModal }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      verse: '"He will baptize you with the Holy Spirit and fire."',
      ref: 'Luke 3:16',
      tagline: 'Ignited by Fire, Covered by Grace, Sent to Make a Difference.',
    },
    {
      verse: '"Not by might nor by power, but by My Spirit, says the LORD of hosts."',
      ref: 'Zechariah 4:6',
      tagline: 'Transformed by His Presence, Walking in Supernatural Faith.',
    },
    {
      verse: '"The Spirit of the Lord GOD is upon Me, to preach good tidings unto the meek."',
      ref: 'Isaiah 61:1',
      tagline: 'Carrying Revival Fire to Every Home, City, and Nation.',
    },
  ];

  const currentSlideData = slides[activeSlide];

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full overflow-hidden select-none bg-slate-950 font-sans shadow-2xl border-b border-amber-500/20">
      {/* =========================================================================
          SECTION 1: EPIC HERO BANNER (Fiery Cross, Dove, Mountain Worshipper, Logo)
      ========================================================================= */}
      <div className="relative min-h-[500px] md:min-h-[560px] lg:min-h-[620px] w-full flex flex-col justify-between overflow-hidden bg-gradient-to-r from-[#1c0802] via-[#09152b] to-[#04101e]">
        {/* Background Image Layer & Atmospheric Glows */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1920&auto=format&fit=crop&q=80')`,
          }}
        />

        {/* Fiery Cross Atmosphere (Left side) */}
        <div className="absolute -left-20 top-0 bottom-0 w-[350px] md:w-[480px] bg-gradient-to-r from-amber-600/40 via-red-600/20 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute top-1/4 left-10 md:left-24 -translate-y-1/2 w-48 h-72 md:w-64 md:h-96 pointer-events-none hidden sm:flex items-center justify-center">
          {/* Stylized Glowing Fiery Cross Glow */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/30 blur-2xl animate-pulse" />
            <div className="relative w-12 md:w-16 h-48 md:h-72 bg-gradient-to-t from-red-600 via-amber-500 to-yellow-200 rounded-sm shadow-[0_0_50px_rgba(245,158,11,0.9)] opacity-90">
              <div className="absolute top-12 md:top-16 -left-14 md:-left-20 w-40 md:w-56 h-10 md:h-14 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-sm shadow-[0_0_40px_rgba(245,158,11,0.8)]" />
            </div>
            {/* Rising Sparks particles */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-300 font-bold text-xs flex items-center gap-1 animate-bounce">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" />
            </div>
          </div>
        </div>

        {/* Radiant Heavenly Light & Descending Dove (Right side) */}
        <div className="absolute -right-20 top-0 bottom-0 w-[350px] md:w-[500px] bg-gradient-to-l from-sky-400/25 via-amber-300/20 to-transparent pointer-events-none blur-3xl" />
        
        {/* Divine Sunburst Rays (Right) */}
        <div className="absolute top-0 right-10 md:right-28 w-64 md:w-96 h-64 md:h-96 pointer-events-none opacity-60">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100 via-sky-200/40 to-transparent blur-xl" />
        </div>

        {/* Script Top Right: "Jesus Changes Lives" */}
        <div className="absolute top-8 right-6 md:right-16 text-right z-10 pointer-events-none">
          <span className="font-playfair italic text-2xl sm:text-3xl md:text-4xl text-amber-200/95 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Jesus
          </span>
          <span className="block font-playfair italic text-lg sm:text-xl md:text-2xl text-white/90 -mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Changes Lives
          </span>
        </div>

        {/* Slider Navigation Arrows (Left & Right) */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center justify-center backdrop-blur-md transition shadow-lg hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center justify-center backdrop-blur-md transition shadow-lg hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Center Main Content & Grand Typography */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16 text-center my-auto flex flex-col items-center">
          {/* Fire & Dove Emblem */}
          <div className="relative mb-3 group cursor-pointer" onClick={() => onNavigate('about')}>
            <div className="absolute inset-0 bg-amber-500/40 rounded-full blur-xl group-hover:scale-125 transition" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
              <img
                src="/logo.png"
                alt="Fire & Grace Fellowship Emblem"
                className="w-full h-full object-cover rounded-full bg-slate-950"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Grand Header: FIRE & GRACE */}
          <div className="space-y-1">
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d6] via-[#f59e0b] to-[#b45309]">
                FIRE
              </span>{' '}
              <span className="text-amber-300 font-serif italic text-3xl sm:text-5xl md:text-6xl">&</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e0f2fe] via-[#60a5fa] to-[#1e3a8a]">
                GRACE
              </span>
            </h1>

            {/* FELLOWSHIP with flanking ornamental gold lines */}
            <div className="flex items-center justify-center gap-4 max-w-xl mx-auto pt-1">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
              <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.3em] font-bold text-amber-200 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                FELLOWSHIP
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-4 text-sm sm:text-base md:text-xl font-medium tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-sans">
            Ignited by <span className="text-red-400 font-bold italic">Fire</span>, Covered by{' '}
            <span className="text-sky-300 font-bold italic">Grace</span>, Sent to Make a Difference.
          </p>

          {/* Scripture Gold Ribbon Badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-900/90 via-amber-700/90 to-amber-900/90 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.4)] text-amber-100 max-w-2xl mx-auto backdrop-blur-md">
            <span className="text-lg">📖</span>
            <p className="font-lora italic text-xs sm:text-sm md:text-base font-semibold tracking-wide">
              {currentSlideData.verse} <span className="not-italic text-amber-300 font-cinzel font-bold">— {currentSlideData.ref}</span>
            </p>
          </div>
        </div>

        {/* Bottom subtle edge */}
        <div className="relative z-10 w-full h-3 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* =========================================================================
          SECTION 2: 5 GOLDEN MEDALLION PILLARS (WORSHIP, PRAYER, BIBLE, FELLOWSHIP, OUTREACH)
      ========================================================================= */}
      <div className="w-full bg-[#071326] border-y-2 border-amber-500/40 py-3.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {/* Pillar 1: WORSHIP */}
          <button
            onClick={() => onNavigate('songs')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/70 border border-transparent hover:border-amber-500/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-600/30 to-amber-950/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-xs md:text-sm font-bold text-white tracking-wider block group-hover:text-amber-300">
                WORSHIP
              </span>
              <span className="text-[10px] md:text-xs text-amber-200/80 font-sans block">Heart to God</span>
            </div>
          </button>

          {/* Pillar 2: PRAYER */}
          <button
            onClick={() => onNavigate('prayer-request')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/70 border border-transparent hover:border-amber-500/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-600/30 to-amber-950/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <Heart className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-xs md:text-sm font-bold text-white tracking-wider block group-hover:text-amber-300">
                PRAYER
              </span>
              <span className="text-[10px] md:text-xs text-amber-200/80 font-sans block">Power in Unity</span>
            </div>
          </button>

          {/* Pillar 3: BIBLE */}
          <button
            onClick={() => onNavigate('bible')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/70 border border-transparent hover:border-amber-500/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-600/30 to-amber-950/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-xs md:text-sm font-bold text-white tracking-wider block group-hover:text-amber-300">
                BIBLE
              </span>
              <span className="text-[10px] md:text-xs text-amber-200/80 font-sans block">Truth for Life</span>
            </div>
          </button>

          {/* Pillar 4: FELLOWSHIP */}
          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/70 border border-transparent hover:border-amber-500/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-600/30 to-amber-950/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-xs md:text-sm font-bold text-white tracking-wider block group-hover:text-amber-300">
                FELLOWSHIP
              </span>
              <span className="text-[10px] md:text-xs text-amber-200/80 font-sans block">Together in Christ</span>
            </div>
          </button>

          {/* Pillar 5: OUTREACH */}
          <button
            onClick={() => onNavigate('about')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/70 border border-transparent hover:border-amber-500/30 transition text-left group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-600/30 to-amber-950/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-cinzel text-xs md:text-sm font-bold text-white tracking-wider block group-hover:text-amber-300">
                OUTREACH
              </span>
              <span className="text-[10px] md:text-xs text-amber-200/80 font-sans block">Love in Action</span>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: LIGHT PARCHMENT WELCOME & LEADERSHIP CARD (Ashish & Aniket)
      ========================================================================= */}
      <div className="w-full bg-gradient-to-b from-[#fbf8f0] via-[#f5efe0] to-[#eae0c8] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Welcome description & Button */}
          <div className="md:col-span-4 space-y-3 text-left">
            <div>
              <span className="font-playfair italic text-2xl text-amber-900 block">
                Welcome to
              </span>
              <h3 className="font-cinzel font-black text-xl sm:text-2xl text-slate-950 tracking-tight">
                FIRE & GRACE FELLOWSHIP
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-normal">
              We are a family of believers, united by the love of Jesus Christ, walking in the power of the Holy Spirit,
              and committed to worship, prayer, and making a difference in our world.
            </p>
            <div>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <span>Know More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Column: Deep Blue Brush Stroke "Together We Grow in Christ" */}
          <div className="md:col-span-4 flex items-center justify-center py-2">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] p-6 rounded-2xl bg-gradient-to-br from-[#0c2340] via-[#103a6e] to-[#0a192f] shadow-2xl border-2 border-amber-400/60 transform -rotate-1 hover:rotate-0 transition duration-300">
              {/* Brush stroke texture effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none rounded-2xl" />
              <div className="text-center relative z-10 space-y-1">
                <span className="font-playfair italic text-2xl sm:text-3xl text-white font-normal block leading-tight">
                  Together
                </span>
                <span className="font-cinzel font-black text-xl sm:text-2xl text-amber-300 uppercase tracking-wider block">
                  We Grow
                </span>
                <span className="font-playfair italic text-2xl sm:text-3xl text-amber-100 block">
                  in Christ
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Our Leaders (Ashish & Aniket) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-left sm:text-center md:text-left">
              <span className="font-playfair italic text-2xl text-amber-900 block">
                Our Leaders
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Leader 1: Ashish */}
              <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-300/80 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-400 shrink-0 shadow">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-cinzel font-bold text-lg">
                    A
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-cinzel font-bold text-sm text-slate-900 truncate">Ashish</h4>
                  <a
                    href="tel:+917066463676"
                    className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-amber-800 font-mono font-medium transition"
                  >
                    <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>+91 7066463676</span>
                  </a>
                </div>
              </div>

              {/* Leader 2: Aniket */}
              <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-300/80 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-400 shrink-0 shadow">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-cinzel font-bold text-lg">
                    A
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-cinzel font-bold text-sm text-slate-900 truncate">Aniket</h4>
                  <a
                    href="tel:+917841817431"
                    className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-amber-800 font-mono font-medium transition"
                  >
                    <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>+91 78418 17431</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: LOWER DARK MISSION BAR & OPEN GLOWING BIBLE
      ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#070d18] via-[#0b172a] to-[#040810] border-t border-amber-500/30 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 w-full lg:w-auto">
            {/* Mission Pillar 1: Jesus Christ */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <span className="font-cinzel font-bold text-base">✝</span>
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-300 block">JESUS CHRIST</span>
                <span className="text-[10px] text-slate-400 block font-sans">Our Hope | Life | Mission</span>
              </div>
            </div>

            {/* Mission Pillar 2: Holy Spirit */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-300 block">THE HOLY SPIRIT</span>
                <span className="text-[10px] text-slate-400 block font-sans">Empowers Us</span>
              </div>
            </div>

            {/* Mission Pillar 3: Prayer */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Heart className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-300 block">PRAYER</span>
                <span className="text-[10px] text-slate-400 block font-sans">Changes Things</span>
              </div>
            </div>

            {/* Mission Pillar 4: Love */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-300 block">LOVE</span>
                <span className="text-[10px] text-slate-400 block font-sans">Reaches Everyone</span>
              </div>
            </div>
          </div>

          {/* Right: Scripture Tag & Bible */}
          <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
            <div className="text-right hidden sm:block">
              <span className="font-playfair italic text-sm text-amber-200 block">
                All for His Glory
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Reaching Lives for Christ
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
