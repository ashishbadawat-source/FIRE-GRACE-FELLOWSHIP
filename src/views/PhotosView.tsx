/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X, Download, Share2, Layers, Plus, Upload, Loader2, CheckCircle, AlertTriangle, Cloud, Server } from 'lucide-react';
import { api } from '../services/api';
import { uploadChurchMediaFile } from '../utils/uploader';
import { downloadMediaFile } from '../utils/downloader';
import type { PhotoAlbum, PhotoItem } from '../types';

export const PhotosView: React.FC = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadAlbumId, setUploadAlbumId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [storageTarget, setStorageTarget] = useState<'auto' | 'firebase' | 'server'>('auto');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAlbums = () => {
    api.getPhotoAlbums().then(res => {
      setAlbums(res.albums);
      if (res.albums.length > 0 && !uploadAlbumId) {
        setUploadAlbumId(res.albums[0].id);
      }
    }).catch(() => {});
  };

  const fetchPhotos = (albumId: string) => {
    api.getPhotos(albumId).then(res => setPhotos(res.photos)).catch(() => {});
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    fetchPhotos(selectedAlbumId);
  }, [selectedAlbumId]);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    console.log('[PhotosView] Selected photo file:', {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type,
      storageTarget,
    });
    setUploadFile(file);
    setUploadError('');
    setUploadSuccess('');
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleUploadSubmit = async (e: React.FormEvent, overrideTarget?: 'auto' | 'firebase' | 'server') => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('कृपया फोटो फ़ाइल चुनें।');
      return;
    }

    const activeTarget = overrideTarget || storageTarget;
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    console.log('[PhotosView] Initiating photo upload:', {
      fileName: uploadFile.name,
      size: uploadFile.size,
      storageTarget: activeTarget,
      title: uploadTitle,
      albumId: uploadAlbumId,
    });

    try {
      const { url, provider } = await uploadChurchMediaFile(
        uploadFile,
        {
          category: 'Church Photo Gallery',
          type: 'image',
          storageTarget: activeTarget,
          description: uploadDescription || `Church photo ${uploadTitle}`,
        },
        (percent, message) => {
          setUploadProgress(`${message} (${percent}%)`);
        }
      );

      console.log(`[PhotosView] Photo uploaded successfully via ${provider}. URL:`, url);

      const targetAlbum = uploadAlbumId || (albums[0] ? albums[0].id : 'album_1');

      console.log('[PhotosView] Adding photo metadata to album:', targetAlbum);
      await api.addPhoto({
        albumId: targetAlbum,
        title: uploadTitle.trim() || uploadFile.name,
        url,
        description: uploadDescription.trim(),
      });

      const providerLabel = provider === 'firebase' ? 'Firebase Cloud Storage' : 'Church Server Storage';
      setUploadSuccess(`फोटो सफलतापूर्वक ${providerLabel} पर अपलोड होकर गैलरी में जुड़ गई!`);
      fetchPhotos(selectedAlbumId);
      fetchAlbums();
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadFile(null);
        setPreviewUrl('');
        setUploadTitle('');
        setUploadDescription('');
        setUploadSuccess('');
      }, 1400);
    } catch (err: any) {
      console.error('[PhotosView] Upload process failed:', {
        message: err.message,
        firebaseCode: err.firebaseCode,
        errorObj: err,
      });

      let displayMessage = err.message || 'फोटो अपलोड करने में त्रुटि हुई।';
      if (err.firebaseCode === 'storage/unauthorized' || displayMessage.includes('unauthorized') || displayMessage.includes('अनुमति अस्वीकृत')) {
        displayMessage = 'Firebase Storage अनुमति अस्वीकृत (403 Unauthorized): स्टोरेज रूल्स ने अपलोड अस्वीकार कर दिया। आप नीचे दिए गए "Church Server से पुनः प्रयास करें" बटन से तुरंत अपलोड कर सकते हैं।';
      }
      setUploadError(displayMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    } else if (activePhotoIndex === 0) {
      setActivePhotoIndex(photos.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null && activePhotoIndex < photos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    } else if (activePhotoIndex === photos.length - 1) {
      setActivePhotoIndex(0);
    }
  };

  const currentPhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  return (
    <div id="photos-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Camera className="w-3.5 h-3.5" /> Visual Moments of Glory
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white">CHURCH PHOTO GALLERY</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Relive powerful worship services, joyful community celebrations, baptisms, conferences, and missions through our high-resolution photo archives.
        </p>
      </div>

      {/* Album Selector Filter & Upload Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedAlbumId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedAlbumId === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Photos ({photos.length})
          </button>
          {albums.map(alb => (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbumId(alb.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedAlbumId === alb.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {alb.title} ({alb.photosCount})
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setIsUploadOpen(true);
            setUploadError('');
            setUploadSuccess('');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          फोटो अपलोड करें (Upload Photo)
        </button>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                if (!isUploading) {
                  setIsUploadOpen(false);
                  setUploadFile(null);
                  setPreviewUrl('');
                }
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cinzel">गैलरी में फोटो अपलोड करें</h3>
                <p className="text-xs text-slate-400">Upload high-res moments to church gallery</p>
              </div>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-300">अपलोड विफलता विवरण (Upload Error Details):</p>
                    <p className="leading-relaxed">{uploadError}</p>
                  </div>
                </div>
                {(uploadError.includes('Firebase') || uploadError.includes('unauthorized') || uploadError.includes('अस्वीकृत')) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      setStorageTarget('server');
                      handleUploadSubmit(e, 'server');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Server className="w-3.5 h-3.5" />
                    Church Fast Server स्टोरेज से तुरंत पुनः प्रयास करें
                  </button>
                )}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Storage Provider Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">स्टोरेज प्रदाता (Storage Engine)</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setStorageTarget('auto')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                      storageTarget === 'auto' || storageTarget === 'server'
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    Church Server (तेज़)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorageTarget('firebase')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                      storageTarget === 'firebase'
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    Firebase Storage
                  </button>
                </div>
              </div>
              {/* File picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-5 text-center cursor-pointer transition bg-slate-950/40 flex flex-col items-center justify-center min-h-[140px]"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-36 max-w-full mx-auto rounded-lg object-contain shadow"
                    />
                    <p className="text-[11px] text-amber-400">फ़ाइल बदलने के लिए क्लिक करें ({uploadFile?.name})</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-amber-400/80 mb-2" />
                    <p className="text-xs font-semibold text-slate-200">फोटो चुनने के लिए यहां क्लिक करें</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP (फ़ोन से खींची गई फोटो स्वतः ऑप्टिमाइज़ होगी)</p>
                  </>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">फोटो का शीर्षक (Title)</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="उदा. Sunday Worship, Youth Gathering..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Album */}
              {albums.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">एल्बम चुनें (Select Album)</label>
                  <select
                    value={uploadAlbumId}
                    onChange={e => setUploadAlbumId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {albums.map(alb => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">विवरण / कैप्शन (Description - Optional)</label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={e => setUploadDescription(e.target.value)}
                  placeholder="फोटो के बारे में कुछ शब्द लिखें..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress || 'फोटो अपलोड हो रही है...'}</span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 transition"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      अपलोडिंग...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      गैलरी में जोड़ें (Upload)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm">No photos uploaded in this album yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition shadow-lg"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <h4 className="font-bold text-white text-sm truncate">{photo.title}</h4>
                {photo.description && (
                  <p className="text-xs text-slate-300 truncate mt-0.5">{photo.description}</p>
                )}
                <span className="text-[10px] text-amber-400 mt-1 block">Click to expand</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {currentPhoto && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white z-50"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/70 hover:bg-amber-500 hover:text-slate-950 text-white z-50 transition"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/70 hover:bg-amber-500 hover:text-slate-950 text-white z-50 transition"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Photo Content */}
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative"
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white space-y-2">
              <h3 className="text-lg font-bold font-cinzel">{currentPhoto.title}</h3>
              {currentPhoto.description && (
                <p className="text-xs text-slate-300 max-w-xl mx-auto">{currentPhoto.description}</p>
              )}
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-[11px] text-amber-400/80">
                  Photo {activePhotoIndex! + 1} of {photos.length}
                </span>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => downloadMediaFile(currentPhoto.url, `${currentPhoto.title || 'church-photo'}.jpg`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition"
                  title="Download Photo"
                >
                  <Download className="w-3.5 h-3.5" />
                  डाउनलोड (Download)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
