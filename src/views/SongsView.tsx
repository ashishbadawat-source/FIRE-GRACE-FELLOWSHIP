/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Download,
  Share2,
  FileText,
  Search,
  Plus,
  Flame,
  Radio,
  Check,
  X,
  Sparkles,
  Disc,
  Clock,
  Globe,
  Sliders,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Upload,
  Loader2,
  CheckCircle,
  FileAudio,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { downloadMediaFile } from '../utils/downloader';
import { uploadChurchMediaFile } from '../utils/uploader';
import type { AudioSong } from '../types';

interface SongsViewProps {
  onNavigate?: (view: string) => void;
}

export const SongsView: React.FC<SongsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<AudioSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Player state
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [likedSongIds, setLikedSongIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fgf_liked_songs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lyrics modal & Drawer
  const [lyricsSong, setLyricsSong] = useState<AudioSong | null>(null);
  const [lyricsFontSize, setLyricsFontSize] = useState<number>(16);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  // Add Song Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingSong, setSubmittingSong] = useState(false);
  const [addSongSuccess, setAddSongSuccess] = useState('');
  const [addSongError, setAddSongError] = useState('');

  // Add Song Form fields
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('Fire & Grace Worship Team');
  const [newAlbum, setNewAlbum] = useState('Ignited by Fire Vol. 1');
  const [newLanguage, setNewLanguage] = useState<AudioSong['language']>('Hindi');
  const [newCategory, setNewCategory] = useState<AudioSong['category']>('Worship');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newDuration, setNewDuration] = useState('05:00');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80');
  const [newLyrics, setNewLyrics] = useState('');
  const [newDownloadAllowed, setNewDownloadAllowed] = useState(true);
  const [newFeatured, setNewFeatured] = useState(false);

  // Direct Audio File Upload States
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Quick preset audio samples for easy testing if user doesn't have custom MP3 url
  const presetAudioOptions = [
    { label: 'Worship Melody (Sample 1)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { label: 'Revival Fire Instrumental (Sample 2)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { label: 'Acoustic Praise (Sample 3)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { label: 'Choir & Strings (Sample 4)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  ];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSongs();
  }, [selectedCategory, selectedLanguage]);

  const loadSongs = async () => {
    setLoading(true);
    try {
      const res = await api.getSongs(
        selectedCategory === 'All' ? undefined : selectedCategory,
        selectedLanguage === 'All' ? undefined : selectedLanguage,
        searchQuery ? searchQuery : undefined
      );
      setSongs(res.songs || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const currentSong = currentSongIndex !== null && songs[currentSongIndex] ? songs[currentSongIndex] : null;

  // Handle Play/Pause
  const handlePlaySong = (index: number) => {
    if (currentSongIndex === index) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      const songToPlay = songs[index];
      if (songToPlay) {
        api.incrementSongPlay(songToPlay.id).catch(() => {});
      }
    }
  };

  // Skip Next
  const handleNextSong = () => {
    if (songs.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
      setIsPlaying(true);
    } else {
      const nextIndex = currentSongIndex === null ? 0 : (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  // Skip Prev
  const handlePrevSong = () => {
    if (songs.length === 0) return;
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentSongIndex === null ? 0 : (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
  };

  // Toggle Like
  const handleLikeSong = async (e: React.MouseEvent, song: AudioSong) => {
    e.stopPropagation();
    const isLiked = likedSongIds.includes(song.id);
    let updated: string[];
    if (isLiked) {
      updated = likedSongIds.filter(id => id !== song.id);
    } else {
      updated = [...likedSongIds, song.id];
      try {
        await api.likeSong(song.id);
        // update local list
        setSongs(prev =>
          prev.map(s => (s.id === song.id ? { ...s, likesCount: (s.likesCount || 0) + 1 } : s))
        );
      } catch {
        // ignore
      }
    }
    setLikedSongIds(updated);
    localStorage.setItem('fgf_liked_songs', JSON.stringify(updated));
  };

  // Time formatting helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Copy Lyrics
  const handleCopyLyrics = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2500);
  };

  // Share Song on WhatsApp
  const handleShareSong = (e: React.MouseEvent, song: AudioSong) => {
    e.stopPropagation();
    const text = `🎵 *${song.title}* by ${song.artist}\nFire & Grace Fellowship Audio Songs\nListen now: ${window.location.origin}/#songs`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Direct Audio File Upload
  const handleAudioFileUpload = async (file: File) => {
    if (!file) return;
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      setAddSongError(`ऑडियो फ़ाइल 100MB से छोटी होनी चाहिए। आपकी फ़ाइल: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    setIsUploadingAudio(true);
    setAddSongError('');
    setAddSongSuccess('');
    setAudioFileName(file.name);
    setAudioUploadProgress(`ऑडियो प्रोसेस और अपलोड हो रहा है (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    // Detect duration using audio element
    try {
      const audioUrl = URL.createObjectURL(file);
      const audioTest = new Audio(audioUrl);
      audioTest.onloadedmetadata = () => {
        if (audioTest.duration && !isNaN(audioTest.duration)) {
          const mins = Math.floor(audioTest.duration / 60);
          const secs = Math.floor(audioTest.duration % 60);
          setNewDuration(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };
    } catch {
      // ignore
    }

    try {
      const { url } = await uploadChurchMediaFile(
        file,
        {
          category: 'Worship Audio Song',
          type: 'audio',
          description: `Audio song ${file.name}`,
        },
        (percent, message) => {
          setAudioUploadProgress(`${message} (${percent}%)`);
        }
      );

      setNewAudioUrl(url);
      if (!newTitle.trim()) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setAddSongSuccess(`ऑडियो फ़ाइल "${file.name}" सफलतापूर्वक अपलोड हो गई!`);
    } catch (err: any) {
      setAddSongError(err.message || 'ऑडियो अपलोड करने में समस्या हुई। कृपया पुन: प्रयास करें।');
    } finally {
      setIsUploadingAudio(false);
      setAudioUploadProgress('');
    }
  };

  // Direct Cover File Upload
  const handleCoverFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const { url } = await uploadChurchMediaFile(file, {
        category: 'Song Cover Art',
        type: 'image',
      });
      setNewCoverImage(url);
    } catch (err: any) {
      alert(err.message || 'कवर फोटो अपलोड में समस्या हुई।');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Submit New Song
  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim() || !newAudioUrl.trim()) {
      setAddSongError('कृपया गीत का शीर्षक (Title), गायक (Artist), और ऑडियो लिंक (Audio URL) भरें।');
      return;
    }
    setSubmittingSong(true);
    setAddSongError('');
    setAddSongSuccess('');

    try {
      await api.createSong({
        title: newTitle.trim(),
        artist: newArtist.trim(),
        album: newAlbum.trim(),
        language: newLanguage,
        category: newCategory,
        audioUrl: newAudioUrl.trim(),
        duration: newDuration.trim() || '04:30',
        coverImage: newCoverImage.trim(),
        lyrics: newLyrics.trim(),
        downloadAllowed: newDownloadAllowed,
        downloadUrl: newAudioUrl.trim(),
        featured: newFeatured,
      });

      setAddSongSuccess('नया ऑडियो गीत सफलतापूर्वक जोड़ दिया गया है! Glory to God!');
      setTimeout(() => {
        setShowAddModal(false);
        setAddSongSuccess('');
        setNewTitle('');
        setNewLyrics('');
        setNewAudioUrl('');
        loadSongs();
      }, 1200);
    } catch (err: any) {
      setAddSongError(err.message || 'गीत जोड़ने में त्रुटि हुई। कृपया पुन: प्रयास करें।');
    } finally {
      setSubmittingSong(false);
    }
  };

  // Filtered list
  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      searchQuery === '' ||
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.lyrics && song.lyrics.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = selectedLanguage === 'All' || song.language === selectedLanguage;
    const matchesCat = selectedCategory === 'All' || song.category === selectedCategory;

    return matchesSearch && matchesLang && matchesCat;
  });

  const featuredSong = songs.find(s => s.featured) || songs[0];

  return (
    <div className="space-y-10 pb-32 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl || ''}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.playbackRate = playbackSpeed;
            if (isPlaying) {
              audioRef.current.play().catch(() => {});
            }
          }
        }}
        onEnded={() => {
          if (isRepeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          } else {
            handleNextSong();
          }
        }}
      />

      {/* Page Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 top-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Disc className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Gospel Audio Songs & Worship Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cinzel text-white tracking-tight">
              ऑडियो गीत व <span className="text-amber-400">आराधना</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              "आत्मा और सच्चाई से आराधना करो।" — आत्मा से भरे मसीही हिंदी, अंग्रेजी व मराठी स्तुति-प्रशंसा और आराधना के गीत सुनें, बोल (lyrics) पढ़ें व डाउनलोड करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="add-audio-song-btn"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>नया ऑडियो गीत जोड़ें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Track Card (If Available) */}
      {featuredSong && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-amber-500/30 transition shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto text-center sm:text-left">
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-amber-500/30">
              <img
                src={featuredSong.coverImage}
                alt={featuredSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <button
                onClick={() => {
                  const idx = songs.findIndex(s => s.id === featuredSong.id);
                  if (idx !== -1) handlePlaySong(idx);
                }}
                className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-xs"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                  {currentSong?.id === featuredSong.id && isPlaying ? (
                    <Pause className="w-6 h-6 fill-slate-950" />
                  ) : (
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  )}
                </div>
              </button>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
                  Featured Track • विशेष प्रस्तुति
                </span>
                <span className="text-xs text-slate-400">• {featuredSong.language}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">{featuredSong.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{featuredSong.artist} • {featuredSong.album}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 pt-1">
                <span>⏱ {featuredSong.duration || '05:00'}</span>
                <span>•</span>
                <span>🔥 {featuredSong.playsCount || 340} बार सुना गया</span>
                <span>•</span>
                <span>❤️ {featuredSong.likesCount || 89} लाइक्स</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                const idx = songs.findIndex(s => s.id === featuredSong.id);
                if (idx !== -1) handlePlaySong(idx);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md"
            >
              {currentSong?.id === featuredSong.id && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>रोकें (Pause)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  <span>अभी सुनें (Play Now)</span>
                </>
              )}
            </button>

            {featuredSong.lyrics && (
              <button
                onClick={() => setLyricsSong(featuredSong)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition border border-slate-700"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>गीत के बोल (Lyrics)</span>
              </button>
            )}

            {featuredSong.audioUrl && (
              <button
                onClick={() => downloadMediaFile(featuredSong.audioUrl, `${featuredSong.title} - Fire Grace Worship.mp3`)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition border border-slate-700 flex items-center gap-2"
                title="डाउनलोड करें (Download MP3)"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>MP3 डाउनलोड करें</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="गीत का नाम, गायक या बोल खोजें..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Languages Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" /> भाषा:
            </span>
            {['All', 'Hindi', 'English', 'Marathi', 'Punjabi', 'Other'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLanguage === lang
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lang === 'All' ? 'सभी भाषाएं' : lang === 'Hindi' ? 'हिंदी' : lang === 'Marathi' ? 'मराठी' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-amber-400" /> श्रेणी:
          </span>
          {[
            { id: 'All', label: 'सभी गीत' },
            { id: 'Worship', label: 'Worship (आराधना)' },
            { id: 'Praise', label: 'Praise (स्तुति)' },
            { id: 'Revival Fire', label: 'Revival Fire (आत्मिक आग)' },
            { id: 'Prayer & Intercession', label: 'Prayer (प्रार्थना)' },
            { id: 'Deliverance', label: 'Deliverance (छुटकारा)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid / List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Disc className="w-10 h-10 text-amber-400 animate-spin mx-auto opacity-70" />
          <p className="text-xs text-slate-400 font-medium">ऑडियो गीत लोड हो रहे हैं...</p>
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-slate-900/50 border border-slate-800 p-8">
          <Music className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-cinzel text-white">कोई ऑडियो गीत नहीं मिला</h3>
            <p className="text-xs text-slate-400">
              आपके चुने हुए फ़िल्टर या खोज के अनुसार कोई गीत उपलब्ध नहीं है।
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedLanguage('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
          >
            फ़िल्टर हटाएं (Reset Filters)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSongs.map((song, idx) => {
            const isThisSongPlaying = currentSong?.id === song.id && isPlaying;
            const isThisSongActive = currentSong?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id}
                className={`group relative rounded-2xl bg-slate-900 border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isThisSongActive
                    ? 'border-amber-500 shadow-lg shadow-amber-500/10 bg-slate-900/90'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Top image & play overlay */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={song.coverImage || 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80'}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Language & Category Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        {song.language}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-medium text-slate-300 border border-slate-700">
                        {song.category}
                      </span>
                    </div>

                    {/* Like button top right */}
                    <button
                      onClick={e => handleLikeSong(e, song)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-950/80 backdrop-blur-xs text-white hover:text-rose-400 transition"
                      title="पसंद करें (Like)"
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                      />
                    </button>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => {
                          const globalIdx = songs.findIndex(s => s.id === song.id);
                          if (globalIdx !== -1) handlePlaySong(globalIdx);
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl transform ${
                          isThisSongPlaying
                            ? 'bg-amber-500 text-slate-950 scale-105'
                            : 'bg-slate-950/80 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 hover:scale-110'
                        }`}
                      >
                        {isThisSongPlaying ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Duration badge bottom right */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{song.duration || '04:30'}</span>
                    </div>
                  </div>

                  {/* Title & Details */}
                  <div className="space-y-1">
                    <h4 className="font-cinzel font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition">
                      {song.title}
                    </h4>
                    <p className="text-xs text-amber-400 font-medium line-clamp-1">{song.artist}</p>
                    {song.album && <p className="text-[11px] text-slate-400 line-clamp-1">Album: {song.album}</p>}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    {song.lyrics && (
                      <button
                        onClick={() => setLyricsSong(song)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>बोल (Lyrics)</span>
                      </button>
                    )}

                    <button
                      onClick={e => handleShareSong(e, song)}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="शेयर करें (Share on WhatsApp)"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {song.audioUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadMediaFile(song.audioUrl, `${song.title} - Fire Grace Worship.mp3`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition"
                        title="MP3 डाउनलोड करें (Download MP3)"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400">❤️ {song.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Persistent Floating Audio Player Bar */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-amber-500/30 p-3 sm:p-4 shadow-2xl animate-slideUp">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Track Meta */}
            <div className="flex items-center gap-3 w-full md:w-1/4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 shadow-md">
                <img
                  src={currentSong.coverImage}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-white text-xs sm:text-sm truncate">{currentSong.title}</h4>
                <p className="text-[11px] text-amber-400 truncate">{currentSong.artist}</p>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-amber-300">
                    {currentSong.language}
                  </span>
                  <span>• {currentSong.category}</span>
                </div>
              </div>

              {/* Like in player */}
              <button
                onClick={e => handleLikeSong(e, currentSong)}
                className="p-2 text-slate-400 hover:text-rose-400 transition shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${likedSongIds.includes(currentSong.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                />
              </button>
            </div>

            {/* Center: Controls & Scrubber */}
            <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
              {/* Button Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-1.5 rounded-lg transition ${isShuffle ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevSong}
                  className="p-1.5 text-slate-300 hover:text-white transition"
                  title="Previous Track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    if (currentSongIndex !== null) handlePlaySong(currentSongIndex);
                  }}
                  className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextSong}
                  className="p-1.5 text-slate-300 hover:text-white transition"
                  title="Next Track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-1.5 rounded-lg transition ${isRepeat ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                  title="Repeat Track"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Time Slider */}
              <div className="flex items-center gap-2 w-full max-w-md text-[11px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Extra Tools (Lyrics, Speed, Volume, Download) */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-full md:w-1/4">
              {currentSong.audioUrl && (
                <button
                  onClick={() => downloadMediaFile(currentSong.audioUrl, `${currentSong.title} - Fire Grace Worship.mp3`)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
                  title="MP3 डाउनलोड करें (Download MP3)"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}

              {currentSong.lyrics && (
                <button
                  onClick={() => setLyricsSong(currentSong)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>बोल (Lyrics)</span>
                </button>
              )}

              {/* Speed Selector */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-semibold">
                {[1, 1.25, 1.5].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-1.5 py-0.5 rounded ${playbackSpeed === s ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics Modal / Drawer */}
      {lyricsSong && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 shrink-0">
                  <img src={lyricsSong.coverImage} alt={lyricsSong.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-white text-lg">{lyricsSong.title}</h3>
                  <p className="text-xs text-amber-400">{lyricsSong.artist} • {lyricsSong.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Font Size Adjusters */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 gap-2 text-xs">
                  <button
                    onClick={() => setLyricsFontSize(prev => Math.max(12, prev - 2))}
                    className="text-slate-400 hover:text-white font-bold px-1"
                    title="छोटा फ़ॉन्ट (A-)"
                  >
                    A-
                  </button>
                  <span className="text-[10px] text-amber-400 font-mono">{lyricsFontSize}px</span>
                  <button
                    onClick={() => setLyricsFontSize(prev => Math.min(24, prev + 2))}
                    className="text-slate-400 hover:text-white font-bold px-1"
                    title="बड़ा फ़ॉन्ट (A+)"
                  >
                    A+
                  </button>
                </div>

                {/* Copy Lyrics */}
                {lyricsSong.lyrics && (
                  <button
                    onClick={() => handleCopyLyrics(lyricsSong.lyrics!)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
                    title="बोल कॉपी करें"
                  >
                    {copiedLyrics ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => setLyricsSong(null)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Lyrics text */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {lyricsSong.lyrics ? (
                <div
                  style={{ fontSize: `${lyricsFontSize}px` }}
                  className="whitespace-pre-line font-sans text-slate-200 leading-relaxed tracking-wide text-center"
                >
                  {lyricsSong.lyrics}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  इस गीत के बोल अभी उपलब्ध नहीं हैं।
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
              <span className="text-slate-400">Fire & Grace Fellowship Songbook</span>
              <button
                onClick={() => setLyricsSong(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-white text-lg">नया ऑडियो गीत जोड़ें (Add Song)</h3>
                  <p className="text-xs text-slate-400">अपनी मंडली और विश्वासियों के लिए मसीही गीत अपलोड व साझा करें</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSongSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {addSongSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{addSongSuccess}</span>
                </div>
              )}

              {addSongError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{addSongError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    गीत का शीर्षक (Song Title) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. येशु तेरा नाम, आराधना में स्तुति..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    गायक / टीम (Artist / Singer) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Fire & Grace Worship Team, Bro. Ashish"
                    value={newArtist}
                    onChange={e => setNewArtist(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">भाषा (Language)</label>
                  <select
                    value={newLanguage}
                    onChange={e => setNewLanguage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="English">English</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Punjabi">पंजाबी (Punjabi)</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">श्रेणी (Category)</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Worship">Worship (आराधना)</option>
                    <option value="Praise">Praise (स्तुति)</option>
                    <option value="Revival Fire">Revival Fire (आत्मिक आग)</option>
                    <option value="Prayer & Intercession">Prayer (प्रार्थना)</option>
                    <option value="Deliverance">Deliverance (छुटकारा)</option>
                    <option value="Kids">Kids Gospel</option>
                    <option value="Choir">Choir & Choral</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">अवधि (Duration)</label>
                  <input
                    type="text"
                    placeholder="05:20"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Direct Audio File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>1. अपने डिवाइस से MP3 / ऑडियो फ़ाइल चुनें (Upload MP3 directly)</span>
                </label>
                <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-400/80 rounded-2xl p-4 bg-amber-500/5 hover:bg-amber-500/10 transition text-center cursor-pointer relative group">
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/aac,audio/ogg,audio/*"
                    onChange={e => e.target.files?.[0] && handleAudioFileUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    disabled={isUploadingAudio}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto group-hover:scale-110 transition">
                      {isUploadingAudio ? (
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      ) : (
                        <FileAudio className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isUploadingAudio
                          ? audioUploadProgress || 'ऑडियो फ़ाइल अपलोड हो रही है...'
                          : newAudioUrl.startsWith('/uploads/')
                          ? `✅ "${audioFileName || 'Audio'}" सफलतापूर्वक अपलोड हो गई!`
                          : 'MP3 फ़ाइल चुनने के लिए यहाँ क्लिक करें (Click to select MP3)'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        समर्थित: MP3, WAV, M4A, OGG (100MB तक फ़ाइल साइज)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audio preview if uploaded */}
                {newAudioUrl && (
                  <div className="pt-1">
                    <audio src={newAudioUrl} controls className="w-full h-8 rounded-lg" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  या ऑडियो लिंक / MP3 URL दर्ज करें <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://your-audio-host.com/track.mp3 या /uploads/..."
                  value={newAudioUrl}
                  onChange={e => setNewAudioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />

                {/* Preset quick links helper */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">त्वरित सैंपल ऑडियो चुनें:</span>
                  {presetAudioOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewAudioUrl(opt.url)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[10px] transition border border-slate-700"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image with direct file upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>एल्बम कवर इमेज (Cover Image)</span>
                  <span className="text-[10px] text-slate-400">वैकल्पिक</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... या फोटो चुनें"
                    value={newCoverImage}
                    onChange={e => setNewCoverImage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <label className="shrink-0 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1.5">
                    {isUploadingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>फोटो चुनें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && handleCoverFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  गीत के संपूर्ण बोल (Hindi / English Lyrics)
                </label>
                <textarea
                  rows={5}
                  placeholder={`[मुखड़ा]\nयेशु तेरा नाम सबसे ऊंचा है...\n\n[अंतरा]\nअंधकार में तूने ज्योति जलाई...`}
                  value={newLyrics}
                  onChange={e => setNewLyrics(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newDownloadAllowed}
                    onChange={e => setNewDownloadAllowed(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>विश्वासियों के लिए MP3 डाउनलोड की अनुमति दें (Allow Download)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newFeatured}
                    onChange={e => setNewFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>विशेष स्पॉटलाइट बनाएं (Feature on Homepage)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={submittingSong}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  {submittingSong ? (
                    <>
                      <Disc className="w-3.5 h-3.5 animate-spin" />
                      <span>जोड़ा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>गीत प्रकाशित करें (Save Song)</span>
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
