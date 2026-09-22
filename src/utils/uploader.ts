/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '../services/api';

/**
 * Client-side image compressor.
 * Downscales phone camera photos (which can be 10MB-25MB) to high-quality Web/Print ready JPEG (< 800KB).
 * This ensures instantaneous uploads without hitting Nginx or server payload boundaries.
 */
export async function optimizeImage(file: File, maxDimension = 1920, quality = 0.85): Promise<File> {
  // If not an image or is SVG / GIF, return as is
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  // If already under 600KB, no need to compress
  if (file.size < 600 * 1024) {
    return file;
  }

  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // fallback to original if compression didn't help
          } else {
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const optimized = new File([blob], cleanName, { type: 'image/jpeg', lastModified: Date.now() });
            resolve(optimized);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Universal Church File Uploader supporting:
 * 1. Automatic image optimization for instant photo uploads.
 * 2. Chunked file upload for large Audio (MP3/WAV) and Video (MP4) files up to 150MB+.
 * 3. Real-time live percentage progress callback (0% - 100%).
 */
export async function uploadChurchMediaFile(
  rawFile: File,
  options: {
    category?: string;
    description?: string;
    type?: 'audio' | 'video' | 'image' | 'document' | 'other';
  } = {},
  onProgress?: (percent: number, message: string) => void
): Promise<{ url: string; file: any }> {
  let fileToUpload = rawFile;

  // 1. Optimize Image if applicable
  if (rawFile.type.startsWith('image/')) {
    if (onProgress) onProgress(10, 'फोटो को अनुकूलित किया जा रहा है...');
    try {
      fileToUpload = await optimizeImage(rawFile);
    } catch {
      fileToUpload = rawFile;
    }
  }

  // Determine file type
  let determinedType: 'audio' | 'video' | 'image' | 'document' | 'other' = options.type || 'other';
  const cleanMime = (fileToUpload.type || '').toLowerCase();
  const cleanName = (fileToUpload.name || '').toLowerCase();

  if (cleanMime.startsWith('audio/') || cleanName.endsWith('.mp3') || cleanName.endsWith('.wav') || cleanName.endsWith('.m4a')) {
    determinedType = 'audio';
  } else if (cleanMime.startsWith('video/') || cleanName.endsWith('.mp4') || cleanName.endsWith('.mov') || cleanName.endsWith('.webm') || cleanName.endsWith('.mkv')) {
    determinedType = 'video';
  } else if (cleanMime.startsWith('image/') || cleanName.endsWith('.jpg') || cleanName.endsWith('.jpeg') || cleanName.endsWith('.png') || cleanName.endsWith('.webp')) {
    determinedType = 'image';
  } else if (cleanMime.includes('pdf') || cleanName.endsWith('.pdf')) {
    determinedType = 'document';
  }

  // 2. If file is small (< 6MB), try fast direct upload first
  const DIRECT_UPLOAD_LIMIT = 6 * 1024 * 1024;
  if (fileToUpload.size < DIRECT_UPLOAD_LIMIT) {
    if (onProgress) onProgress(30, 'फ़ाइल अपलोड की जा रही है...');
    try {
      const dataUrl = await fileToDataUrl(fileToUpload);
      if (onProgress) onProgress(70, 'सर्वर पर सहेजा जा रहा है...');
      const res = await api.uploadFile({
        name: fileToUpload.name,
        dataUrl,
        mimeType: fileToUpload.type,
        size: fileToUpload.size,
        category: options.category || 'Church Media',
        description: options.description || '',
        type: determinedType,
      });

      if (onProgress) onProgress(100, 'अपलोड पूर्ण!');
      return {
        url: res.file?.url || dataUrl,
        file: res.file,
      };
    } catch (err: any) {
      console.warn('Direct upload failed, falling back to chunked upload:', err);
      // Fall through to chunked upload below
    }
  }

  // 3. Chunked Upload (splits into 2.5MB slices to stay well below proxy limits)
  const CHUNK_SIZE = 2.5 * 1024 * 1024; // 2.5 MB chunks
  const totalChunks = Math.ceil(fileToUpload.size / CHUNK_SIZE);
  const uploadId = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  let finalResult: any = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(fileToUpload.size, start + CHUNK_SIZE);
    const chunkBlob = fileToUpload.slice(start, end);

    const percent = Math.round(((chunkIndex) / totalChunks) * 100);
    if (onProgress) {
      onProgress(
        Math.max(5, percent),
        `अपलोड हो रहा है... ${percent}% (${((start) / (1024 * 1024)).toFixed(1)} / ${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB)`
      );
    }

    const chunkBase64 = await fileToDataUrl(chunkBlob);

    const response = await fetch('/api/upload/chunk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadId,
        chunkIndex,
        totalChunks,
        fileName: fileToUpload.name,
        mimeType: fileToUpload.type,
        category: options.category || 'Church Media',
        description: options.description || '',
        chunkBase64,
        totalSize: fileToUpload.size,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `खंड ${chunkIndex + 1}/${totalChunks} अपलोड करने में विफल रहा।`);
    }

    const resJson = await response.json();
    if (resJson.done) {
      finalResult = resJson;
    }
  }

  if (onProgress) onProgress(100, 'अपलोड सफलतापूर्वक पूरा हुआ!');

  if (!finalResult || !finalResult.file) {
    throw new Error('सर्वर से अंतिम फ़ाइल प्रतिक्रिया प्राप्त नहीं हुई।');
  }

  return {
    url: finalResult.file.url,
    file: finalResult.file,
  };
}

/**
 * Converts a File or Blob into base64 data URL
 */
function fileToDataUrl(fileOrBlob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('फ़ाइल पढ़ने में त्रुटि हुई।'));
    reader.readAsDataURL(fileOrBlob);
  });
}
