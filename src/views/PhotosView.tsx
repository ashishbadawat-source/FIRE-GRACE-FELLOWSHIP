/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X, Download, Share2, Layers } from 'lucide-react';
import { api } from '../services/api';
import type { PhotoAlbum, PhotoItem } from '../types';

export const PhotosView: React.FC = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getPhotoAlbums().then(res => setAlbums(res.albums)).catch(() => {});
  }, []);

  useEffect(() => {
    api.getPhotos(selectedAlbumId).then(res => setPhotos(res.photos)).catch(() => {});
  }, [selectedAlbumId]);

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

      {/* Album Selector Filter */}
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
            <div className="mt-4 text-center text-white space-y-1">
              <h3 className="text-lg font-bold font-cinzel">{currentPhoto.title}</h3>
              {currentPhoto.description && (
                <p className="text-xs text-slate-300 max-w-xl mx-auto">{currentPhoto.description}</p>
              )}
              <span className="text-[11px] text-amber-400/80 block">
                Photo {activePhotoIndex! + 1} of {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
