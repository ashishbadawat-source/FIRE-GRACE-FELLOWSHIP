/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Users,
  Video,
  Music,
  Radio,
  Calendar,
  Heart,
  Camera,
  Bell,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Edit2,
  ExternalLink,
  MessageSquare,
  Lock,
  CreditCard,
  Building,
  QrCode,
  Check,
  X,
  DollarSign,
  Wallet,
  Play,
  Pause,
  FileText,
  Copy,
  Share2,
  Sparkles,
  UploadCloud,
  FolderUp,
  File,
  Film,
  Image as ImageIcon,
  Download,
  Search,
  HardDrive,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type {
  AdminStats,
  User as UserType,
  Sermon,
  AudioSong,
  ChurchEvent,
  PrayerRequest,
  LiveStreamConfig,
  ZoomMeeting,
  PhotoItem,
  DonationRecord,
  ChurchPaymentDetails,
  UploadedFileItem,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'stats' | 'files' | 'songs' | 'sermons' | 'photos' | 'donations' | 'users' | 'events' | 'live' | 'prayers' | 'meetings' | 'notify'
  >('stats');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [adminSongs, setAdminSongs] = useState<AudioSong[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [liveConfig, setLiveConfig] = useState<LiveStreamConfig | null>(null);
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<ChurchPaymentDetails | null>(null);
  const [donationFilter, setDonationFilter] = useState<'all' | 'pending' | 'verified' | 'completed'>('all');

  // File Upload Center State (फ़ाइल अपलोड केंद्र)
  const [adminFiles, setAdminFiles] = useState<UploadedFileItem[]>([]);
  const [fileFilterType, setFileFilterType] = useState<'all' | 'audio' | 'video' | 'image' | 'document'>('all');
  const [fileSearch, setFileSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('General Upload');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Church Payment Configuration form state
  const [gpayUpi, setGpayUpi] = useState('firegrace@okaxis');
  const [gpayPhone, setGpayPhone] = useState('+1 (555) 777-4722');
  const [gpayName, setGpayName] = useState('Fire & Grace Fellowship Ministries');
  const [phonePeUpi, setPhonePeUpi] = useState('firegracefellowship@ybl');
  const [phonePePhone, setPhonePePhone] = useState('+1 (555) 777-4722');
  const [phonePeName, setPhonePeName] = useState('Fire & Grace Fellowship Ministries');
  const [bankName, setBankName] = useState('First Grace Covenant Bank');
  const [bankAccName, setBankAccName] = useState('Fire & Grace Fellowship Sanctuary');
  const [bankAccNumber, setBankAccNumber] = useState('7770099881234');
  const [bankIfsc, setBankIfsc] = useState('FGFB0007777');
  const [bankBranch, setBankBranch] = useState('Kingdom Cathedral Branch, CA');
  const [bankRouting, setBankRouting] = useState('122000496');
  const [bankSwift, setBankSwift] = useState('FGFBUS66');

  const [statusMessage, setStatusMessage] = useState<string>('');

  // Form states
  // New Sermon / Video (वीडियो एवं प्रवचन)
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonSpeaker, setSermonSpeaker] = useState('Pastor David Emmanuel');
  const [sermonDate, setSermonDate] = useState(new Date().toISOString().split('T')[0]);
  const [sermonCategory, setSermonCategory] = useState('Sunday Sermon');
  const [sermonRef, setSermonRef] = useState('Romans 8:1-4');
  const [sermonDesc, setSermonDesc] = useState('');
  const [sermonThumb, setSermonThumb] = useState('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80');
  const [sermonYoutube, setSermonYoutube] = useState('https://www.youtube.com/embed/live_stream?channel=example');
  const [sermonAudioUrl, setSermonAudioUrl] = useState('');

  // New Audio Song (ऑडियो गीत)
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('Fire & Grace Worship Team');
  const [songAlbum, setSongAlbum] = useState('Ignited by Fire Vol. 1');
  const [songLanguage, setSongLanguage] = useState<AudioSong['language']>('Hindi');
  const [songCategory, setSongCategory] = useState<AudioSong['category']>('Worship');
  const [songAudioUrl, setSongAudioUrl] = useState('');
  const [songDuration, setSongDuration] = useState('04:30');
  const [songCover, setSongCover] = useState('https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80');
  const [songLyrics, setSongLyrics] = useState('');
  const [songDownloadAllowed, setSongDownloadAllowed] = useState(true);
  const [songFeatured, setSongFeatured] = useState(false);
  const [previewPlayingSongId, setPreviewPlayingSongId] = useState<string | null>(null);

  // New Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventVenue, setEventVenue] = useState('Main Cathedral');
  const [eventAddress, setEventAddress] = useState('777 Fire Grace Cathedral Way, Los Angeles');
  const [eventSpeaker, setEventSpeaker] = useState('Pastor David Emmanuel');
  const [eventCategory, setEventCategory] = useState('Sunday Worship');
  const [eventBanner, setEventBanner] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80');
  const [eventDesc, setEventDesc] = useState('');
  const [eventOnlineOrOffline, setEventOnlineOrOffline] = useState<'In-Person' | 'Online' | 'Hybrid'>('In-Person');

  // Live Stream Editor
  const [liveTitle, setLiveTitle] = useState('');
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [liveYoutube, setLiveYoutube] = useState('');
  const [liveFacebook, setLiveFacebook] = useState('');
  const [liveNextSchedule, setLiveNextSchedule] = useState('');

  // New Zoom Meeting
  const [zoomTitle, setZoomTitle] = useState('');
  const [zoomDate, setZoomDate] = useState('Every Tuesday');
  const [zoomStart, setZoomStart] = useState('7:00 PM');
  const [zoomEnd, setZoomEnd] = useState('8:30 PM');
  const [zoomLink, setZoomLink] = useState('https://zoom.us/j/1234567890');
  const [zoomId, setZoomId] = useState('777 888 9999');
  const [zoomPass, setZoomPass] = useState('FIRE2025');
  const [zoomDesc, setZoomDesc] = useState('');

  // New Photo (फोटो)
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80');
  const [photoAlbumId, setPhotoAlbumId] = useState('album-1');
  const [photoDesc, setPhotoDesc] = useState('');

  // Notification Broadcast
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');

  // Prayer Reply state
  const [replyPrayerId, setReplyPrayerId] = useState<string | null>(null);
  const [prayerReplyText, setPrayerReplyText] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const loadAllAdminData = async () => {
    try {
      const [sRes, uRes, smRes, sngRes, evRes, prRes, lvRes, zmRes, phRes, donRes, payRes, filRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getSermons('All'),
        api.getSongs(),
        api.getEvents(),
        api.getPrayers(),
        api.getLiveConfig(),
        api.getZoomMeetings(),
        api.getPhotos(),
        api.getAdminDonations(),
        api.getPaymentDetails(),
        api.getAdminFiles(),
      ]);
      setStats(sRes as any);
      setUsers(uRes.users);
      setSermons(smRes.sermons);
      setAdminSongs(sngRes.songs || []);
      setEvents(evRes.events);
      setPrayers(prRes.prayers);
      setLiveConfig(lvRes.liveConfig);
      if (lvRes.liveConfig) {
        setLiveTitle(lvRes.liveConfig.title);
        setIsLiveStream(lvRes.liveConfig.isLive);
        setLiveYoutube(lvRes.liveConfig.youtubeLiveUrl);
        setLiveFacebook(lvRes.liveConfig.facebookLiveUrl || '');
        setLiveNextSchedule(lvRes.liveConfig.nextSchedule || lvRes.liveConfig.nextScheduleTitle || '');
      }
      setZoomMeetings(zmRes.meetings);
      setPhotos(phRes.photos);
      setDonations(donRes.donations || []);
      setAdminFiles(filRes?.files || []);
      if (payRes.paymentDetails) {
        setPaymentConfig(payRes.paymentDetails);
        setGpayUpi(payRes.paymentDetails.googlePay?.upiId || 'firegrace@okaxis');
        setGpayPhone(payRes.paymentDetails.googlePay?.number || '+1 (555) 777-4722');
        setGpayName(payRes.paymentDetails.googlePay?.accountName || 'Fire Grace Fellowship Ministries');
        setPhonePeUpi(payRes.paymentDetails.phonePe?.upiId || 'firegracefellowship@ybl');
        setPhonePePhone(payRes.paymentDetails.phonePe?.number || '+1 (555) 777-4722');
        setPhonePeName(payRes.paymentDetails.phonePe?.accountName || 'Fire Grace Fellowship Ministries');
        setBankName(payRes.paymentDetails.bankAccount?.bankName || 'First Grace Covenant Bank');
        setBankAccName(payRes.paymentDetails.bankAccount?.accountName || 'Fire Grace Fellowship Sanctuary');
        setBankAccNumber(payRes.paymentDetails.bankAccount?.accountNumber || '7770099881234');
        setBankIfsc(payRes.paymentDetails.bankAccount?.ifscCode || 'FGFB0007777');
        setBankBranch(payRes.paymentDetails.bankAccount?.branchName || 'Kingdom Cathedral Branch, CA');
        setBankRouting(payRes.paymentDetails.bankAccount?.routingNumber || '122000496');
        setBankSwift(payRes.paymentDetails.bankAccount?.swiftBic || 'FGFBUS66');
      }
    } catch {
      // ignore
    }
  };

  // -------------------------------------------------------------------------
  // DIRECT FILE UPLOAD HANDLER (ऑडियो, वीडियो, फोटो, डॉक्युमेंट्स डायरेक्ट अपलोड)
  // -------------------------------------------------------------------------
  const handleDirectFileUpload = async (
    file: File,
    targetContext: 'song_audio' | 'song_cover' | 'sermon_video' | 'sermon_audio' | 'sermon_thumb' | 'photo' | 'event_banner' | 'general' = 'general',
    customCategory?: string
  ) => {
    if (!file) return;

    // Check size limit (e.g. 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`फ़ाइल का आकार 50MB से कम होना चाहिए। आपकी फाइल: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    setIsUploading(true);
    showNotification(`फ़ाइल अपलोड हो रही है: ${file.name}...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;

        let categoryTag = customCategory || uploadCategory;
        if (targetContext === 'song_audio') categoryTag = 'Worship Audio Song';
        if (targetContext === 'song_cover') categoryTag = 'Song Cover Art';
        if (targetContext === 'sermon_video') categoryTag = 'Sermon Video Recording';
        if (targetContext === 'sermon_audio') categoryTag = 'Sermon Audio Recording';
        if (targetContext === 'photo') categoryTag = 'Church Photo Gallery';
        if (targetContext === 'event_banner') categoryTag = 'Church Event Banner';

        const res = await api.uploadFile({
          name: file.name,
          dataUrl,
          mimeType: file.type,
          size: file.size,
          category: categoryTag,
          description: uploadDescription || `Uploaded via Admin Console for ${targetContext}`,
        });

        const uploadedUrl = res.file?.url || dataUrl;

        // Auto-assign to corresponding form inputs
        if (targetContext === 'song_audio') {
          setSongAudioUrl(uploadedUrl);
          if (!songTitle) {
            setSongTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
          showNotification(`🎵 ऑडियो गीत "${file.name}" सफलतापूर्वक अपलोड हो गया!`);
        } else if (targetContext === 'song_cover') {
          setSongCover(uploadedUrl);
          showNotification(`🖼️ गीत कवर फोटो सफलतापूर्वक अपलोड हो गई!`);
        } else if (targetContext === 'sermon_video') {
          setSermonYoutube(uploadedUrl);
          if (!sermonTitle) {
            setSermonTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
          showNotification(`🎬 वीडियो प्रवचन "${file.name}" सफलतापूर्वक अपलोड हो गया!`);
        } else if (targetContext === 'sermon_audio') {
          setSermonAudioUrl(uploadedUrl);
          showNotification(`🎙️ प्रवचन ऑडियो MP3 सफलतापूर्वक अपलोड हो गया!`);
        } else if (targetContext === 'sermon_thumb') {
          setSermonThumb(uploadedUrl);
          showNotification(`🖼️ वीडियो थंबनेल सफलतापूर्वक अपलोड हो गया!`);
        } else if (targetContext === 'photo') {
          setPhotoUrl(uploadedUrl);
          if (!photoTitle) {
            setPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
          showNotification(`📸 फोटो "${file.name}" सफलतापूर्वक अपलोड हो गई!`);
        } else if (targetContext === 'event_banner') {
          setEventBanner(uploadedUrl);
          showNotification(`🖼️ इवेंट बैनर सफलतापूर्वक अपलोड हो गया!`);
        } else {
          showNotification(`📁 फ़ाइल "${file.name}" सफलतापूर्वक अपलोड हो गई!`);
        }

        // Refresh admin files
        const fRes = await api.getAdminFiles();
        setAdminFiles(fRes.files || []);
        setIsUploading(false);
      };

      reader.onerror = () => {
        setIsUploading(false);
        alert('फ़ाइल पढ़ने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploading(false);
      alert(err.message || 'फ़ाइल अपलोड करने में विफल');
    }
  };

  const handleDeleteUploadedFile = async (id: string) => {
    if (!confirm('क्या आप निश्चित रूप से इस फाइल को हटाना चाहते हैं?')) return;
    try {
      await api.deleteAdminFile(id);
      showNotification('फ़ाइल हटा दी गई।');
      const fRes = await api.getAdminFiles();
      setAdminFiles(fRes.files || []);
    } catch (err: any) {
      alert(err.message || 'Failed to delete file');
    }
  };

  // Donation Status Update
  const handleUpdateDonationStatus = async (donationId: string, status: 'completed' | 'verified' | 'pending') => {
    try {
      await api.updateDonationStatus(donationId, status);
      showNotification(`Donation record updated to: ${status.toUpperCase()}`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update donation status');
    }
  };

  // Update Church Payment Details
  const handleSavePaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updatePaymentDetails({
        googlePay: {
          upiId: gpayUpi,
          number: gpayPhone,
          accountName: gpayName,
          qrCodeUrl: paymentConfig?.googlePay?.qrCodeUrl || '',
        },
        phonePe: {
          upiId: phonePeUpi,
          number: phonePePhone,
          accountName: phonePeName,
          qrCodeUrl: paymentConfig?.phonePe?.qrCodeUrl || '',
        },
        bankAccount: {
          bankName,
          accountName: bankAccName,
          accountNumber: bankAccNumber,
          accountType: 'Current / Checking Account',
          ifscCode: bankIfsc,
          branchName: bankBranch,
          routingNumber: bankRouting,
          swiftBic: bankSwift,
        },
      });
      showNotification('Church payment coordinates (Google Pay, PhonePe, Bank Account) updated successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save payment coordinates');
    }
  };

  // User Actions
  const handleToggleUserRole = async (targetUser: UserType) => {
    const newRole = targetUser.role === 'admin' ? 'member' : 'admin';
    try {
      await api.updateUserRole(targetUser.id, newRole);
      showNotification(`Updated ${targetUser.fullName}'s role to ${newRole}`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleToggleUserStatus = async (targetUser: UserType) => {
    const newStatus = targetUser.status === 'active' ? 'blocked' : 'active';
    try {
      await api.updateUserStatus(targetUser.id, newStatus);
      showNotification(`Updated ${targetUser.fullName}'s status to ${newStatus}`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Add Sermon
  const handleAddSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSermon({
        title: sermonTitle,
        speaker: sermonSpeaker,
        date: sermonDate,
        category: sermonCategory,
        bibleReference: sermonRef,
        description: sermonDesc,
        thumbnail: sermonThumb,
        youtubeUrl: sermonYoutube,
        audioUrl: sermonAudioUrl,
      });
      showNotification('New sermon published successfully!');
      setSermonTitle('');
      setSermonDesc('');
      setSermonAudioUrl('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add sermon');
    }
  };

  const handleDeleteSermon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;
    try {
      await api.deleteSermon(id);
      showNotification('Sermon deleted.');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete sermon');
    }
  };

  // Add Audio Song (ऑडियो गीत)
  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !songArtist.trim() || !songAudioUrl.trim()) {
      alert('गीत का शीर्षक (Title), गायक (Artist), और ऑडियो लिंक (Audio URL) आवश्यक हैं।');
      return;
    }
    try {
      await api.createSong({
        title: songTitle.trim(),
        artist: songArtist.trim(),
        album: songAlbum.trim(),
        language: songLanguage,
        category: songCategory,
        audioUrl: songAudioUrl.trim(),
        duration: songDuration.trim() || '04:30',
        coverImage: songCover.trim(),
        lyrics: songLyrics.trim(),
        downloadAllowed: songDownloadAllowed,
        downloadUrl: songAudioUrl.trim(),
        featured: songFeatured,
      });
      showNotification('नया ऑडियो गीत सफलतापूर्वक जोड़ दिया गया है!');
      setSongTitle('');
      setSongLyrics('');
      setSongAudioUrl('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add audio song');
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm('क्या आप निश्चित रूप से इस ऑडियो गीत को हटाना चाहते हैं?')) return;
    try {
      await api.deleteSong(id);
      showNotification('ऑडियो गीत हटा दिया गया।');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete song');
    }
  };

  // Add Event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent({
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        venue: eventVenue,
        address: eventAddress,
        speaker: eventSpeaker,
        category: eventCategory,
        banner: eventBanner,
        description: eventDesc,
        registrationRequired: true,
        onlineOrOffline: eventOnlineOrOffline,
      });
      showNotification('Church event published successfully!');
      setEventTitle('');
      setEventDesc('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.deleteEvent(id);
      showNotification('Event removed.');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // Update Live Stream Config
  const handleUpdateLive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateLiveConfig({
        isLive: isLiveStream,
        title: liveTitle,
        youtubeLiveUrl: liveYoutube,
        facebookLiveUrl: liveFacebook,
        nextSchedule: liveNextSchedule,
        nextScheduleTitle: liveNextSchedule,
        nextScheduleTime: liveNextSchedule,
      });
      showNotification('Live broadcast settings saved and pushed to all viewers!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update live stream');
    }
  };

  // Prayer Reply
  const handleSendPrayerReply = async (prayerId: string) => {
    if (!prayerReplyText.trim()) return;
    try {
      await api.replyToPrayer(prayerId, prayerReplyText, 'prayed');
      showNotification('Pastoral reply sent and prayer marked as prayed!');
      setReplyPrayerId(null);
      setPrayerReplyText('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  // Add Zoom Meeting
  const handleAddZoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createZoomMeeting({
        title: zoomTitle,
        date: zoomDate,
        startTime: zoomStart,
        endTime: zoomEnd,
        zoomLink: zoomLink,
        meetingId: zoomId,
        password: zoomPass,
        description: zoomDesc,
      });
      showNotification('Zoom meeting session published!');
      setZoomTitle('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add meeting');
    }
  };

  // Add Photo
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPhoto({
        title: photoTitle,
        url: photoUrl,
        albumId: photoAlbumId,
        description: photoDesc,
      });
      showNotification('Photo published to church gallery!');
      setPhotoTitle('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add photo');
    }
  };

  // Broadcast Notification
  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle || !notifyMessage) return;
    try {
      await api.broadcastNotification({
        title: notifyTitle,
        message: notifyMessage,
      });
      showNotification('Broadcast announcement sent to all fellowship members!');
      setNotifyTitle('');
      setNotifyMessage('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Broadcast failed');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-24 text-center space-y-4">
        <Lock className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold font-cinzel text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          This portal is restricted to authorized pastoral leaders and administrators.
        </p>
      </div>
    );
  }

  return (
    <div id="admin-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                MASTER ADMIN PORTAL
              </span>
            </div>
            <h1 className="text-2xl font-bold font-cinzel text-white mt-1">CHURCH MANAGEMENT SYSTEM</h1>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Quick Media & Upload Action Hub */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <FolderUp className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">त्वरित एडमिन अपलोड हब (Quick Upload Actions):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? 'अपलोड हो रहा है...' : '📁 कोई भी फ़ाइल अपलोड करें (Upload File)'}</span>
            <input
              type="file"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleDirectFileUpload(file, 'general');
              }}
            />
          </label>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md">
            <Music className="w-3.5 h-3.5" />
            <span>🎵 ऑडियो गीत MP3</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  handleDirectFileUpload(file, 'song_audio');
                  setActiveTab('songs');
                }
              }}
            />
          </label>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md">
            <Video className="w-3.5 h-3.5" />
            <span>🎬 वीडियो / प्रवचन</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  handleDirectFileUpload(file, 'sermon_video');
                  setActiveTab('sermons');
                }
              }}
            />
          </label>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md">
            <Camera className="w-3.5 h-3.5" />
            <span>📸 फोटो गैलरी</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  handleDirectFileUpload(file, 'photo');
                  setActiveTab('photos');
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'stats', label: 'Dashboard & Metrics', icon: Shield },
          { id: 'files', label: `📁 फ़ाइल अपलोड (${adminFiles.length})`, icon: FolderUp },
          { id: 'songs', label: `🎵 ऑडियो गीत (${adminSongs.length})`, icon: Music },
          { id: 'sermons', label: `🎬 वीडियो व प्रवचन (${sermons.length})`, icon: Video },
          { id: 'photos', label: `📸 फोटो गैलरी (${photos.length})`, icon: Camera },
          { id: 'donations', label: `Giving & Tithes (${donations.length})`, icon: CreditCard },
          { id: 'users', label: `Members (${users.length})`, icon: Users },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'live', label: 'Live Stream Setup', icon: Radio },
          { id: 'prayers', label: `Prayers & Altar (${prayers.length})`, icon: Heart },
          { id: 'meetings', label: 'Zoom & Meet Gatherings', icon: Users },
          { id: 'notify', label: 'Broadcast Announcements', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- FILES & MEDIA STORAGE TAB (फ़ाइल अपलोड एवं मीडिया प्रबंधन) ---------------- */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          {/* Header & Stats Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
                <FolderUp className="w-6 h-6 text-amber-400" /> फ़ाइल अपलोड एवं मीडिया स्टोरेज (Admin File & Media Vault)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                गीत (MP3), वीडियो प्रवचन (MP4), चर्च फोटो (JPG/PNG), और बुलेटिन/डॉक्युमेंट्स (PDF) को सीधे अपलोड करें और ऐप में उपयोग करें।
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAllAdminData}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
                title="रिफ्रेश करें"
              >
                <RefreshCw className="w-4 h-4" />
                <span>रिफ्रेश</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Box (Col 5) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" /> नई फ़ाइल अपलोड करें (Upload New File)
              </h3>

              {/* Drag & Drop Area */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleDirectFileUpload(file, 'general');
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-950/60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">फ़ाइल यहाँ खींचें और छोड़ें (Drag & Drop)</p>
                  <p className="text-xs text-slate-400 mt-1">ऑडियो MP3, वीडियो MP4, फोटो JPG/PNG, या PDF दस्तावेज़</p>
                </div>

                <label className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md">
                  <span>{isUploading ? 'अपलोड हो रहा है...' : 'कंप्यूटर / फोन से फ़ाइल चुनें (Browse File)'}</span>
                  <input
                    type="file"
                    disabled={isUploading}
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleDirectFileUpload(file, 'general');
                    }}
                  />
                </label>
                <span className="text-[10px] text-slate-500">अधिकतम आकार: 50 MB प्रति फ़ाइल</span>
              </div>

              {/* Upload Configuration */}
              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">श्रेणी (Category Tag)</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="General Upload">सामान्य अपलोड (General Media)</option>
                    <option value="Worship Audio Song">ऑडियो गीत (Worship Audio Song MP3)</option>
                    <option value="Sermon Video Recording">वीडियो प्रवचन (Sermon Video Recording MP4)</option>
                    <option value="Church Photo Gallery">चर्च फोटो (Church Photo Gallery JPG/PNG)</option>
                    <option value="Church Bulletin & PDF">चर्च बुलेटिन / PDF दस्तावेज़ (Church Document)</option>
                    <option value="Event Banner">इवेंट पोस्टर व बैनर (Event Poster/Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">विवरण / नोट (Description - Optional)</label>
                  <input
                    type="text"
                    value={uploadDescription}
                    onChange={e => setUploadDescription(e.target.value)}
                    placeholder="उदा. संडे सर्विस क्लिप, आराधना गीत MP3..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Supported Media Types Cards */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Music className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">ऑडियो गीत</span>
                    <span className="text-[10px] text-slate-400">MP3, WAV, M4A</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">वीडियो प्रवचन</span>
                    <span className="text-[10px] text-slate-400">MP4, WebM, MOV</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">फोटो व बैनर</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">दस्तावेज़ व PDF</span>
                    <span className="text-[10px] text-slate-400">PDF, DOCX, TXT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files Repository (Col 7) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-400" /> अपलोड की गई फ़ाइलें ({adminFiles.length})
                </h3>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  {(['all', 'audio', 'video', 'image', 'document'] as const).map(fType => (
                    <button
                      key={fType}
                      type="button"
                      onClick={() => setFileFilterType(fType)}
                      className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition ${
                        fileFilterType === fType
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fType === 'all' && 'सभी'}
                      {fType === 'audio' && '🎵 ऑडियो'}
                      {fType === 'video' && '🎬 वीडियो'}
                      {fType === 'image' && '📸 फोटो'}
                      {fType === 'document' && '📄 दस्तावेज'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={fileSearch}
                  onChange={e => setFileSearch(e.target.value)}
                  placeholder="फ़ाइल का नाम या श्रेणी खोजें..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Files List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {adminFiles
                  .filter(f => {
                    const matchType = fileFilterType === 'all' || f.type === fileFilterType;
                    const matchSearch =
                      !fileSearch ||
                      f.name?.toLowerCase().includes(fileSearch.toLowerCase()) ||
                      f.category?.toLowerCase().includes(fileSearch.toLowerCase()) ||
                      f.description?.toLowerCase().includes(fileSearch.toLowerCase());
                    return matchType && matchSearch;
                  })
                  .map(file => {
                    const formattedSize = file.size
                      ? file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${(file.size / 1024).toFixed(0)} KB`
                      : 'File';

                    return (
                      <div
                        key={file.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Type Icon / Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center">
                            {file.type === 'image' && (
                              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                            )}
                            {file.type === 'audio' && <Music className="w-5 h-5 text-cyan-400" />}
                            {file.type === 'video' && <Video className="w-5 h-5 text-rose-400" />}
                            {file.type === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                          </div>

                          {/* File Details */}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-white truncate">{file.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold text-[10px]">
                                {file.category || file.type}
                              </span>
                              <span className="font-mono">{formattedSize}</span>
                              <span className="text-slate-500">• {new Date(file.uploadedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            {file.description && (
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{file.description}</p>
                            )}

                            {/* Inline Audio Player for MP3 files */}
                            {file.type === 'audio' && (
                              <div className="mt-2">
                                <audio controls className="w-full h-7 rounded-lg">
                                  <source src={file.url} type={file.mimeType || 'audio/mpeg'} />
                                  Your browser does not support audio playback.
                                </audio>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end sm:self-center">
                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(file.url);
                              showNotification('फ़ाइल URL क्लिपबोर्ड पर कॉपी हो गया!');
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
                            title="URL कॉपी करें"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Copy URL</span>
                          </button>

                          {/* Direct convert buttons */}
                          {file.type === 'audio' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSongAudioUrl(file.url);
                                setSongTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                                setActiveTab('songs');
                                showNotification('गीत फॉर्म में ऑडियो सेट किया गया!');
                              }}
                              className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 text-[11px] font-semibold transition"
                              title="इस MP3 से गीत बनाएं"
                            >
                              + गीत बनाएं
                            </button>
                          )}

                          {file.type === 'video' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSermonYoutube(file.url);
                                setSermonTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                                setActiveTab('sermons');
                                showNotification('प्रवचन वीडियो सेट किया गया!');
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-[11px] font-semibold transition"
                              title="इस वीडियो से प्रवचन जोड़ें"
                            >
                              + वीडियो जोड़ें
                            </button>
                          )}

                          {file.type === 'image' && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoUrl(file.url);
                                setPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                                setActiveTab('photos');
                                showNotification('फोटो गैलरी फॉर्म में इमेज सेट की गई!');
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold transition"
                              title="गैलरी में जोड़ें"
                            >
                              + गैलरी में जोड़ें
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUploadedFile(file.id)}
                            className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition"
                            title="फ़ाइल हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {adminFiles.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                    <FolderUp className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>अभी तक कोई फ़ाइल अपलोड नहीं की गई है।</p>
                    <p className="text-slate-500 text-[11px]">ऊपर दिए गए बॉक्स से पहली फ़ाइल अपलोड करें।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STATS TAB ---------------- */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Members</span>
              <span className="text-2xl font-bold font-mono text-white block">
                {stats.totalMembers ?? stats.totalUsers ?? 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 block">
                {stats.activeMembers ?? stats.activeUsers ?? 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sermons Vault</span>
              <span className="text-2xl font-bold font-mono text-amber-400 block">{stats.totalSermons}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Audio Songs (गीत)</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 block">
                {stats.totalSongs ?? adminSongs.length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Church Events</span>
              <span className="text-2xl font-bold font-mono text-white block">{stats.totalEvents}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Prayer Petitions</span>
              <span className="text-2xl font-bold font-mono text-rose-400 block">
                {stats.totalPrayerRequests ?? stats.totalPrayers ?? 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Referrals</span>
              <span className="text-2xl font-bold font-mono text-blue-400 block">{stats.totalReferrals}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">System Health & Live Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Sanctuary Live State:</span>
                <span className={`font-bold mt-1 inline-block ${liveConfig?.isLive ? 'text-red-400' : 'text-slate-300'}`}>
                  {liveConfig?.isLive ? 'BROADCASTING LIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Security Mode:</span>
                <span className="font-bold text-emerald-400 mt-1 inline-block">PBKDF2 Password Hashing Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Database Storage:</span>
                <span className="font-bold text-amber-400 mt-1 inline-block">Persistent Server Store Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- USERS & REFERRAL NETWORK TAB ---------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Referral System Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs uppercase font-medium">Total Registered Members</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-white">{users.length}</span>
                <Users className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs uppercase font-medium">Total Referral Connections</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-emerald-400">
                  {users.filter(u => u.sponsorId).length}
                </span>
                <Share2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs uppercase font-medium">Total Kingdom Points Awarded</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-amber-300">
                  {users.reduce((acc, u) => acc + (u.referralPoints || 0), 0)} pts
                </span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs uppercase font-medium">Active Leaders</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-cyan-400">
                  {users.filter(u => u.role === 'admin').length}
                </span>
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Members & Referral Network Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-white">Church Members & Referral Tree</h2>
                <p className="text-xs text-slate-400">Track all members, sponsor IDs, referral downlines, and kingdom rewards</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Reward Rate: <strong className="text-amber-400">+50 Points</strong> / Referral</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Referral Code</th>
                    <th className="p-3">Sponsor ID</th>
                    <th className="p-3">Direct Invites</th>
                    <th className="p-3">Kingdom Points</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => {
                    const downlineCount = users.filter(sub => sub.sponsorId === u.memberId || sub.sponsorId === u.referralCode).length;
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                              alt={u.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <span className="font-bold text-white block">{u.fullName}</span>
                              <span className="text-[11px] text-slate-400">{u.email} • {u.mobile}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-400">{u.referralCode || u.memberId}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {u.sponsorId ? (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                              {u.sponsorId}
                            </span>
                          ) : (
                            <span className="text-slate-600 italic">Direct / Root</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-cyan-400 font-bold">
                          {downlineCount} souls
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">
                          {u.referralPoints || (downlineCount * 50)} pts
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                          >
                            Set as {u.role === 'admin' ? 'User' : 'Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] ${
                              u.status === 'active' ? 'bg-rose-950 text-rose-300 hover:bg-rose-900' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                            }`}
                          >
                            {u.status === 'active' ? 'Block' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SERMONS TAB ---------------- */}
      {activeTab === 'sermons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Sermon Form (Col 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Publish New Sermon
            </h3>

            <form onSubmit={handleAddSermon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Sermon Title *</label>
                <input
                  type="text"
                  required
                  value={sermonTitle}
                  onChange={e => setSermonTitle(e.target.value)}
                  placeholder="e.g. The Overcoming Believer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Preacher</label>
                  <input
                    type="text"
                    value={sermonSpeaker}
                    onChange={e => setSermonSpeaker(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={sermonDate}
                    onChange={e => setSermonDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={sermonCategory}
                    onChange={e => setSermonCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Sunday Sermon">Sunday Sermon</option>
                    <option value="Holy Spirit & Power">Holy Spirit & Power</option>
                    <option value="Grace & Righteousness">Grace & Righteousness</option>
                    <option value="Faith & Miracles">Faith & Miracles</option>
                    <option value="Revival Fire">Revival Fire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Bible Reference</label>
                  <input
                    type="text"
                    value={sermonRef}
                    onChange={e => setSermonRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">YouTube Video URL / Embed Link</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isUploading ? 'अपलोड हो रहा है...' : '📁 वीडियो फ़ाइल अपलोड करें'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'sermon_video');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={sermonYoutube}
                  onChange={e => setSermonYoutube(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... या अपलोड किया गया वीडियो"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">Audio Recording URL (वचन का ऑडियो लिंक - MP3)</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isUploading ? 'अपलोड हो रहा है...' : '🎙️ ऑडियो MP3 अपलोड करें'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'sermon_audio');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={sermonAudioUrl}
                  onChange={e => setSermonAudioUrl(e.target.value)}
                  placeholder="https://.../sermon.mp3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">Thumbnail Image URL</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>🖼️ थंबनेल अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'sermon_thumb');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={sermonThumb}
                  onChange={e => setSermonThumb(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sermonDesc}
                  onChange={e => setSermonDesc(e.target.value)}
                  placeholder="Key summary of this divine message..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Publish Sermon
              </button>
            </form>
          </div>

          {/* Existing Sermons List (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">Existing Sermons Vault ({sermons.length})</h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {sermons.map(sm => (
                <div
                  key={sm.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={sm.thumbnail} alt={sm.title} className="w-16 h-10 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{sm.title}</h4>
                      <span className="text-slate-400 text-[11px] block">
                        {sm.speaker} • {sm.bibleReference}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSermon(sm.id)}
                    className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300"
                    title="Delete Sermon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- AUDIO SONGS TAB (ऑडियो गीत) ---------------- */}
      {activeTab === 'songs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Song Form (Col 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> नया ऑडियो गीत जोड़ें (Add Audio Song)
            </h3>

            <form onSubmit={handleAddSong} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">गीत का शीर्षक (Song Title) *</label>
                <input
                  type="text"
                  required
                  value={songTitle}
                  onChange={e => setSongTitle(e.target.value)}
                  placeholder="उदा. येशु तेरा नाम, पवित्र आत्मा आ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">गायक / टीम (Artist) *</label>
                  <input
                    type="text"
                    required
                    value={songArtist}
                    onChange={e => setSongArtist(e.target.value)}
                    placeholder="Worship Team / Singer"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">एल्बम (Album)</label>
                  <input
                    type="text"
                    value={songAlbum}
                    onChange={e => setSongAlbum(e.target.value)}
                    placeholder="Ignited by Fire Vol. 1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">भाषा (Language)</label>
                  <select
                    value={songLanguage}
                    onChange={e => setSongLanguage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="English">English</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">श्रेणी (Category)</label>
                  <select
                    value={songCategory}
                    onChange={e => setSongCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Praise">Praise</option>
                    <option value="Revival Fire">Revival Fire</option>
                    <option value="Prayer & Intercession">Prayer</option>
                    <option value="Deliverance">Deliverance</option>
                    <option value="Kids">Kids</option>
                    <option value="Choir">Choir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">अवधि (Duration)</label>
                  <input
                    type="text"
                    value={songDuration}
                    onChange={e => setSongDuration(e.target.value)}
                    placeholder="04:30"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">ऑडियो लिंक (MP3 Audio URL) *</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'अपलोड हो रहा है...' : '📁 MP3 ऑडियो फ़ाइल अपलोड करें'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'song_audio');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  required
                  value={songAudioUrl}
                  onChange={e => setSongAudioUrl(e.target.value)}
                  placeholder="https://.../song.mp3 या ऊपर से सीधे MP3 अपलोड करें"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
                {/* Quick samples buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">सैंपल:</span>
                  {[
                    { label: 'Sample 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                    { label: 'Sample 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
                    { label: 'Sample 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
                  ].map((smp, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSongAudioUrl(smp.url)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                    >
                      {smp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">कवर इमेज URL (Cover Image)</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>🖼️ कवर फोटो अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'song_cover');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={songCover}
                  onChange={e => setSongCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">गीत के बोल (Lyrics - Optional)</label>
                <textarea
                  rows={4}
                  value={songLyrics}
                  onChange={e => setSongLyrics(e.target.value)}
                  placeholder="[मुखड़ा] येशु तेरा नाम सबसे ऊंचा है..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-sans"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={songDownloadAllowed}
                    onChange={e => setSongDownloadAllowed(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500"
                  />
                  <span>MP3 डाउनलोड की अनुमति दें (Allow Download)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={songFeatured}
                    onChange={e => setSongFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500"
                  />
                  <span>होमपेज पर विशेष बनाएं (Featured Spotlight)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                ऑडियो गीत प्रकाशित करें (Publish Song)
              </button>
            </form>
          </div>

          {/* Existing Songs List (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" /> ऑडियो गीत सूची ({adminSongs.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {adminSongs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  अभी तक कोई ऑडियो गीत नहीं जोड़ा गया है।
                </div>
              ) : (
                adminSongs.map(song => (
                  <div
                    key={song.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                        <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                        {previewPlayingSongId === song.id && (
                          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-white line-clamp-1">{song.title}</h4>
                        <span className="text-slate-400 text-[11px] block line-clamp-1">
                          {song.artist} • <span className="text-amber-400">{song.language}</span> • {song.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ⏱ {song.duration || '04:30'} • 🔥 {song.playsCount || 0} plays • ❤️ {song.likesCount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Audio Play Preview */}
                      <button
                        type="button"
                        onClick={() => {
                          if (previewPlayingSongId === song.id) {
                            setPreviewPlayingSongId(null);
                          } else {
                            setPreviewPlayingSongId(song.id);
                          }
                        }}
                        className={`p-2 rounded-lg transition ${
                          previewPlayingSongId === song.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="प्ले प्रीव्यू (Play Preview)"
                      >
                        {previewPlayingSongId === song.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(song.audioUrl);
                          showNotification('ऑडियो लिंक कॉपी हो गया!');
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="ऑडियो URL कॉपी करें"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Audio Element for preview in Admin */}
            {previewPlayingSongId && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                <span className="text-amber-300 font-semibold truncate">
                  Now Previewing: {adminSongs.find(s => s.id === previewPlayingSongId)?.title}
                </span>
                <audio
                  autoPlay
                  controls
                  src={adminSongs.find(s => s.id === previewPlayingSongId)?.audioUrl}
                  className="h-8 max-w-xs"
                  onEnded={() => setPreviewPlayingSongId(null)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- EVENTS TAB ---------------- */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Event Form (Col 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Create Church Event
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="e.g. Miracle Fire Conference"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={e => setEventVenue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Format</label>
                  <select
                    value={eventOnlineOrOffline}
                    onChange={e => setEventOnlineOrOffline(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">Banner Image URL</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>🖼️ बैनर फोटो अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'event_banner');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={eventBanner}
                  onChange={e => setEventBanner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Details of the event..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Create Event
              </button>
            </form>
          </div>

          {/* Existing Events List (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">Upcoming Events ({events.length})</h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {events.map(ev => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={ev.banner} alt={ev.title} className="w-16 h-10 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{ev.title}</h4>
                      <span className="text-slate-400 text-[11px] block">
                        {ev.date} @ {ev.time} • {ev.venue}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- LIVE STREAM TAB ---------------- */}
      {activeTab === 'live' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" /> Sanctuary Live Stream Broadcast Settings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Control the live indicator across the entire website, update feed URLs, and schedule broadcasts.
            </p>
          </div>

          <form onSubmit={handleUpdateLive} className="space-y-4 text-xs">
            {/* Live Toggle Switch */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-sm">Broadcast Live Status</span>
                <span className="text-slate-400 text-xs">
                  When enabled, viewers see "LIVE BROADCASTING NOW" pulsing banner across the site.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLiveStream}
                  onChange={e => setIsLiveStream(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Active Sermon / Broadcast Title</label>
              <input
                type="text"
                value={liveTitle}
                onChange={e => setLiveTitle(e.target.value)}
                placeholder="e.g. Sunday Miracle Service Live from Cathedral Sanctuary"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">YouTube Live Video / Embed Link</label>
              <input
                type="url"
                value={liveYoutube}
                onChange={e => setLiveYoutube(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Facebook Live Stream URL (Optional)</label>
              <input
                type="url"
                value={liveFacebook}
                onChange={e => setLiveFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Next Scheduled Service Text</label>
              <input
                type="text"
                value={liveNextSchedule}
                onChange={e => setLiveNextSchedule(e.target.value)}
                placeholder="Next: Wednesday Prophetic Fire Service @ 7:00 PM PST"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Update Live Broadcast Configuration
            </button>
          </form>
        </div>
      )}

      {/* ---------------- PRAYERS TAB ---------------- */}
      {activeTab === 'prayers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-white">Prayer Requests Altar ({prayers.length})</h2>
            <p className="text-xs text-slate-400">Review member petitions, confidential prayers, and send pastoral replies.</p>
          </div>

          <div className="space-y-4">
            {prayers.map(p => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    {p.isPrivate && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Confidential
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-slate-300 leading-relaxed font-light">{p.request}</p>

                {p.email && <p className="text-slate-400 text-[11px]">Email: {p.email} • Phone: {p.phone || 'N/A'}</p>}

                {p.adminReply && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    <strong className="block">Pastoral Reply sent:</strong>
                    {p.adminReply}
                  </div>
                )}

                {replyPrayerId === p.id ? (
                  <div className="pt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={prayerReplyText}
                      onChange={e => setPrayerReplyText(e.target.value)}
                      placeholder="Write pastoral encouragement or prayer declaration..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    ></textarea>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendPrayerReply(p.id)}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg"
                      >
                        Send Pastoral Response
                      </button>
                      <button
                        onClick={() => setReplyPrayerId(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => {
                        setReplyPrayerId(p.id);
                        setPrayerReplyText(p.adminReply || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      {p.adminReply ? 'Edit Pastoral Reply' : 'Send Pastoral Reply'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- MEETINGS TAB ---------------- */}
      {activeTab === 'meetings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Create Zoom Gathering
            </h3>

            <form onSubmit={handleAddZoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={zoomTitle}
                  onChange={e => setZoomTitle(e.target.value)}
                  placeholder="e.g. Wednesday Midweek Intercession"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={zoomDate}
                    onChange={e => setZoomDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={zoomStart}
                    onChange={e => setZoomStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={zoomEnd}
                    onChange={e => setZoomEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Zoom Meeting Join Link</label>
                <input
                  type="url"
                  value={zoomLink}
                  onChange={e => setZoomLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Meeting ID</label>
                  <input
                    type="text"
                    value={zoomId}
                    onChange={e => setZoomId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Passcode</label>
                  <input
                    type="text"
                    value={zoomPass}
                    onChange={e => setZoomPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Publish Zoom Meeting
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">Active Online Sessions</h3>
            <div className="space-y-3">
              {zoomMeetings.map(zm => (
                <div key={zm.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white">{zm.title}</h4>
                    <span className="text-amber-400 font-mono">{zm.startTime} – {zm.endTime}</span>
                  </div>
                  <p className="text-slate-400">ID: {zm.meetingId} • Pass: {zm.password}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PHOTOS TAB ---------------- */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Upload Church Photo
            </h3>

            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Sunday Worship Encounter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Album</label>
                <select
                  value={photoAlbumId}
                  onChange={e => setPhotoAlbumId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="album-1">Sunday Worship Services</option>
                  <option value="album-2">Miracle & Revival Conferences</option>
                  <option value="album-3">Fire Youth & Discipleship</option>
                  <option value="album-4">Water Baptism & Dedications</option>
                  <option value="album-5">Community Compassion Outreaches</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300">Image URL *</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-semibold transition">
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUploading ? 'अपलोड हो रहा है...' : '📸 फोन/कंप्यूटर से फोटो अपलोड करें'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFileUpload(file, 'photo');
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  placeholder="https://... या ऊपर दिए बटन से सीधे फोटो अपलोड करें"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={photoDesc}
                  onChange={e => setPhotoDesc(e.target.value)}
                  placeholder="Details of this moment..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Add to Gallery
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">Gallery Photos ({photos.length})</h3>
            <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {photos.map(p => (
                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 group">
                  <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-end text-[10px] text-white">
                    <span className="font-bold truncate">{p.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- NOTIFY TAB ---------------- */}
      {activeTab === 'notify' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" /> Broadcast Church Announcement
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Send instant notification to all registered congregation members and app users.
            </p>
          </div>

          <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Announcement Headline *</label>
              <input
                type="text"
                required
                value={notifyTitle}
                onChange={e => setNotifyTitle(e.target.value)}
                placeholder="e.g. Special Revival Service Tonight @ 7:00 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Message Body *</label>
              <textarea
                required
                rows={4}
                value={notifyMessage}
                onChange={e => setNotifyMessage(e.target.value)}
                placeholder="Join us in the sanctuary or online as Pastor David releases a special prophetic impartation..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Push Notification Broadcast
            </button>
          </form>
        </div>
      )}

      {/* ---------------- DONATIONS & GIVING MANAGEMENT TAB ---------------- */}
      {activeTab === 'donations' && (
        <div className="space-y-8">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Giving Recorded</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">
                  ${donations.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
                </span>
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">{donations.length} total contributions</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-emerald-400 uppercase font-semibold">Verified / Cleared</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ${donations.filter(d => d.status === 'verified' || d.status === 'completed').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-500">
                {donations.filter(d => d.status === 'verified' || d.status === 'completed').length} verified transactions
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-amber-400 uppercase font-semibold">Pending Review</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {donations.filter(d => d.status === 'pending').length}
                </span>
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">Awaiting UTR / statement match</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Channels</span>
              <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">Google Pay</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">Bank</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Live & ready for offerings</span>
            </div>
          </div>

          {/* Donations Table Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Fellowship Tithes, Offerings & Seeds Log
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage member contributions, verify UPI & bank wire transfer references
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                {(['all', 'pending', 'verified', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setDonationFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      donationFilter === f
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 uppercase text-[10px] font-semibold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Receipt #</th>
                    <th className="p-3.5">Donor Details</th>
                    <th className="p-3.5">Fund & Amount</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Transaction Ref / UTR</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {donations
                    .filter(d => donationFilter === 'all' || d.status === donationFilter)
                    .map(d => (
                      <tr key={d.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-mono text-amber-300 font-bold whitespace-nowrap">
                          {d.receiptNumber}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-white block">{d.donorName}</span>
                          <span className="text-[11px] text-slate-400 block">{d.donorEmail}</span>
                          {d.donorPhone && <span className="text-[10px] text-slate-500 font-mono">{d.donorPhone}</span>}
                        </td>
                        <td className="p-3.5">
                          <span className="text-sm font-bold font-mono text-white block">
                            ${d.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{d.currency}</span>
                          </span>
                          <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                            {d.fundType}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 capitalize font-medium">
                            {d.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px] select-all">
                            {d.transactionReference}
                          </span>
                          {d.notes && <p className="text-[10px] text-slate-500 italic mt-1">{d.notes}</p>}
                        </td>
                        <td className="p-3.5 text-slate-400 whitespace-nowrap">
                          {new Date(d.date).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            d.status === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : d.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                          {d.status !== 'verified' && (
                            <button
                              onClick={() => handleUpdateDonationStatus(d.id, 'verified')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition inline-flex items-center gap-1"
                              title="Mark as Verified"
                            >
                              <Check className="w-3 h-3" /> Verify
                            </button>
                          )}
                          {d.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateDonationStatus(d.id, 'completed')}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                              title="Mark as Completed"
                            >
                              Complete
                            </button>
                          )}
                          {d.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateDonationStatus(d.id, 'pending')}
                              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] transition"
                              title="Reset to Pending"
                            >
                              Pending
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  {donations.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-500">
                        No donation records found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Church Payment Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                Church Payment Accounts & Receiving Coordinates
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your official Google Pay UPI ID, PhonePe merchant address, and Bank Account details shown to givers.
              </p>
            </div>

            <form onSubmit={handleSavePaymentDetails} className="space-y-6">
              {/* Google Pay Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Google Pay Receiving Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Google Pay UPI ID *</label>
                    <input
                      type="text"
                      required
                      value={gpayUpi}
                      onChange={e => setGpayUpi(e.target.value)}
                      placeholder="e.g. firegrace@okaxis"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={gpayPhone}
                      onChange={e => setGpayPhone(e.target.value)}
                      placeholder="+1 (555) 777-4722"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account Display Name</label>
                    <input
                      type="text"
                      value={gpayName}
                      onChange={e => setGpayName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* PhonePe Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  PhonePe Receiving Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">PhonePe UPI ID *</label>
                    <input
                      type="text"
                      required
                      value={phonePeUpi}
                      onChange={e => setPhonePeUpi(e.target.value)}
                      placeholder="e.g. firegracefellowship@ybl"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">PhonePe Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={phonePePhone}
                      onChange={e => setPhonePePhone(e.target.value)}
                      placeholder="+1 (555) 777-4722"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account Display Name</label>
                    <input
                      type="text"
                      value={phonePeName}
                      onChange={e => setPhonePeName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  Church Sanctuary Bank Wire & Direct Deposit Coordinates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      value={bankAccName}
                      onChange={e => setBankAccName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={bankAccNumber}
                      onChange={e => setBankAccNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">IFSC Code / Sort Code *</label>
                    <input
                      type="text"
                      required
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={e => setBankBranch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">US Routing / SWIFT BIC</label>
                    <input
                      type="text"
                      value={bankRouting}
                      onChange={e => setBankRouting(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Church Payment Accounts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
