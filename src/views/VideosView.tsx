/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  Search,
  Clock,
  ExternalLink,
  X,
  Share2,
  Check,
  Download,
  Film,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { downloadMediaFile } from '../utils/downloader';
import type { VideoItem } from '../types';

interface ParsedVideo {
  type: 'youtube' | 'direct';
  embedUrl: string;
  directUrl: string;
  videoId?: string;
}

function parseVideoUrl(url: string): ParsedVideo {
  if (!url) return { type: 'direct', embedUrl: '', directUrl: '' };

  const cleanUrl = url.trim();

  // If uploaded video / data URL / blob / direct file extension
  if (
    cleanUrl.startsWith('data:video') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.includes('/api/files/')
  ) {
    return { type: 'direct', embedUrl: cleanUrl, directUrl: cleanUrl };
  }

  // Check if YouTube
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      directUrl: `https://www.youtube.com/watch?v=${id}`,
      videoId: id,
    };
  }

  // Fallback direct
  return { type: 'direct', embedUrl: cleanUrl, directUrl: cleanUrl };
}

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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getVideos(selectedCategory, searchQuery)
      .then(res => setVideos(res.videos))
      .catch(() => {});
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

  const handleDownloadVideo = async (v: VideoItem) => {
    setDownloadingId(v.id);
    const parsed = parseVideoUrl(v.youtubeUrl);
    const targetUrl = parsed.type === 'direct' ? parsed.directUrl : v.youtubeUrl;
    const filename = `${v.title.replace(/[/\\?%*:|"<>]/g, '')} - Fire Grace Fellowship.mp4`;

    try {
      await downloadMediaFile(targetUrl, filename);
    } finally {
      setTimeout(() => setDownloadingId(null), 1500);
    }
  };

  const activeParsed = activeVideo ? parseVideoUrl(activeVideo.youtubeUrl) : null;

  return (
    <div id="videos-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Film className="w-3.5 h-3.5" /> मीडिया मंत्रालय • CHURCH VIDEO ARCHIVE
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">
          CHURCH VIDEO ARCHIVE & BROADCASTS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          आराधना सभाएं, जीवित गवाहियां, और प्रभु के गहरे वचन। वीडियो देखें और अपनी सुविधानुसार डाउनलोड करें।
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
              {cat === 'All' ? 'सभी वीडियो (All)' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="वीडियो खोजें (Search video archive)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm">कोई वीडियो नहीं मिला (No videos found matching your search).</p>
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
                  src={
                    v.thumbnail ||
                    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <button
                  onClick={() => setActiveVideo(v)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  title="Play Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{v.duration || 'Full'}</span>
                </div>
                <div className="absolute top-2.5 left-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">
                  {v.category}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-amber-400 font-medium">{v.speaker}</span>
                    <span>{new Date(v.date).toLocaleDateString()}</span>
                  </div>
                  <h3
                    onClick={() => setActiveVideo(v)}
                    className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2 cursor-pointer"
                  >
                    {v.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                  <button
                    onClick={() => setActiveVideo(v)}
                    className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>देखें (Watch)</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Direct Video Download Button */}
                    <button
                      onClick={() => handleDownloadVideo(v)}
                      disabled={downloadingId === v.id}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/30 transition flex items-center gap-1 text-[11px] font-semibold"
                      title="वीडियो डाउनलोड करें (Download Video)"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{downloadingId === v.id ? 'डाउनलोडिंग...' : 'डाउनलोड'}</span>
                    </button>

                    <button
                      onClick={() => handleShare(v)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Share Video"
                    >
                      {copiedId === v.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && activeParsed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base leading-snug">{activeVideo.title}</h4>
                <p className="text-xs text-amber-400">
                  {activeVideo.speaker} • {activeVideo.duration} • {activeVideo.category}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Playback Container */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {activeParsed.type === 'youtube' ? (
                <iframe
                  src={activeParsed.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={activeParsed.directUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  आपका ब्राउज़र इस वीडियो को सीधे चलाने में असमर्थ है। कृपया नीचे डाउनलोड बटन का उपयोग करें।
                </video>
              )}
            </div>

            {/* Actions Bar inside Modal */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {activeParsed.type === 'youtube' && (
                  <a
                    href={activeParsed.directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/40 font-semibold flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>YouTube पर देखें</span>
                  </a>
                )}

                <button
                  onClick={() => handleDownloadVideo(activeVideo)}
                  disabled={downloadingId === activeVideo.id}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {downloadingId === activeVideo.id
                      ? 'डाउनलोड हो रहा है...'
                      : 'वीडियो डाउनलोड करें (Download Video)'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activeVideo)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>शेयर करें</span>
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
