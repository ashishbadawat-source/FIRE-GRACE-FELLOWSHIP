/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Video, Play, Search, Clock, Calendar, ExternalLink, X, Share2, Check } from 'lucide-react';
import { api } from '../services/api';
import type { VideoItem } from '../types';

export const VideosView: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories] = useState<string[]>([
    'All',
    'Worship',
    'Testimonies',
    'Conferences',
    'Bible Study',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.getVideos(selectedCategory, searchQuery).then(res => setVideos(res.videos)).catch(() => {});
  }, [selectedCategory, searchQuery]);

  const handleShare = (v: VideoItem) => {
    const text = `Watch "${v.title}" by Fire Grace Fellowship!`;
    if (navigator.share) {
      navigator.share({ title: v.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopiedId(v.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div id="videos-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Video className="w-3.5 h-3.5" /> Media Ministry
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">CHURCH VIDEO ARCHIVE</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Full worship services, miracle testimonies, and deep biblical series produced with broadcast excellence.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search video archive..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <p className="text-sm">No videos found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <div
              key={v.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition overflow-hidden group flex flex-col justify-between"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <button
                  onClick={() => setActiveVideo(v)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition"
                  title="Play Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{v.duration}</span>
                </div>
                <div className="absolute top-2.5 left-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">
                  {v.category}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{v.speaker}</span>
                    <span>{new Date(v.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {v.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveVideo(v)}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Watch Now
                  </button>
                  <button
                    onClick={() => handleShare(v)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Share Video"
                  >
                    {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{activeVideo.title}</h4>
                <p className="text-xs text-amber-400">{activeVideo.speaker} • {activeVideo.duration}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={activeVideo.youtubeUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
