/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal media downloader for MP3 audio and MP4/WebM video files.
 * Handles:
 * 1. Base64 data URLs (data:audio/..., data:video/...)
 * 2. Blob URLs (blob:...)
 * 3. Cross-origin remote URLs via client-side fetch or server-side /api/download proxy
 */
export async function downloadMediaFile(url: string, defaultFilename: string): Promise<boolean> {
  if (!url) {
    alert('डाउनलोड लिंक उपलब्ध नहीं है (Download URL not available)');
    return false;
  }

  // Sanitize filename
  let filename = (defaultFilename || 'download')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim();

  // 0. If local /uploads/ URL or server-hosted file, download directly via /api/download endpoint
  if (url.startsWith('/uploads/') || url.includes('/uploads/') || url.startsWith('/api/files/')) {
    const downloadEndpoint = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    triggerDownload(downloadEndpoint, filename);
    return true;
  }

  // 1. Base64 data URL
  if (url.startsWith('data:')) {
    try {
      const parts = url.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return true;
    } catch (e) {
      console.error('Data URL download error:', e);
    }
  }

  // 2. Blob URL
  if (url.startsWith('blob:')) {
    triggerDownload(url, filename);
    return true;
  }

  // 3. YouTube link detection (YouTube embeds/watch links cannot be downloaded as raw MP4 without an external service)
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Open the YouTube video in a new tab so user can watch or use YouTube offline/download feature
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }

  // 4. Try client-side fetch with CORS to create a local blob
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      return true;
    }
  } catch {
    // CORS or network failure: fallback to server-side proxy
  }

  // 5. Server-side proxy download (attaches Content-Disposition: attachment)
  try {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    triggerDownload(proxyUrl, filename);
    return true;
  } catch (err) {
    console.error('Proxy download failed:', err);
    triggerDownload(url, filename);
    return false;
  }
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
