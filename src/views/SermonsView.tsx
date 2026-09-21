/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Search,
  Calendar,
  User,
  BookOpen,
  Volume2,
  Share2,
  Check,
  Flame,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import type { Sermon } from '../types';

interface SermonsViewProps {
  onNavigateToBible?: (book: string) => void;
}

export const SermonsView: React.FC<SermonsViewProps> = ({ onNavigateToBible }) => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [categories] = useState<string[]>([
    'All',
    'Sunday Sermon',
    'Holy Spirit & Power',
    'Grace & Righteousness',
    'Faith & Miracles',
    'Revival Fire',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadSermons();
  }, [selectedCategory, searchQuery]);

  const loadSermons = async () => {
    try {
      const res = await api.getSermons(selectedCategory, searchQuery);
      setSermons(res.sermons);
    } catch {
      // ignore
    }
  };

  const handleShare = (sermon: Sermon) => {
    const text = `Listen to "${sermon.title}" by ${sermon.speaker} at Fire Grace Fellowship!`;
    if (navigator.share) {
      navigator.share({ title: sermon.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopiedId(sermon.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div id="sermons-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Flame className="w-3.5 h-3.5" /> Apostolic Word & Revelation
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">SERMONS & TEACHINGS</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Feast on divine truth, prophetic insight, and faith-building messages from Senior Pastor David Emmanuel and guest ministers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sermons or scripture..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Sermons Grid */}
      {sermons.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <p className="text-base font-semibold">No sermons match your criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting "All" or modifying your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map(sermon => (
            <div
              key={sermon.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition overflow-hidden group flex flex-col justify-between"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>

                {/* Center Play Button */}
                <button
                  onClick={() => setActiveSermon(sermon)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition"
                  title="Watch Sermon Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur px-2.5 py-0.5 rounded text-[10px] font-bold text-amber-300">
                  {sermon.category}
                </div>
              </div>

              {/* Information */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <User className="w-3 h-3 text-amber-400" />
                      {sermon.speaker}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sermon.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-serif italic">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{sermon.bibleReference}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                    {sermon.description}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSermon(sermon)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition"
                    >
                      Watch Video
                    </button>
                    <button
                      onClick={() => setIsPlayingAudio(isPlayingAudio === sermon.id ? null : sermon.id)}
                      className={`p-2 rounded-lg transition ${
                        isPlayingAudio === sermon.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title="Audio Stream"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(sermon)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Share Sermon"
                  >
                    {copiedId === sermon.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Simulated Audio Player if active */}
                {isPlayingAudio === sermon.id && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] text-amber-300">
                      <span>Streaming Audio Broadcast...</span>
                      <span className="font-mono">18:42 / 48:15</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-2/5 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {activeSermon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{activeSermon.title}</h4>
                <p className="text-xs text-amber-400">
                  {activeSermon.speaker} • {activeSermon.bibleReference}
                </p>
              </div>
              <button
                onClick={() => setActiveSermon(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              {activeSermon.youtubeUrl ? (
                <iframe
                  src={activeSermon.youtubeUrl}
                  title={activeSermon.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Play className="w-12 h-12 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-white">Full Video Stream</p>
                  <p className="text-xs mt-1">Available in Church Vault.</p>
                </div>
              )}
            </div>

            <div className="p-5 text-xs text-slate-300 space-y-3">
              <p className="leading-relaxed">{activeSermon.description}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleShare(activeSermon)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button
                  onClick={() => setActiveSermon(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
