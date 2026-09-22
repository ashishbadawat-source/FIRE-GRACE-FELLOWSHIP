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
  Upload,
  Plus,
  FileVideo,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Server,
} from 'lucide-react';
import { api } from '../services/api';
import { downloadMediaFile } from '../utils/downloader';
import { uploadChurchMediaFile } from '../utils/uploader';
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

  // If uploaded video / data URL / blob / direct file extension or server uploads
  if (
    cleanUrl.startsWith('data:video') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('/uploads/') ||
    cleanUrl.includes('/uploads/') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.mkv') ||
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

  // Video Upload States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoSpeaker, setNewVideoSpeaker] = useState('Fire Grace Ministry');
  const [newVideoCategory, setNewVideoCategory] = useState('Worship');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('15:00');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [videoStorageTarget, setVideoStorageTarget] = useState<'auto' | 'firebase' | 'server'>('auto');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  useEffect(() => {
    loadVideos();
  }, [selectedCategory, searchQuery]);

  const loadVideos = () => {
    api
      .getVideos(selectedCategory === 'All' ? undefined : selectedCategory, searchQuery)
      .then(res => setVideos(res.videos))
      .catch(() => {});
  };

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

  // Direct Video File Upload Handler
  const handleVideoFileUpload = async (file: File, overrideTarget?: 'auto' | 'firebase' | 'server') => {
    if (!file) return;
    const target = overrideTarget || videoStorageTarget;
    setSelectedVideoFile(file);

    console.log('[VideosView] Starting video file upload:', {
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      mimeType: file.type,
      storageTarget: target,
    });

    const MAX_SIZE = 150 * 1024 * 1024; // 150MB
    if (file.size > MAX_SIZE) {
      const errTxt = `फ़ाइल 150MB से छोटी होनी चाहिए। आपकी फ़ाइल: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
      console.warn('[VideosView] File size exceeded limit:', errTxt);
      setUploadError(errTxt);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    setUploadProgress(`वीडियो प्रोसेस और अपलोड हो रहा है (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      const { url, provider } = await uploadChurchMediaFile(
        file,
        {
          category: 'Church Video Archive',
          type: 'video',
          storageTarget: target,
          description: `Video recording ${file.name}`,
        },
        (percent, message) => {
          setUploadProgress(`${message} (${percent}%)`);
        }
      );

      console.log(`[VideosView] Video uploaded successfully via ${provider}:`, url);
      setNewVideoUrl(url);
      if (!newVideoTitle.trim()) {
        setNewVideoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      const providerLabel = provider === 'firebase' ? 'Firebase Cloud Storage' : 'Church Server Storage';
      setUploadSuccess(`वीडियो "${file.name}" सफलतापूर्वक ${providerLabel} पर अपलोड हो गया!`);
    } catch (err: any) {
      console.error('[VideosView] Video upload failed:', {
        message: err.message,
        firebaseCode: err.firebaseCode,
        errorObj: err,
      });

      let displayMessage = err.message || 'वीडियो अपलोड करने में विफल रहा।';
      if (err.firebaseCode === 'storage/unauthorized' || displayMessage.includes('unauthorized') || displayMessage.includes('अनुमति अस्वीकृत')) {
        displayMessage = 'Firebase Storage अनुमति अस्वीकृत (403 Unauthorized): स्टोरेज रूल्स ने अपलोड अस्वीकार कर दिया। आप नीचे दिए गए "Church Server से पुनः प्रयास करें" बटन से तुरंत अपलोड कर सकते हैं।';
      }
      setUploadError(displayMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  // Thumbnail File Upload Handler
  const handleThumbFileUpload = async (file: File) => {
    if (!file) return;
    console.log('[VideosView] Starting thumbnail upload:', file.name, file.size);
    try {
      const { url } = await uploadChurchMediaFile(file, {
        category: 'Video Thumbnail',
        type: 'image',
        storageTarget: videoStorageTarget,
      });
      console.log('[VideosView] Thumbnail uploaded:', url);
      setNewVideoThumbnail(url);
    } catch (err: any) {
      console.error('[VideosView] Thumbnail upload error:', err);
      setUploadError(err.message || 'थंबनेल अपलोड में समस्या हुई।');
    }
  };

  // Submit New Video
  const handleSubmitNewVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) {
      setUploadError('कृपया वीडियो का शीर्षक और वीडियो फ़ाइल या लिंक दर्ज करें।');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    try {
      const res = await api.addVideo({
        title: newVideoTitle.trim(),
        speaker: newVideoSpeaker.trim() || 'Fire Grace Ministry',
        category: newVideoCategory,
        youtubeUrl: newVideoUrl.trim(),
        duration: newVideoDuration.trim() || '15:00',
        thumbnail:
          newVideoThumbnail.trim() ||
          'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80',
      });
      setUploadSuccess('नया वीडियो आर्काइव में सफलतापूर्वक जोड़ दिया गया!');
      if (res.video) {
        setVideos(prev => [res.video, ...prev]);
      }
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess('');
        setNewVideoTitle('');
        setNewVideoUrl('');
        setNewVideoThumbnail('');
        loadVideos();
      }, 1200);
    } catch (err: any) {
      setUploadError(err.message || 'वीडियो जोड़ने में समस्या हुई।');
    } finally {
      setIsUploading(false);
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

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>+ नया वीडियो अपलोड करें (Upload Video)</span>
          </button>
        </div>
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="वीडियो खोजें (Search video archive)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="md:hidden shrink-0 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>अपलोड</span>
          </button>
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

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-amber-500/40 p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <FileVideo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">नया वीडियो अपलोड करें (Upload Church Video)</h3>
                  <p className="text-xs text-slate-400">MP4 वीडियो सीधे अपलोड करें या YouTube वीडियो लिंक जोड़ें</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError('');
                  setUploadSuccess('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-300">वीडियो अपलोड त्रुटि विवरण (Upload Error Details):</p>
                    <p className="leading-relaxed">{uploadError}</p>
                  </div>
                </div>
                {(uploadError.includes('Firebase') || uploadError.includes('unauthorized') || uploadError.includes('अस्वीकृत')) && selectedVideoFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setVideoStorageTarget('server');
                      handleVideoFileUpload(selectedVideoFile, 'server');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Server className="w-3.5 h-3.5" />
                    Church Fast Server स्टोरेज से तुरंत पुनः अपलोड करें
                  </button>
                )}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewVideo} className="space-y-4">
              {/* Storage Provider Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">स्टोरेज प्रदाता (Storage Engine)</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setVideoStorageTarget('auto')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                      videoStorageTarget === 'auto' || videoStorageTarget === 'server'
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    Church Server (तेज़, 150MB+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoStorageTarget('firebase')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                      videoStorageTarget === 'firebase'
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    Firebase Storage
                  </button>
                </div>
              </div>
              {/* Direct Video File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>1. अपने डिवाइस से वीडियो फ़ाइल चुनें (Upload MP4 File directly)</span>
                </label>
                <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-400/80 rounded-2xl p-5 bg-amber-500/5 hover:bg-amber-500/10 transition text-center cursor-pointer relative group">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                    onChange={e => e.target.files?.[0] && handleVideoFileUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    disabled={isUploading}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto group-hover:scale-110 transition">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isUploading
                          ? uploadProgress || 'वीडियो अपलोड हो रहा है...'
                          : newVideoUrl.startsWith('/uploads/')
                          ? '✅ वीडियो फ़ाइल सफलता पूर्वक अपलोड हो गई!'
                          : 'फ़ाइल चुनने के लिए यहाँ क्लिक करें (Click to select MP4 / WebM video)'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        समर्थित: MP4, MOV, WebM (150MB तक फ़ाइल साइज)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Or manual Video URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  या वीडियो URL / YouTube लिंक दर्ज करें <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... या /uploads/video.mp4"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Title & Speaker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    वीडियो का शीर्षक (Video Title) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रविवार की आत्मिक सभा, जीवित गवाही..."
                    value={newVideoTitle}
                    onChange={e => setNewVideoTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    वक्ता / प्रचारक (Speaker / Leader)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Pastor, Bro. Ashish, Worship Leader"
                    value={newVideoSpeaker}
                    onChange={e => setNewVideoSpeaker(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">श्रेणी (Category)</label>
                  <select
                    value={newVideoCategory}
                    onChange={e => setNewVideoCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Worship">Worship (आराधना)</option>
                    <option value="Testimonies">Testimonies (जीवित गवाहियां)</option>
                    <option value="Conferences">Conferences (सम्मेलन व सेमिनार)</option>
                    <option value="Bible Study">Bible Study (बाईबल अध्ययन)</option>
                    <option value="Youth">Youth Ministry (युवा मंत्रालय)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">समय / अवधि (Duration)</label>
                  <input
                    type="text"
                    placeholder="उदा. 25:40"
                    value={newVideoDuration}
                    onChange={e => setNewVideoDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>थंबनेल फोटो (Thumbnail Image)</span>
                  <span className="text-[10px] text-slate-400">वैकल्पिक (Optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... या नीचे से फोटो चुनें"
                    value={newVideoThumbnail}
                    onChange={e => setNewVideoThumbnail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <label className="shrink-0 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>फोटो चुनें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && handleThumbFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>प्रक्रिया जारी है...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>वीडियो प्रकाशित करें (Publish Video)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
