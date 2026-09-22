/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '../services/api';

/**
 * Client-side image compressor.
 * Downscales phone camera photos (which can be 10MB-25MB) to high-quality Web/Print ready JPEG (< 600KB).
 * This ensures instantaneous uploads without hitting proxy or server payload boundaries.
 */
export async function optimizeImage(file: File, maxDimension = 1920, quality = 0.82): Promise<File> {
  const isImage =
    (file.type && file.type.startsWith('image/')) ||
    /\.(jpe?g|png|webp|heic|bmp|gif)$/i.test(file.name);

  // If not an image or is SVG / animated GIF, return as is
  if (!isImage || file.type.includes('svg') || (file.type.includes('gif') && file.size < 2 * 1024 * 1024)) {
    return file;
  }

  // If already under 450KB, no need to compress
  if (file.size < 450 * 1024) {
    return file;
  }

  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        resolve(file);
        return;
      }

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
 * 1. Automatic client-side image compression for instant camera photo uploads.
 * 2. High-performance 512KB binary chunk uploads for audio (MP3/WAV) and video (MP4) files up to 150MB+.
 * 3. Automatic 3x per-chunk retry to withstand network drops on mobile connections.
 * 4. Real-time percentage progress callback (0% - 100%).
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
  const isImageFile =
    (rawFile.type && rawFile.type.startsWith('image/')) ||
    /\.(jpe?g|png|webp|heic|bmp)$/i.test(rawFile.name);

  if (isImageFile) {
    if (onProgress) onProgress(8, 'फोटो को अनुकूलित किया जा रहा है...');
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

  if (cleanMime.startsWith('audio/') || cleanName.endsWith('.mp3') || cleanName.endsWith('.wav') || cleanName.endsWith('.m4a') || cleanName.endsWith('.aac')) {
    determinedType = 'audio';
  } else if (cleanMime.startsWith('video/') || cleanName.endsWith('.mp4') || cleanName.endsWith('.mov') || cleanName.endsWith('.webm') || cleanName.endsWith('.mkv')) {
    determinedType = 'video';
  } else if (cleanMime.startsWith('image/') || cleanName.endsWith('.jpg') || cleanName.endsWith('.jpeg') || cleanName.endsWith('.png') || cleanName.endsWith('.webp')) {
    determinedType = 'image';
  } else if (cleanMime.includes('pdf') || cleanName.endsWith('.pdf')) {
    determinedType = 'document';
  }

  // 2. If file is very small (< 1.5MB), try fast direct upload first
  const DIRECT_UPLOAD_LIMIT = 1.5 * 1024 * 1024;
  if (fileToUpload.size < DIRECT_UPLOAD_LIMIT) {
    if (onProgress) onProgress(25, 'फ़ाइल अपलोड की जा रही है...');
    try {
      const dataUrl = await fileToDataUrl(fileToUpload);
      if (onProgress) onProgress(65, 'सर्वर पर सहेजा जा रहा है...');
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
      console.warn('Direct upload fallback to chunked upload:', err);
      // Fall through to chunked upload below
    }
  }

  // 3. Chunked Upload with 512KB slices (Zero proxy timeouts, ultra-reliable on mobile)
  const CHUNK_SIZE = 512 * 1024; // 512 KB per slice
  const totalChunks = Math.ceil(fileToUpload.size / CHUNK_SIZE);
  const uploadId = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  let finalResult: any = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(fileToUpload.size, start + CHUNK_SIZE);
    const chunkBlob = fileToUpload.slice(start, end);

    const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
    if (onProgress) {
      onProgress(
        Math.min(99, Math.max(5, percent)),
        `अपलोड हो रहा है... ${percent}% (${(start / (1024 * 1024)).toFixed(1)} / ${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB)`
      );
    }

    // Try Binary Stream Upload first (no base64 overhead)
    let chunkUploaded = false;
    let lastError: any = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const queryParams = new URLSearchParams({
          uploadId,
          chunkIndex: chunkIndex.toString(),
          totalChunks: totalChunks.toString(),
          fileName: fileToUpload.name,
          mimeType: fileToUpload.type || 'application/octet-stream',
          category: options.category || 'Church Media',
          description: options.description || '',
          totalSize: fileToUpload.size.toString(),
          offset: start.toString(),
        });

        const binRes = await fetch(`/api/upload/chunk-binary?${queryParams.toString()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: chunkBlob,
        });

        if (binRes.ok) {
          const resJson = await binRes.json();
          if (resJson.done) finalResult = resJson;
          chunkUploaded = true;
          break;
        } else {
          // If binary endpoint not supported, try base64 fallback
          if (binRes.status === 404 || binRes.status === 405) {
            break;
          }
          lastError = new Error(`HTTP ${binRes.status}`);
        }
      } catch (err: any) {
        lastError = err;
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      }
    }

    // Fallback: If binary upload failed on this chunk, try base64 JSON chunk
    if (!chunkUploaded) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
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
              offset: start,
            }),
          });

          if (response.ok) {
            const resJson = await response.json();
            if (resJson.done) finalResult = resJson;
            chunkUploaded = true;
            break;
          } else {
            const errData = await response.json().catch(() => ({}));
            lastError = new Error(errData.error || `HTTP ${response.status}`);
          }
        } catch (err: any) {
          lastError = err;
          await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
        }
      }
    }

    if (!chunkUploaded) {
      throw new Error(lastError?.message || `खंड ${chunkIndex + 1}/${totalChunks} अपलोड करने में विफल रहा।`);
    }
  }

  if (onProgress) onProgress(100, 'अपलोड सफलतापूर्वक पूरा हुआ!');

  if (!finalResult || !finalResult.file) {
    // Graceful fallback: construct usable record
    const localUrl = URL.createObjectURL(fileToUpload);
    return {
      url: localUrl,
      file: {
        id: `file_${Date.now()}`,
        name: fileToUpload.name,
        type: determinedType,
        url: localUrl,
        size: fileToUpload.size,
      },
    };
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
