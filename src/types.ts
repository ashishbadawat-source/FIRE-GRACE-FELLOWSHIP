/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'member' | 'admin';
export type AccountStatus = 'active' | 'blocked';

export interface UserProfile {
  id: string;
  memberId: string; // e.g. FGF10001
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  country: string;
  dob: string;
  gender: string;
  ministry?: string;
  sponsorId?: string; // referrer's memberId
  referralCode: string;
  profilePhoto?: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  referralPoints?: number;
  referredUsers?: any[];
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface ReferralRecord {
  id: string;
  sponsorId: string;
  sponsorName?: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  referredMobile: string;
  referredDate: string;
  status: AccountStatus;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  bibleReference: string;
  thumbnail: string;
  youtubeUrl: string;
  audioUrl?: string;
  downloadAllowed: boolean;
  downloadUrl?: string;
  category: string;
  featured?: boolean;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string;
  date: string;
  photosCount: number;
}

export interface PhotoItem {
  id: string;
  albumId: string;
  title: string;
  url: string;
  description?: string;
  featured?: boolean;
  date: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  thumbnail: string;
  date: string;
  speaker?: string;
  duration?: string;
}

export interface AudioSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  language: 'Hindi' | 'English' | 'Marathi' | 'Punjabi' | 'Tamil' | 'Telugu' | 'Other';
  category: 'Worship' | 'Praise' | 'Prayer & Intercession' | 'Revival Fire' | 'Deliverance' | 'Kids' | 'Choir';
  audioUrl: string;
  duration?: string;
  coverImage?: string;
  lyrics?: string;
  chordChartUrl?: string;
  downloadAllowed: boolean;
  downloadUrl?: string;
  playsCount?: number;
  likesCount?: number;
  dateAdded: string;
  featured?: boolean;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'document' | 'other';
  mimeType: string;
  size: number;
  url: string;
  category?: string;
  uploadedAt: string;
  uploadedBy?: string;
  description?: string;
}

export interface LiveStreamConfig {
  isLive: boolean;
  title: string;
  youtubeLiveUrl: string;
  facebookLiveUrl?: string;
  thumbnail: string;
  startTime?: string;
  endTime?: string;
  nextSchedule?: string;
  nextScheduleTitle: string;
  nextScheduleTime: string;
  countdownTarget: string;
  previousStreams: {
    id: string;
    title: string;
    date: string;
    youtubeUrl: string;
    thumbnail: string;
  }[];
}

export interface ChurchEvent {
  id: string;
  title: string;
  banner: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  speaker: string;
  description: string;
  registrationRequired: boolean;
  onlineOrOffline: 'Online' | 'Offline' | 'Hybrid' | 'In-Person';
  mapUrl?: string;
  linkUrl?: string;
  category?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle?: string;
  userId: string;
  memberId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  registeredAt: string;
}

export interface PrayerRequest {
  id: string;
  userId?: string;
  memberId?: string;
  name: string;
  email?: string;
  phone?: string;
  category: 'Healing' | 'Family' | 'Financial' | 'Spiritual' | 'Marriage' | 'Job' | 'Salvation' | 'Other';
  request: string;
  isPrivate: boolean;
  status: 'pending' | 'prayed' | 'archived';
  adminReply?: string;
  createdAt: string;
}

export interface ZoomMeeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomLink: string;
  meetingId: string;
  password?: string;
  showPassword: boolean;
  description: string;
}

export interface GoogleMeet {
  id: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  description: string;
}

export interface ChurchActivity {
  id: string;
  title: string;
  day: string;
  time: string;
  leader: string;
  venue: string;
  description: string;
  category: string;
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'event' | 'prayer' | 'live' | 'sermon';
  targetRole: 'all' | 'member';
  createdAt: string;
  readBy: string[]; // user IDs who marked read
}

export interface SocialLinks {
  youtube: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  telegram: string;
  x: string;
  website: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  welcomeText: string;
  churchDescription: string;
  heroBanner?: string;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeMessage?: string;
  pastorPhoto?: string;
  pastorName?: string;
  verseOfTheDay: {
    verse: string;
    book: string;
    chapter: number;
    verseNumber: number;
    text: string;
    reference?: string;
    version?: string;
    commentary?: string;
  };
  featuredSermonId?: string;
  featuredVideoId?: string;
  upcomingEventId?: string;
}

export interface ChurchSettings {
  churchName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapsEmbedUrl: string;
  serviceTimes: string[];
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament: 'Old' | 'New';
}

export interface BibleBook {
  name: string;
  hindiName: string;
  testament: 'Old' | 'New';
  chapters: number;
  category: string;
  categoryHindi: string;
  order: number;
}

export interface TestimonyItem {
  id: string;
  title: string;
  name: string;
  city?: string;
  category: 'Healing' | 'Deliverance' | 'Financial' | 'Family' | 'Salvation' | 'Miracle' | 'Other';
  categoryHindi?: string;
  content: string;
  verse?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  amenCount: number;
  date: string;
  verified?: boolean;
  featured?: boolean;
}

export interface BibleBookmark {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  note?: string;
  createdAt: string;
}

export type User = UserProfile;

export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalReferrals: number;
  totalPrayerRequests: number;
  totalEvents: number;
  totalSermons: number;
  totalPhotos: number;
  totalVideos: number;
  totalSongs?: number;
  isLive: boolean;
  pendingPrayers: number;
  unreadMessages: number;
  totalUsers?: number;
  activeUsers?: number;
  totalPrayers?: number;
}

export type FundType = 'tithe' | 'offering' | 'building' | 'missions' | 'thanksgiving' | 'charity';
export type PaymentChannel = 'google_pay' | 'phone_pe' | 'bank_transfer' | 'upi_qr';

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  userId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  fundType: FundType;
  paymentMethod: PaymentChannel;
  transactionReference: string;
  notes?: string;
  status: 'completed' | 'verified' | 'pending';
  date: string;
}

export interface ChurchPaymentDetails {
  churchName: string;
  taxId: string;
  googlePay: {
    upiId: string;
    number: string;
    accountName: string;
    qrCodeUrl: string;
  };
  phonePe: {
    upiId: string;
    number: string;
    accountName: string;
    qrCodeUrl: string;
  };
  bankAccount: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: string;
    ifscCode: string;
    routingNumber?: string;
    swiftBic?: string;
    branchName: string;
  };
  qrCodeAllInOne: string;
  contactSupport: string;
}

