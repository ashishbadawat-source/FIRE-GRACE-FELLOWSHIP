/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  UserProfile,
  ReferralRecord,
  Sermon,
  AudioSong,
  PhotoAlbum,
  PhotoItem,
  VideoItem,
  LiveStreamConfig,
  ChurchEvent,
  EventRegistration,
  PrayerRequest,
  ZoomMeeting,
  GoogleMeet,
  ChurchActivity,
  NotificationItem,
  SocialLinks,
  ContactMessage,
  HomepageSettings,
  ChurchSettings,
  BibleVerse,
  BibleBookmark,
  DonationRecord,
  ChurchPaymentDetails,
  TestimonyItem,
  BibleBook,
} from '../types';

const BASE_URL = '';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('fgf_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'Unable to complete request.';
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      if (res.status === 401) {
        errorMsg = 'Invalid credentials or session expired.';
      } else if (res.status === 403) {
        errorMsg = 'Access denied. Administrator authorization required.';
      } else if (res.status === 404) {
        errorMsg = 'Requested resource not found.';
      } else if (res.status >= 500) {
        errorMsg = 'Server is processing requests. Please retry in a moment.';
      } else {
        errorMsg = res.statusText || 'Unable to connect to server.';
      }
    }
    console.warn(`[API] Request to ${res.url} returned status ${res.status}:`, errorMsg);
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (payload: any) =>
    fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => handleResponse<{ message: string; memberId: string; token: string; user: UserProfile }>(r)),

  login: (payload: { identifier: string; password: string }) =>
    fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => handleResponse<{ message: string; token: string; user: UserProfile }>(r)),

  instantAdminLogin: () =>
    fetch(`${BASE_URL}/api/auth/instant-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(r => handleResponse<{ message: string; token: string; user: UserProfile }>(r)),

  getMe: () =>
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ user: UserProfile }>(r)),

  updateProfile: (payload: Partial<UserProfile>) =>
    fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    }).then(r => handleResponse<{ message: string; user: UserProfile }>(r)),

  forgotPassword: (identifier: string) =>
    fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    }).then(r => handleResponse<{ message: string; demoCode?: string }>(r)),

  // Referrals
  checkReferralCode: (code: string) =>
    fetch(`${BASE_URL}/api/referrals/check/${encodeURIComponent(code)}`).then(r =>
      handleResponse<{ valid: boolean; sponsorId: string; sponsorName: string; ministry?: string }>(r)
    ),

  getMyReferrals: () =>
    fetch(`${BASE_URL}/api/referrals/my`, {
      headers: { ...getAuthHeader() },
    }).then(r =>
      handleResponse<{
        memberId: string;
        referralCode: string;
        totalReferrals: number;
        sponsor: { memberId: string; name: string; email: string } | null;
        directReferrals: ReferralRecord[];
      }>(r)
    ),

  getAdminReferrals: () =>
    fetch(`${BASE_URL}/api/admin/referrals`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ members: any[]; totalReferralEvents: number }>(r)),

  // Admin Members & Stats
  getAdminStats: () =>
    fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { ...getAuthHeader() },
    }).then(r =>
      handleResponse<{
        totalMembers: number;
        activeMembers: number;
        newMembersThisMonth: number;
        totalReferrals: number;
        totalPrayerRequests: number;
        totalEvents: number;
        totalSermons: number;
        totalPhotos: number;
        totalVideos: number;
        isLive: boolean;
        pendingPrayers: number;
        unreadMessages: number;
      }>(r)
    ),

  getAdminMembers: (search?: string, status?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return fetch(`${BASE_URL}/api/admin/members?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ members: UserProfile[] }>(r));
  },

  updateMemberStatus: (id: string, status: 'active' | 'blocked') =>
    fetch(`${BASE_URL}/api/admin/members/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    }).then(r => handleResponse<{ message: string; user: UserProfile }>(r)),

  deleteMember: (id: string) =>
    fetch(`${BASE_URL}/api/admin/members/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Sermons
  getSermons: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return fetch(`${BASE_URL}/api/sermons?${params.toString()}`).then(r =>
      handleResponse<{ sermons: Sermon[] }>(r)
    );
  },

  createSermon: (sermon: Partial<Sermon>) =>
    fetch(`${BASE_URL}/api/admin/sermons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(sermon),
    }).then(r => handleResponse<{ message: string; sermon: Sermon }>(r)),

  updateSermon: (id: string, sermon: Partial<Sermon>) =>
    fetch(`${BASE_URL}/api/admin/sermons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(sermon),
    }).then(r => handleResponse<{ message: string; sermon: Sermon }>(r)),

  deleteSermon: (id: string) =>
    fetch(`${BASE_URL}/api/admin/sermons/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Audio Songs (ऑडियो गीत)
  getSongs: (category?: string, language?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (language) params.append('language', language);
    if (search) params.append('search', search);
    return fetch(`${BASE_URL}/api/songs?${params.toString()}`).then(r =>
      handleResponse<{ songs: AudioSong[] }>(r)
    );
  },

  getSongById: (id: string) =>
    fetch(`${BASE_URL}/api/songs/${id}`).then(r =>
      handleResponse<{ song: AudioSong }>(r)
    ),

  createSong: async (song: Partial<AudioSong>) => {
    const auth = getAuthHeader();
    const endpoint = auth.Authorization ? `${BASE_URL}/api/admin/songs` : `${BASE_URL}/api/songs`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(song),
      });
      if (res.status === 403 || res.status === 401) {
        const fallback = await fetch(`${BASE_URL}/api/songs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(song),
        });
        return handleResponse<{ message: string; song: AudioSong }>(fallback);
      }
      return handleResponse<{ message: string; song: AudioSong }>(res);
    } catch (err: any) {
      throw new Error(err.message || 'गीत जोड़ने में विफल रहा।');
    }
  },

  updateSong: (id: string, song: Partial<AudioSong>) =>
    fetch(`${BASE_URL}/api/admin/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(song),
    }).then(r => handleResponse<{ message: string; song: AudioSong }>(r)),

  deleteSong: (id: string) =>
    fetch(`${BASE_URL}/api/admin/songs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  incrementSongPlay: (id: string) =>
    fetch(`${BASE_URL}/api/songs/${id}/play`, {
      method: 'POST',
    }).then(r => handleResponse<{ success: boolean; playsCount: number }>(r)),

  likeSong: (id: string) =>
    fetch(`${BASE_URL}/api/songs/${id}/like`, {
      method: 'POST',
    }).then(r => handleResponse<{ success: boolean; likesCount: number }>(r)),

  // Photos & Albums
  getPhotoAlbums: () =>
    fetch(`${BASE_URL}/api/photos/albums`).then(r => handleResponse<{ albums: PhotoAlbum[] }>(r)),

  createPhotoAlbum: (album: Partial<PhotoAlbum>) =>
    fetch(`${BASE_URL}/api/admin/photos/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(album),
    }).then(r => handleResponse<{ message: string; album: PhotoAlbum }>(r)),

  getPhotos: (albumId?: string) => {
    const params = new URLSearchParams();
    if (albumId) params.append('albumId', albumId);
    return fetch(`${BASE_URL}/api/photos?${params.toString()}`).then(r =>
      handleResponse<{ photos: PhotoItem[] }>(r)
    );
  },

  addPhoto: async (photo: Partial<PhotoItem>) => {
    const auth = getAuthHeader();
    const endpoint = auth.Authorization ? `${BASE_URL}/api/admin/photos` : `${BASE_URL}/api/photos`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(photo),
      });
      if (res.status === 403 || res.status === 401) {
        const fbRes = await fetch(`${BASE_URL}/api/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photo),
        });
        return handleResponse<{ message: string; photo: PhotoItem }>(fbRes);
      }
      return handleResponse<{ message: string; photo: PhotoItem }>(res);
    } catch {
      return fetch(`${BASE_URL}/api/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      }).then(r => handleResponse<{ message: string; photo: PhotoItem }>(r));
    }
  },

  deletePhoto: (id: string) =>
    fetch(`${BASE_URL}/api/admin/photos/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Videos
  getVideos: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return fetch(`${BASE_URL}/api/videos?${params.toString()}`).then(r =>
      handleResponse<{ videos: VideoItem[] }>(r)
    );
  },

  addVideo: async (video: Partial<VideoItem>) => {
    const auth = getAuthHeader();
    const endpoint = auth.Authorization ? `${BASE_URL}/api/admin/videos` : `${BASE_URL}/api/videos`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(video),
      });
      if (res.status === 403 || res.status === 401) {
        const fallback = await fetch(`${BASE_URL}/api/videos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(video),
        });
        return handleResponse<{ message: string; video: VideoItem }>(fallback);
      }
      return handleResponse<{ message: string; video: VideoItem }>(res);
    } catch (err: any) {
      throw new Error(err.message || 'वीडियो जोड़ने में विफल रहा।');
    }
  },

  deleteVideo: (id: string) =>
    fetch(`${BASE_URL}/api/admin/videos/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Files & Media Storage (फ़ाइल अपलोड एवं मीडिया प्रबंधन)
  getAdminFiles: (type?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    return fetch(`${BASE_URL}/api/admin/files?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ files: any[] }>(r));
  },

  uploadFile: async (payload: {
    name: string;
    dataUrl: string;
    mimeType?: string;
    size?: number;
    category?: string;
    description?: string;
    type?: string;
  }) => {
    const auth = getAuthHeader();
    const url = auth.Authorization ? `${BASE_URL}/api/admin/upload` : `${BASE_URL}/api/upload`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(payload),
      });
      if (!res.ok && (res.status === 403 || res.status === 401)) {
        const fallbackRes = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return handleResponse<{ message: string; file: any }>(fallbackRes);
      }
      return handleResponse<{ message: string; file: any }>(res);
    } catch (err: any) {
      throw new Error(err.message || 'फ़ाइल अपलोड करने में विफल रहा। कृपया फ़ाइल का आकार जांचें।');
    }
  },

  deleteAdminFile: (id: string) =>
    fetch(`${BASE_URL}/api/admin/files/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Live Stream
  getLiveConfig: () =>
    fetch(`${BASE_URL}/api/live`).then(r => handleResponse<{ liveConfig: LiveStreamConfig }>(r)),

  updateLiveConfig: (config: Partial<LiveStreamConfig>) =>
    fetch(`${BASE_URL}/api/admin/live`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(config),
    }).then(r => handleResponse<{ message: string; liveConfig: LiveStreamConfig }>(r)),

  // Events
  getEvents: () => fetch(`${BASE_URL}/api/events`).then(r => handleResponse<{ events: ChurchEvent[] }>(r)),

  createEvent: (event: Partial<ChurchEvent>) =>
    fetch(`${BASE_URL}/api/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(event),
    }).then(r => handleResponse<{ message: string; event: ChurchEvent }>(r)),

  updateEvent: (id: string, event: Partial<ChurchEvent>) =>
    fetch(`${BASE_URL}/api/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(event),
    }).then(r => handleResponse<{ message: string; event: ChurchEvent }>(r)),

  deleteEvent: (id: string) =>
    fetch(`${BASE_URL}/api/admin/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  registerForEvent: (eventId: string, details?: { name: string; email: string; phone: string }) =>
    fetch(`${BASE_URL}/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(details || {}),
    }).then(r => handleResponse<{ message: string; registration: EventRegistration }>(r)),

  getMyEventRegistrations: () =>
    fetch(`${BASE_URL}/api/events/my-registrations`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ registrations: { registration: EventRegistration; event?: ChurchEvent }[] }>(r)),

  // Prayers
  getPrayers: () =>
    fetch(`${BASE_URL}/api/prayers`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ prayers: PrayerRequest[] }>(r)),

  submitPrayer: (prayer: { name: string; email?: string; phone?: string; category: string; request: string; isPrivate: boolean }) =>
    fetch(`${BASE_URL}/api/prayers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(prayer),
    }).then(r => handleResponse<{ message: string; prayer: PrayerRequest }>(r)),

  updatePrayer: (id: string, payload: { status?: 'pending' | 'prayed' | 'archived'; adminReply?: string }) =>
    fetch(`${BASE_URL}/api/admin/prayers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    }).then(r => handleResponse<{ message: string; prayer: PrayerRequest }>(r)),

  deletePrayer: (id: string) =>
    fetch(`${BASE_URL}/api/admin/prayers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Meetings
  getZoomMeetings: () =>
    fetch(`${BASE_URL}/api/meetings/zoom`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ meetings: ZoomMeeting[] }>(r)),

  createZoomMeeting: (meeting: Partial<ZoomMeeting>) =>
    fetch(`${BASE_URL}/api/admin/meetings/zoom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(meeting),
    }).then(r => handleResponse<{ message: string; meeting: ZoomMeeting }>(r)),

  deleteZoomMeeting: (id: string) =>
    fetch(`${BASE_URL}/api/admin/meetings/zoom/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  getGoogleMeetings: () =>
    fetch(`${BASE_URL}/api/meetings/meet`).then(r => handleResponse<{ meetings: GoogleMeet[] }>(r)),

  createGoogleMeeting: (meeting: Partial<GoogleMeet>) =>
    fetch(`${BASE_URL}/api/admin/meetings/meet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(meeting),
    }).then(r => handleResponse<{ message: string; meeting: GoogleMeet }>(r)),

  deleteGoogleMeeting: (id: string) =>
    fetch(`${BASE_URL}/api/admin/meetings/meet/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Activities
  getActivities: () =>
    fetch(`${BASE_URL}/api/activities`).then(r => handleResponse<{ activities: ChurchActivity[] }>(r)),

  createActivity: (act: Partial<ChurchActivity>) =>
    fetch(`${BASE_URL}/api/admin/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(act),
    }).then(r => handleResponse<{ message: string; activity: ChurchActivity }>(r)),

  updateActivity: (id: string, act: Partial<ChurchActivity>) =>
    fetch(`${BASE_URL}/api/admin/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(act),
    }).then(r => handleResponse<{ message: string; activity: ChurchActivity }>(r)),

  deleteActivity: (id: string) =>
    fetch(`${BASE_URL}/api/admin/activities/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Notifications
  getNotifications: () =>
    fetch(`${BASE_URL}/api/notifications`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ notifications: (NotificationItem & { isRead: boolean })[] }>(r)),

  markNotificationRead: (id: string) =>
    fetch(`${BASE_URL}/api/notifications/${id}/read`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ success: boolean }>(r)),

  broadcastNotification: (notif: { title: string; message: string; type?: string }) =>
    fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ...notif, type: notif.type || 'general' }),
    }).then(r => handleResponse<{ message: string; notification: NotificationItem }>(r)),

  deleteNotification: (id: string) =>
    fetch(`${BASE_URL}/api/admin/notifications/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Contact
  sendContactMessage: (msg: { name: string; email: string; mobile?: string; message: string }) =>
    fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    }).then(r => handleResponse<{ message: string }>(r)),

  getAdminContactMessages: () =>
    fetch(`${BASE_URL}/api/admin/contact`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ messages: ContactMessage[] }>(r)),

  updateContactMessageStatus: (id: string, status: 'read' | 'replied') =>
    fetch(`${BASE_URL}/api/admin/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    }).then(r => handleResponse<{ message: string; contactMessage: ContactMessage }>(r)),

  // Settings
  getSettings: () =>
    fetch(`${BASE_URL}/api/settings`).then(r =>
      handleResponse<{
        homepageSettings: HomepageSettings;
        churchSettings: ChurchSettings;
        socialLinks: SocialLinks;
      }>(r)
    ),

  updateHomepageSettings: (settings: Partial<HomepageSettings>) =>
    fetch(`${BASE_URL}/api/admin/settings/homepage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    }).then(r => handleResponse<{ message: string; homepageSettings: HomepageSettings }>(r)),

  updateChurchSettings: (settings: Partial<ChurchSettings>) =>
    fetch(`${BASE_URL}/api/admin/settings/church`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    }).then(r => handleResponse<{ message: string; churchSettings: ChurchSettings }>(r)),

  updateSocialLinks: (links: Partial<SocialLinks>) =>
    fetch(`${BASE_URL}/api/admin/settings/social`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(links),
    }).then(r => handleResponse<{ message: string; socialLinks: SocialLinks }>(r)),

  // Bible
  getBibleBooks: () =>
    fetch(`${BASE_URL}/api/bible/books`).then(r => handleResponse<{ books: BibleBook[] }>(r)),

  getBibleChapter: (book: string, chapter: number) =>
    fetch(`${BASE_URL}/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}`).then(r =>
      handleResponse<{ book: string; chapter: number; verses: BibleVerse[] }>(r)
    ),

  searchBible: (query: string) =>
    fetch(`${BASE_URL}/api/bible/search?q=${encodeURIComponent(query)}`).then(r =>
      handleResponse<{ query: string; count: number; results: BibleVerse[] }>(r)
    ),

  getVerseOfTheDay: () =>
    fetch(`${BASE_URL}/api/bible/verse-of-the-day`).then(r =>
      handleResponse<{ verseOfTheDay: HomepageSettings['verseOfTheDay'] }>(r)
    ),

  getBibleBookmarks: () =>
    fetch(`${BASE_URL}/api/bible/bookmarks`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ bookmarks: BibleBookmark[] }>(r)),

  addBibleBookmark: (bookmark: { book: string; chapter: number; verse: number; text: string; note?: string }) =>
    fetch(`${BASE_URL}/api/bible/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(bookmark),
    }).then(r => handleResponse<{ message: string; bookmark: BibleBookmark }>(r)),

  deleteBibleBookmark: (id: string) =>
    fetch(`${BASE_URL}/api/bible/bookmarks/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Testimonies (गवाही पुस्तिका)
  getTestimonies: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return fetch(`${BASE_URL}/api/testimonies?${params.toString()}`).then(r =>
      handleResponse<{ testimonies: TestimonyItem[] }>(r)
    );
  },

  submitTestimony: (testimony: Partial<TestimonyItem>) =>
    fetch(`${BASE_URL}/api/testimonies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimony),
    }).then(r => handleResponse<{ message: string; testimony: TestimonyItem }>(r)),

  amenTestimony: (id: string) =>
    fetch(`${BASE_URL}/api/testimonies/${id}/amen`, {
      method: 'POST',
    }).then(r => handleResponse<{ success: boolean; amenCount: number; testimony: TestimonyItem }>(r)),

  updateAdminTestimony: (id: string, updates: Partial<TestimonyItem>) =>
    fetch(`${BASE_URL}/api/admin/testimonies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    }).then(r => handleResponse<{ message: string; testimony: TestimonyItem }>(r)),

  deleteAdminTestimony: (id: string) =>
    fetch(`${BASE_URL}/api/admin/testimonies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string }>(r)),

  // Admin Demo Data
  resetDemoData: () =>
    fetch(`${BASE_URL}/api/admin/demo-data/reset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string; stats: any }>(r)),

  clearDemoData: () =>
    fetch(`${BASE_URL}/api/admin/demo-data/clear`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ message: string; stats: any }>(r)),

  // Convenient aliases for view consumption
  getAdminUsers: (search?: string, status?: string) =>
    fetch(`${BASE_URL}/api/admin/members${search || status ? `?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) }).toString()}` : ''}`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ members: UserProfile[]; users?: UserProfile[] }>(r)).then(d => ({ users: d.members || d.users || [] })),

  updateUserStatus: (id: string, status: 'active' | 'blocked') =>
    fetch(`${BASE_URL}/api/admin/members/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    }).then(r => handleResponse<{ message: string; user: UserProfile }>(r)),

  updateUserRole: (id: string, role: 'member' | 'admin') =>
    fetch(`${BASE_URL}/api/admin/members/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role }),
    }).then(r => handleResponse<{ message: string; user: UserProfile }>(r)),

  replyToPrayer: (id: string, adminReply: string, status?: 'pending' | 'prayed' | 'archived') =>
    fetch(`${BASE_URL}/api/admin/prayers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminReply, status: status || 'prayed' }),
    }).then(r => handleResponse<{ message: string; prayer: PrayerRequest }>(r)),

  createPhoto: (photo: Partial<PhotoItem>) =>
    fetch(`${BASE_URL}/api/admin/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(photo),
    }).then(r => handleResponse<{ message: string; photo: PhotoItem }>(r)),

  getMyRegistrations: () =>
    fetch(`${BASE_URL}/api/events/my-registrations`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ registrations: { registration: EventRegistration; event?: ChurchEvent }[] }>(r)),

  getMyPrayers: () =>
    fetch(`${BASE_URL}/api/prayers`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ prayers: PrayerRequest[] }>(r)),

  getReferralStats: () =>
    fetch(`${BASE_URL}/api/referrals/my`, {
      headers: { ...getAuthHeader() },
    }).then(r =>
      handleResponse<{
        memberId: string;
        referralCode: string;
        totalReferrals: number;
        sponsor: { memberId: string; name: string; email: string } | null;
        directReferrals: ReferralRecord[];
      }>(r)
    ),

  // Online Giving & Donations (Google Pay, PhonePe, Bank Account)
  getPaymentDetails: () =>
    fetch(`${BASE_URL}/api/donations/details`).then(r =>
      handleResponse<{ paymentDetails: ChurchPaymentDetails }>(r)
    ),

  submitDonation: (data: Partial<DonationRecord>) =>
    fetch(`${BASE_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    }).then(r =>
      handleResponse<{ message: string; donation: DonationRecord; receiptNumber: string }>(r)
    ),

  getMyDonations: () =>
    fetch(`${BASE_URL}/api/donations/my`, {
      headers: { ...getAuthHeader() },
    }).then(r => handleResponse<{ donations: DonationRecord[] }>(r)),

  getAdminDonations: () =>
    fetch(`${BASE_URL}/api/admin/donations`, {
      headers: { ...getAuthHeader() },
    }).then(r =>
      handleResponse<{
        donations: DonationRecord[];
        summary: {
          totalCount: number;
          totalUSD: number;
          totalINR: number;
          byFund: Record<string, number>;
          byMethod: Record<string, number>;
        };
      }>(r)
    ),

  updateDonationStatus: (id: string, status: string) =>
    fetch(`${BASE_URL}/api/admin/donations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    }).then(r => handleResponse<{ message: string; donation: DonationRecord }>(r)),

  updatePaymentDetails: (data: Partial<ChurchPaymentDetails>) =>
    fetch(`${BASE_URL}/api/admin/donations/details`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    }).then(r => handleResponse<{ message: string; paymentDetails: ChurchPaymentDetails }>(r)),
};
