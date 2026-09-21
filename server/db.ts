/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
  BibleBookmark,
  DonationRecord,
  ChurchPaymentDetails,
} from '../src/types';

interface StoredUser extends UserProfile {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  referrals: ReferralRecord[];
  sermons: Sermon[];
  songs: AudioSong[];
  photoAlbums: PhotoAlbum[];
  photos: PhotoItem[];
  videos: VideoItem[];
  liveConfig: LiveStreamConfig;
  events: ChurchEvent[];
  eventRegistrations: EventRegistration[];
  prayerRequests: PrayerRequest[];
  zoomMeetings: ZoomMeeting[];
  googleMeetings: GoogleMeet[];
  activities: ChurchActivity[];
  notifications: NotificationItem[];
  socialLinks: SocialLinks;
  contactMessages: ContactMessage[];
  homepageSettings: HomepageSettings;
  churchSettings: ChurchSettings;
  bibleBookmarks: BibleBookmark[];
  donations: DonationRecord[];
  paymentDetails: ChurchPaymentDetails;
}

const DB_PATH = path.resolve(process.cwd(), 'database.json');

// Password helper
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

// Generate Next Member ID FGF10001, FGF10002...
export function generateMemberId(users: StoredUser[]): string {
  const prefix = 'FGF';
  let maxNum = 10000;
  for (const u of users) {
    if (u.memberId && u.memberId.startsWith(prefix)) {
      const num = parseInt(u.memberId.replace(prefix, ''), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `${prefix}${maxNum + 1}`;
}

// Initial Seed Data
function getInitialData(): DatabaseSchema {
  const adminSalt = 'admin_fgf_salt_2026';
  const adminHash = hashPassword('Admin@123456', adminSalt).hash;

  const ashishSalt = 'ashish_fgf_salt_2026';
  const ashishHash = hashPassword('Admin@123456', ashishSalt).hash;

  const aniketSalt = 'aniket_fgf_salt_2026';
  const aniketHash = hashPassword('Admin@123456', aniketSalt).hash;

  const member1Salt = 'member1_fgf_salt';
  const member1Hash = hashPassword('Member@123', member1Salt).hash;
  const member2Salt = 'member2_fgf_salt';
  const member2Hash = hashPassword('Member@123', member2Salt).hash;

  const ashishUser: StoredUser = {
    id: 'usr_leader_001',
    memberId: 'FGF10001',
    fullName: 'Ashish Badawat',
    mobile: '+91 7066463676',
    email: 'ashishbadawat@gmail.com',
    passwordHash: ashishHash,
    salt: ashishSalt,
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    dob: '1990-01-01',
    gender: 'Male',
    ministry: 'Senior Church Leadership & Pastoral Team',
    referralCode: 'FGF10001',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
  };

  const aniketUser: StoredUser = {
    id: 'usr_leader_002',
    memberId: 'FGF10002',
    fullName: 'Aniket',
    mobile: '+91 78418 17431',
    email: 'aniket@firegrace.org',
    passwordHash: aniketHash,
    salt: aniketSalt,
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    dob: '1992-05-15',
    gender: 'Male',
    ministry: 'Church Leadership & Media Ministry',
    sponsorId: 'FGF10001',
    referralCode: 'FGF10002',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-02T08:00:00.000Z',
  };

  const adminUser: StoredUser = {
    id: 'usr_admin_001',
    memberId: 'FGF10000',
    fullName: 'Senior Pastor David Emmanuel',
    mobile: '+1 (555) 019-2834',
    email: 'admin@firegrace.org',
    passwordHash: adminHash,
    salt: adminSalt,
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    dob: '1980-04-12',
    gender: 'Male',
    ministry: 'Pastoral Leadership',
    referralCode: 'FGF10000',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
  };

  const member1: StoredUser = {
    id: 'usr_member_003',
    memberId: 'FGF10003',
    fullName: 'Grace Sarah Johnson',
    mobile: '+1 (555) 392-1082',
    email: 'grace.johnson@example.com',
    passwordHash: member1Hash,
    salt: member1Salt,
    city: 'Pasadena',
    state: 'California',
    country: 'United States',
    dob: '1992-08-24',
    gender: 'Female',
    ministry: 'Worship Team',
    sponsorId: 'FGF10001',
    referralCode: 'FGF10003',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'member',
    status: 'active',
    createdAt: '2026-01-15T10:30:00.000Z',
  };

  const member2: StoredUser = {
    id: 'usr_member_004',
    memberId: 'FGF10004',
    fullName: 'Joshua Caleb Miller',
    mobile: '+1 (555) 847-2911',
    email: 'joshua.miller@example.com',
    passwordHash: member2Hash,
    salt: member2Salt,
    city: 'Glendale',
    state: 'California',
    country: 'United States',
    dob: '1995-11-03',
    gender: 'Male',
    ministry: 'Youth Fellowship',
    sponsorId: 'FGF10003',
    referralCode: 'FGF10004',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'member',
    status: 'active',
    createdAt: '2026-02-01T14:20:00.000Z',
  };

  const referrals: ReferralRecord[] = [
    {
      id: 'ref_001',
      sponsorId: 'FGF10001',
      sponsorName: 'Pastor David Emmanuel',
      referredId: 'FGF10002',
      referredName: 'Grace Sarah Johnson',
      referredEmail: 'grace.johnson@example.com',
      referredMobile: '+1 (555) 392-1082',
      referredDate: '2026-01-15T10:30:00.000Z',
      status: 'active',
    },
    {
      id: 'ref_002',
      sponsorId: 'FGF10002',
      sponsorName: 'Grace Sarah Johnson',
      referredId: 'FGF10003',
      referredName: 'Joshua Caleb Miller',
      referredEmail: 'joshua.miller@example.com',
      referredMobile: '+1 (555) 847-2911',
      referredDate: '2026-02-01T14:20:00.000Z',
      status: 'active',
    },
  ];

  const sermons: Sermon[] = [
    {
      id: 'sermon_001',
      title: 'Walking in the Unquenchable Fire of the Holy Spirit',
      speaker: 'Pastor David Emmanuel',
      date: '2026-09-13',
      description: 'Discover the profound mystery of the baptism of the Holy Ghost and fire. Understand how spiritual fervor preserves our communion with God and destroys every demonic stronghold.',
      bibleReference: 'Matthew 3:11, Acts 2:1-4',
      thumbnail: 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      downloadAllowed: true,
      downloadUrl: '#',
      category: 'Holy Spirit',
      featured: true,
    },
    {
      id: 'sermon_002',
      title: 'The Outpouring of Supernatural Grace in Difficult Times',
      speaker: 'Pastor David Emmanuel',
      date: '2026-09-06',
      description: 'Grace is not just unmerited favor; it is the divine enablement of God that empowers believers to triumph over affliction, lack, and persecution.',
      bibleReference: '2 Corinthians 12:9, Romans 5:17',
      thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      downloadAllowed: true,
      category: 'Sunday Sermon',
      featured: true,
    },
    {
      id: 'sermon_003',
      title: 'Healing Virtues: Believing God for Miracles Today',
      speaker: 'Pastor Esther Emmanuel',
      date: '2026-08-30',
      description: 'A deeply encouraging message exploring the stripes of Jesus Christ, the authority given to believers, and testimonials of divine physical restoration.',
      bibleReference: 'Isaiah 53:5, 1 Peter 2:24',
      thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      downloadAllowed: false,
      category: 'Healing',
      featured: false,
    },
    {
      id: 'sermon_004',
      title: 'Prevailing in Midnight Prayers: The Secret Place of Power',
      speaker: 'Evangelist Marcus Vance',
      date: '2026-08-23',
      description: 'Learn the spiritual mechanics of persistent intercession and how breaking through in private prayer manifests public dominion.',
      bibleReference: 'Acts 16:25-26, Luke 18:1-8',
      thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      downloadAllowed: true,
      category: 'Prayer',
      featured: false,
    },
    {
      id: 'sermon_005',
      title: 'Igniting the Next Generation: Faith with Boldness',
      speaker: 'Youth Pastor Jonathan Lee',
      date: '2026-08-16',
      description: 'Equipping our young people to stand unapologetically for truth in modern culture, led by conviction and holy compassion.',
      bibleReference: '1 Timothy 4:12, Daniel 1:8',
      thumbnail: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      downloadAllowed: true,
      category: 'Youth',
      featured: false,
    },
  ];

  const songs: AudioSong[] = [
    {
      id: 'song_001',
      title: 'येशु नाम (Yeshu Naam - Highest Name)',
      artist: 'Fire & Grace Worship Team',
      album: 'Ignited by Fire Vol. 1',
      language: 'Hindi',
      category: 'Worship',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: '05:42',
      coverImage: 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80',
      lyrics: `[मुखड़ा]
येशु तेरा नाम सबसे ऊंचा है
हर घुटने टिकेंगे, हर जुबान कहेगी
तू ही प्रभु है, तू ही मसीह है
तेरी जयजयकार हो सदा...

[अंतरा 1]
अंधकार में तूने ज्योति जलाई
टूटे हुए दिलों को तूने संभाला
तेरे लहू से मिली है शिफा
तेरे अनुग्रह ने हमको जिलाया

[Chorus]
हाल्लेलूयाह, हाल्लेलूयाह
राजाओं का राजा, प्रभुओं का प्रभु
येशु मसीह, तेरी महिमा हो!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      playsCount: 342,
      likesCount: 89,
      dateAdded: '2026-09-10',
      featured: true,
    },
    {
      id: 'song_002',
      title: 'पवित्र आत्मा आ (Pavitra Aatma Aa - Revival Fire)',
      artist: 'Pastor David Emmanuel & FGF Choir',
      album: 'Holy Fire Outpouring',
      language: 'Hindi',
      category: 'Revival Fire',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: '06:15',
      coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
      lyrics: `[Verse 1]
पवित्र आत्मा आ, हमारे बीच में आ
जैसे पिन्तेकुस्त के दिन आग बरसी
वैसे ही आज हमें नया बना

[Chorus]
आग से भर दे, सामर्थ से भर दे
तेरी उपस्थिति में जीवन है
पवित्र आत्मा आ, छू ले हमें आज!

[Bridge]
न बल से, न शक्ति से
परंतु तेरी आत्मा के द्वारा
हर बंधन टूटेगा, हर रोग मिटेगा!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      playsCount: 512,
      likesCount: 145,
      dateAdded: '2026-09-05',
      featured: true,
    },
    {
      id: 'song_003',
      title: 'धन्यवाद के साथ (Dhanyawad Ke Saath - Praise)',
      artist: 'Bro. Ashish & Worship Band',
      album: 'Living Sacrifice',
      language: 'Hindi',
      category: 'Praise',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: '04:30',
      coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
      lyrics: `[Verse]
धन्यवाद के साथ स्तुति गाऊंगा
हे यीशु मेरे खुदा
उपकार तेरे कितने अनगिनत
वर्णन मैं कैसे करूं...

[Chorus]
तू भला है, तेरी करुणा सदा की है
गाते रहेंगे हम तेरी जय
तू ही सहारा, तू ही भरोसा
यीशु नाम की जय!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      playsCount: 280,
      likesCount: 76,
      dateAdded: '2026-08-28',
      featured: true,
    },
    {
      id: 'song_004',
      title: 'Living Hope & Grace (पुनरुत्थान की आशा)',
      artist: 'FGF Youth Voices',
      album: 'Covered by Grace',
      language: 'English',
      category: 'Worship',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: '05:18',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      lyrics: `[Verse 1]
How great the chasm that lay between us
How high the mountain I could not climb
In desperation, I turned to heaven
And spoke Your name into the night

[Chorus]
Hallelujah, praise the One who set me free!
Hallelujah, death has lost its grip on me!
You have broken every chain
There's salvation in Your name
Jesus Christ, my living hope!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      playsCount: 420,
      likesCount: 112,
      dateAdded: '2026-08-20',
      featured: false,
    },
    {
      id: 'song_005',
      title: 'मजाल काय (Majhal Kaay - अथांग कृपा)',
      artist: 'FGF Marathi Fellowship',
      album: 'कृपेचा वर्षाव',
      language: 'Marathi',
      category: 'Praise',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      duration: '04:55',
      coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=80',
      lyrics: `[मुखवटा]
मजवरी कृपा तुझी अथांग आहे येशू
पापांतून सोडविले मला तुझ्या रक्ताने
मी गाणार स्तुती तुझी आयुष्यभर
तूच माझा त्राता, तूच माझा देव!

[कोरस]
जय जयकार असो, येशू राजाचा
धन्यवाद असो आमच्या प्रभूचा!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      playsCount: 195,
      likesCount: 64,
      dateAdded: '2026-08-15',
      featured: false,
    },
    {
      id: 'song_006',
      title: 'आग और अनुग्रह (Fire & Grace Anthem)',
      artist: 'Fire & Grace Worship Team',
      album: 'Ignited by Fire Vol. 1',
      language: 'Hindi',
      category: 'Revival Fire',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      duration: '05:50',
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      lyrics: `[Verse]
आग से बपतिस्मा दे, अनुग्रह से ढांप ले
भेज हमें प्रभु, संसार को बदलने
लूका 3:16 की वो सामर्थ आज उतरे
हजारों जानें तेरे राज्य में आएं!

[Chorus]
आग और अनुग्रह, हमारे साथ है
पवित्र आत्मा का अभिषेक हमारे सिर पर है!`,
      downloadAllowed: true,
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      playsCount: 610,
      likesCount: 188,
      dateAdded: '2026-09-01',
      featured: true,
    },
  ];

  const photoAlbums: PhotoAlbum[] = [
    {
      id: 'album_001',
      title: 'Sunday Worship Celebrations',
      category: 'Sunday Worship',
      description: 'Atmosphere of glorious praise, heart-felt worship, and anointed ministrations in the sanctuary.',
      coverUrl: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&auto=format&fit=crop&q=80',
      date: '2026-09-13',
      photosCount: 6,
    },
    {
      id: 'album_002',
      title: 'Annual Fire & Glory Conference',
      category: 'Church Anniversary',
      description: 'Special guests, prophetic declarations, and powerful breakthroughs during our 10th anniversary.',
      coverUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=80',
      date: '2026-07-20',
      photosCount: 5,
    },
    {
      id: 'album_003',
      title: 'Baptism in the Holy Spirit & Water',
      category: 'Baptism',
      description: 'Celebrating souls dedicated to the Lord Jesus Christ through full immersion baptism.',
      coverUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
      date: '2026-06-14',
      photosCount: 4,
    },
    {
      id: 'album_004',
      title: 'Youth Ignition Encounter',
      category: 'Youth Meeting',
      description: 'Dynamic young people worshipping, fellowship, outdoor games and biblical mentoring.',
      coverUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
      date: '2026-08-08',
      photosCount: 4,
    },
  ];

  const photos: PhotoItem[] = [
    {
      id: 'ph_001',
      albumId: 'album_001',
      title: 'Worship Team in Deep Adoration',
      url: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1000&auto=format&fit=crop&q=80',
      description: 'Hands raised in surrender during our Sunday morning opening praise.',
      featured: true,
      date: '2026-09-13',
    },
    {
      id: 'ph_002',
      albumId: 'album_001',
      title: 'Congregational Prayer Intercession',
      url: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?w=1000&auto=format&fit=crop&q=80',
      description: 'Believers uniting their hearts in fervent intercession.',
      featured: true,
      date: '2026-09-13',
    },
    {
      id: 'ph_003',
      albumId: 'album_001',
      title: 'Pastor David Delivering Word of God',
      url: 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=1000&auto=format&fit=crop&q=80',
      description: 'Opening the scriptures with passion and divine revelation.',
      featured: false,
      date: '2026-09-13',
    },
    {
      id: 'ph_004',
      albumId: 'album_002',
      title: 'Church Anniversary Lighting',
      url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1000&auto=format&fit=crop&q=80',
      description: 'The sanctuary packed during our 10th anniversary Thanksgiving praise.',
      featured: true,
      date: '2026-07-20',
    },
    {
      id: 'ph_005',
      albumId: 'album_003',
      title: 'Water Baptism Ceremony',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80',
      description: 'A new believer buried with Christ and resurrected into new life.',
      featured: true,
      date: '2026-06-14',
    },
    {
      id: 'ph_006',
      albumId: 'album_004',
      title: 'Youth Fellowship Rally',
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&auto=format&fit=crop&q=80',
      description: 'Joyful smiles and heartfelt fellowship among our youth leaders.',
      featured: false,
      date: '2026-08-08',
    },
  ];

  const videos: VideoItem[] = [
    {
      id: 'vid_001',
      title: 'Atmosphere of Glory & Deep Prophetic Worship',
      category: 'Worship',
      youtubeUrl: 'https://www.youtube.com/watch?v=C7mX6i4Nfio',
      thumbnail: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&auto=format&fit=crop&q=80',
      date: '2026-09-13',
      duration: '45:20',
      speaker: 'FGF Worship Band',
    },
    {
      id: 'vid_002',
      title: 'Breaking Generational Curses through Blood Covenant',
      category: 'Sermon',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=800&auto=format&fit=crop&q=80',
      date: '2026-09-06',
      duration: '1:12:40',
      speaker: 'Pastor David Emmanuel',
    },
    {
      id: 'vid_003',
      title: 'Testimony: Miraculous Healing from Stage 4 Sickness',
      category: 'Testimony',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      date: '2026-08-28',
      duration: '18:15',
      speaker: 'Sister Grace Johnson',
    },
    {
      id: 'vid_004',
      title: 'Youth Fire Camp Highlights & Testimonies',
      category: 'Youth',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
      date: '2026-08-15',
      duration: '22:05',
      speaker: 'Pastor Jonathan Lee',
    },
  ];

  const liveConfig: LiveStreamConfig = {
    isLive: false,
    title: 'Sunday Resurrection Power & Anointing Service',
    youtubeLiveUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    facebookLiveUrl: 'https://facebook.com/firegracefellowship/live',
    thumbnail: 'https://images.unsplash.com/photo-1510525009512-ad7fc0c02b28?w=1200&auto=format&fit=crop&q=80',
    startTime: '10:00 AM PST',
    endTime: '01:00 PM PST',
    nextScheduleTitle: 'Midweek Miracle & Fasting Prayer Service',
    nextScheduleTime: 'Wednesday at 7:00 PM PST',
    countdownTarget: new Date(Date.now() + 86400000 * 2.5).toISOString(),
    previousStreams: [
      {
        id: 'past_live_01',
        title: 'Sunday Fire & Deliverance Service (Live Broadcast)',
        date: '2026-09-13',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'past_live_02',
        title: 'Midweek Believers Bible Study & Prophetic Night',
        date: '2026-09-09',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?w=600&auto=format&fit=crop&q=80',
      },
    ],
  };

  const events: ChurchEvent[] = [
    {
      id: 'ev_001',
      title: '7 Days of Unstoppable Fire & Fasting',
      banner: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1000&auto=format&fit=crop&q=80',
      date: '2026-10-05',
      time: '6:30 PM - 9:00 PM Daily',
      venue: 'Main Sanctuary & Online Broadcast',
      address: '777 Grace Cathedral Way, Los Angeles, CA 90001',
      speaker: 'Pastor David Emmanuel & Guest Anointed Speakers',
      description: 'A sacred week consecrated for holy repentance, intercession, deliverance from generational delay, and spiritual empowerment for every family.',
      registrationRequired: true,
      onlineOrOffline: 'Hybrid',
      mapUrl: 'https://maps.google.com/?q=Los+Angeles+CA',
      category: 'Prayer & Fasting',
    },
    {
      id: 'ev_002',
      title: 'Youth Fire Night: Awakened by the Spirit',
      banner: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&auto=format&fit=crop&q=80',
      date: '2026-10-17',
      time: '5:00 PM - 9:30 PM',
      venue: 'Fellowship Hall Amphitheater',
      address: '777 Grace Cathedral Way, Los Angeles, CA',
      speaker: 'Pastor Jonathan Lee & FGF Youth Crew',
      description: 'An evening of live worship bands, spoken word, powerful testimonies, and fellowship barbecue for high school and university students.',
      registrationRequired: true,
      onlineOrOffline: 'Offline',
      category: 'Youth',
    },
    {
      id: 'ev_003',
      title: 'Global Partners Zoom Prayer Vigil',
      banner: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1000&auto=format&fit=crop&q=80',
      date: '2026-10-24',
      time: '8:00 PM - 10:30 PM PST',
      venue: 'Worldwide Zoom Conference Room',
      address: 'Online via Zoom',
      speaker: 'Pastor David & Leadership Council',
      description: 'Connecting international members, overseas branches, and online partners for a strategic prophetic prayer session.',
      registrationRequired: false,
      onlineOrOffline: 'Online',
      linkUrl: 'https://zoom.us/j/7778889999',
      category: 'Global Outreach',
    },
  ];

  const eventRegistrations: EventRegistration[] = [
    {
      id: 'reg_001',
      eventId: 'ev_001',
      userId: 'usr_member_002',
      memberId: 'FGF10002',
      userName: 'Grace Sarah Johnson',
      userEmail: 'grace.johnson@example.com',
      userPhone: '+1 (555) 392-1082',
      registeredAt: '2026-09-14T11:00:00.000Z',
    },
  ];

  const prayerRequests: PrayerRequest[] = [
    {
      id: 'pray_001',
      userId: 'usr_member_002',
      memberId: 'FGF10002',
      name: 'Grace Sarah Johnson',
      email: 'grace.johnson@example.com',
      phone: '+1 (555) 392-1082',
      category: 'Healing',
      request: 'Please stand with my family in prayer for my mother who is undergoing medical checkups. We believe in Jehovah Rapha for a complete clean bill of health!',
      isPrivate: false,
      status: 'prayed',
      adminReply: 'Pastor David and the FGF Prayer Ministry interceded for your mother. By His stripes she is whole! Keep us updated.',
      createdAt: '2026-09-12T09:30:00.000Z',
    },
    {
      id: 'pray_002',
      userId: 'usr_member_003',
      memberId: 'FGF10003',
      name: 'Joshua Caleb Miller',
      email: 'joshua.miller@example.com',
      phone: '+1 (555) 847-2911',
      category: 'Job',
      request: 'Praying for open doors regarding a new engineering leadership opportunity. Praying for divine favor with the interview panel.',
      isPrivate: false,
      status: 'pending',
      createdAt: '2026-09-18T15:20:00.000Z',
    },
    {
      id: 'pray_003',
      name: 'Sister Mary (Confidential)',
      email: 'mary.conf@example.com',
      category: 'Spiritual',
      request: 'Private request: Praying for supernatural peace, restoration of my marriage, and financial deliverance.',
      isPrivate: true,
      status: 'prayed',
      adminReply: 'Our pastoral council is carrying this before the Lord. God will make a way where there seems to be no way.',
      createdAt: '2026-09-17T18:00:00.000Z',
    },
  ];

  const zoomMeetings: ZoomMeeting[] = [
    {
      id: 'zm_001',
      title: 'Wednesday Believers Holy Ghost Hour',
      date: 'Every Wednesday',
      startTime: '7:00 PM PST',
      endTime: '8:30 PM PST',
      zoomLink: 'https://zoom.us/j/84291823901',
      meetingId: '842 9182 3901',
      password: 'GRACE',
      showPassword: true,
      description: 'Weekly interactive Bible exposition, live Q&A with Pastor David, and personal prayer breakout rooms.',
    },
    {
      id: 'zm_002',
      title: 'Saturday Dawn Watch Intercession (4 AM - 6 AM)',
      date: 'Every Saturday',
      startTime: '4:00 AM PST',
      endTime: '6:00 AM PST',
      zoomLink: 'https://zoom.us/j/93019283741',
      meetingId: '930 1928 3741',
      password: 'FIRE',
      showPassword: true,
      description: 'Early morning watchmen on the wall. Intensive spiritual warfare and breaking the chains of darkness.',
    },
  ];

  const googleMeetings: GoogleMeet[] = [
    {
      id: 'gm_001',
      title: 'Leadership & Departmental Heads Meeting',
      date: 'First Tuesday of Month',
      time: '6:30 PM PST',
      meetLink: 'https://meet.google.com/fgf-lead-holy',
      description: 'Ministry coordination, volunteer scheduling, and event planning for department leaders.',
    },
    {
      id: 'gm_002',
      title: 'New Converts Foundation & Discipleship Class',
      date: 'Every Thursday',
      time: '6:00 PM PST',
      meetLink: 'https://meet.google.com/fgf-disc-fndn',
      description: 'Essential teachings on salvation, water baptism, holy living, and walking in spiritual authority.',
    },
  ];

  const activities: ChurchActivity[] = [
    {
      id: 'act_001',
      title: 'Sunday Worship Celebration',
      day: 'Sundays',
      time: '9:00 AM & 11:30 AM',
      leader: 'Pastor David Emmanuel',
      venue: 'Main Sanctuary & Live Online',
      description: 'Dynamic high praise, profound worship, prophetic ministration, and fellowship with the brethren.',
      category: 'Worship',
      icon: 'Sun',
    },
    {
      id: 'act_002',
      title: 'Midweek Fire & Bible Study',
      day: 'Wednesdays',
      time: '7:00 PM - 8:45 PM',
      leader: 'Pastoral Team',
      venue: 'Chapel & Zoom Room',
      description: 'Verse-by-verse scripture study, practical Christian life principles, and Holy Spirit empowerment.',
      category: 'Discipleship',
      icon: 'BookOpen',
    },
    {
      id: 'act_003',
      title: 'Friday Night Deliverance & Fasting Prayer',
      day: 'Fridays',
      time: '8:00 PM - 10:30 PM',
      leader: 'Prayer Ministry',
      venue: 'Prayer Hall',
      description: 'Fervent prayer breaking generational yokes, physical sicknesses, and establishing God’s promises.',
      category: 'Prayer',
      icon: 'Flame',
    },
    {
      id: 'act_004',
      title: 'Ignite Youth & Young Adults Meeting',
      day: 'Saturdays',
      time: '5:00 PM - 7:30 PM',
      leader: 'Pastor Jonathan Lee',
      venue: 'Youth Center',
      description: 'Passionate generation seeking God’s presence through music, discussion panels, games and outreach.',
      category: 'Youth',
      icon: 'Sparkles',
    },
    {
      id: 'act_005',
      title: 'Virtuous Women of Grace Fellowship',
      day: '2nd & 4th Saturdays',
      time: '10:00 AM - 12:00 PM',
      leader: 'Pastor Esther Emmanuel',
      venue: 'Grace Hall',
      description: 'Empowering mothers, daughters, and sisters in kingdom marriage, business, and godly leadership.',
      category: 'Women',
      icon: 'Heart',
    },
    {
      id: 'act_006',
      title: 'Mighty Men of Valor Breakfast',
      day: '1st Saturday of Month',
      time: '8:00 AM - 10:30 AM',
      leader: 'Deacon Council',
      venue: 'Fellowship Lounge',
      description: 'Brotherhood, spiritual accountability, kingdom wealth creation, and mentorship.',
      category: 'Men',
      icon: 'Shield',
    },
    {
      id: 'act_007',
      title: 'City Evangelism & Street Food Outreach',
      day: 'Every 3rd Saturday',
      time: '1:00 PM - 4:00 PM',
      leader: 'Evangelism Team',
      venue: 'Downtown Community Centers',
      description: 'Distributing warm meals, gospel tracts, and praying for the sick and homeless.',
      category: 'Outreach',
      icon: 'Send',
    },
    {
      id: 'act_008',
      title: 'Little Lights Children’s Church',
      day: 'Sundays during Main Service',
      time: '9:30 AM & 11:45 AM',
      leader: 'Children’s Ministry',
      venue: 'Children’s Wing',
      description: 'Age-appropriate Bible storytelling, memory verses, puppetry, crafts, and healthy snacks.',
      category: 'Children',
      icon: 'Smile',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_001',
      title: '🔥 Welcome to Fire Grace Fellowship!',
      message: 'Experience the supernatural love, grace, and transformation of our Lord Jesus Christ. Explore our sermons, Bible study, and join our upcoming events.',
      type: 'general',
      targetRole: 'all',
      createdAt: '2026-09-20T08:00:00.000Z',
      readBy: [],
    },
    {
      id: 'notif_002',
      title: '📢 7 Days of Fire & Fasting Begins Soon',
      message: 'Register today for our upcoming October prayer conference. Let us consecrate ourselves for greater breakthroughs.',
      type: 'event',
      targetRole: 'all',
      createdAt: '2026-09-19T10:00:00.000Z',
      readBy: [],
    },
    {
      id: 'notif_003',
      title: '🎧 New Sermon Released: Walking in the Unquenchable Fire',
      message: 'Pastor David’s latest Sunday sermon is now available for listening and download in the Sermons section.',
      type: 'sermon',
      targetRole: 'all',
      createdAt: '2026-09-14T12:00:00.000Z',
      readBy: [],
    },
  ];

  const socialLinks: SocialLinks = {
    youtube: 'https://youtube.com/@firegracefellowship',
    facebook: 'https://facebook.com/firegracefellowship',
    instagram: 'https://instagram.com/firegracefellowship',
    whatsapp: 'https://wa.me/18005553473',
    telegram: 'https://t.me/firegracefellowship',
    x: 'https://x.com/firegracechurch',
    website: 'https://firegracefellowship.org',
  };

  const contactMessages: ContactMessage[] = [
    {
      id: 'msg_001',
      name: 'Michael Brandon',
      email: 'michael.b@example.com',
      mobile: '+1 (555) 789-0123',
      message: 'Hello Pastor, I recently moved into the neighborhood and am seeking a Bible-believing, Spirit-filled church home. What are the Sunday service timings?',
      status: 'replied',
      createdAt: '2026-09-18T14:10:00.000Z',
    },
  ];

  const homepageSettings: HomepageSettings = {
    heroTitle: 'WELCOME TO FIRE & GRACE FELLOWSHIP',
    heroSubtitle: 'Where the Fire of the Holy Spirit meets the Boundless Grace of Jesus Christ',
    welcomeText: 'We are a multicultural, Spirit-filled family dedicated to revival, prophetic worship, sound biblical doctrine, and supernatural transformation. You are loved, you have purpose, and you belong here.',
    churchDescription: 'Fire & Grace Fellowship exists to ignite hearts with holy passion for God, heal the broken-hearted through the gospel of grace, and equip every believer to be a light in the nations.',
    verseOfTheDay: {
      book: 'Isaiah',
      chapter: 40,
      verseNumber: 31,
      verse: 'Isaiah 40:31',
      text: 'But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.',
    },
  };

  const churchSettings: ChurchSettings = {
    churchName: 'FIRE & GRACE FELLOWSHIP',
    address: '777 Grace Cathedral Way, Holy Spirit Avenue, Los Angeles, CA 90001',
    phone: '+1 (800) 555-FIRE',
    email: 'contact@firegracefellowship.org',
    whatsapp: '+1 (800) 555-3473',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Los+Angeles+CA&t=&z=13&ie=UTF8&iwloc=&output=embed',
    serviceTimes: [
      'Sunday First Service: 9:00 AM - 11:00 AM',
      'Sunday Second Service: 11:30 AM - 1:30 PM',
      'Wednesday Believers Bible Study: 7:00 PM - 8:30 PM',
      'Friday Deliverance & Fasting Prayer: 8:00 PM - 10:30 PM',
    ],
  };

  const bibleBookmarks: BibleBookmark[] = [
    {
      id: 'bm_001',
      userId: 'usr_member_002',
      book: 'Psalms',
      chapter: 91,
      verse: 1,
      text: 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.',
      note: 'My personal covenant of divine protection for 2026.',
      createdAt: '2026-09-10T12:00:00.000Z',
    },
  ];

  const paymentDetails: ChurchPaymentDetails = {
    churchName: 'FIRE & GRACE FELLOWSHIP MINISTRIES',
    taxId: '501(c)(3) Registered Religious Organization #95-4872190',
    googlePay: {
      upiId: 'firegrace@okaxis',
      number: '+1 (555) 777-FIRE',
      accountName: 'FIRE & GRACE FELLOWSHIP',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Dfiregrace%40okaxis%26pn%3DFire%2520%26%2520Grace%2520Fellowship%26cu%3DINR',
    },
    phonePe: {
      upiId: 'firegracefellowship@ybl',
      number: '+91 98765 43210',
      accountName: 'FIRE & GRACE FELLOWSHIP',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Dfiregracefellowship%40ybl%26pn%3DFire%2520%26%2520Grace%2520Fellowship%26cu%3DINR',
    },
    bankAccount: {
      bankName: 'Grace Federal & Kingdom Trust Bank / State Bank Partner',
      accountName: 'FIRE & GRACE FELLOWSHIP TRUST',
      accountNumber: '7770099881234',
      accountType: 'Current / Organization Non-Profit Account',
      ifscCode: 'FGFB0007777',
      routingNumber: '122000496',
      swiftBic: 'FGFBUS33',
      branchName: 'Cathedral Plaza Central Branch, 777 Grace Way, Los Angeles, CA 90001',
    },
    qrCodeAllInOne: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Dfiregrace%40okaxis%26pn%3DFire%2520Grace%2520Fellowship%26cu%3DINR',
    contactSupport: 'treasury@firegracefellowship.org | +1 (800) 555-FIRE',
  };

  const donations: DonationRecord[] = [
    {
      id: 'don_001',
      receiptNumber: 'FGF-GIVE-2026-001',
      userId: 'usr_member_002',
      donorName: 'Elder Johnathan Faith',
      donorEmail: 'member1@firegrace.org',
      donorPhone: '+1 (555) 234-5678',
      amount: 250,
      currency: 'USD',
      fundType: 'tithe',
      paymentMethod: 'bank_transfer',
      transactionReference: 'NEFT-893012948',
      notes: 'Tithe for covenant blessing and ministry advancement.',
      status: 'verified',
      date: '2026-09-15T14:30:00.000Z',
    },
    {
      id: 'don_002',
      receiptNumber: 'FGF-GIVE-2026-002',
      userId: 'usr_member_003',
      donorName: 'Sister Grace Deborah',
      donorEmail: 'member2@firegrace.org',
      donorPhone: '+1 (555) 345-6789',
      amount: 100,
      currency: 'USD',
      fundType: 'building',
      paymentMethod: 'google_pay',
      transactionReference: 'UPI-GPAY-9831920',
      notes: 'Seed toward the church sanctuary renovation.',
      status: 'verified',
      date: '2026-09-18T16:00:00.000Z',
    },
  ];

  return {
    users: [ashishUser, aniketUser, adminUser, member1, member2],
    referrals,
    sermons,
    songs,
    photoAlbums,
    photos,
    videos,
    liveConfig,
    events,
    eventRegistrations,
    prayerRequests,
    zoomMeetings,
    googleMeetings,
    activities,
    notifications,
    socialLinks,
    contactMessages,
    homepageSettings,
    churchSettings,
    bibleBookmarks,
    donations,
    paymentDetails,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        const initial = getInitialData();
        if (!parsed.songs) {
          parsed.songs = initial.songs;
        }
        if (!parsed.donations) {
          parsed.donations = [];
        }
        if (!parsed.paymentDetails) {
          parsed.paymentDetails = initial.paymentDetails;
        }
        // Ensure default leadership accounts (Ashish, Aniket, Admin, Grace, Joshua) are present
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = initial.users;
        } else {
          for (const initUser of initial.users) {
            const exists = parsed.users.some(
              (u: any) =>
                u.email?.toLowerCase() === initUser.email.toLowerCase() ||
                u.memberId === initUser.memberId
            );
            if (!exists) {
              parsed.users.unshift(initUser);
            }
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error reading database file, resetting to initial seed:', e);
    }
    const initial = getInitialData();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_PATH);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public resetToDemoData() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  public clearAllDemoData() {
    // Keep only admin
    const admin = this.data.users.find(u => u.role === 'admin') || getInitialData().users[0];
    this.data = {
      ...getInitialData(),
      users: [admin],
      referrals: [],
      sermons: [],
      songs: [],
      photoAlbums: [],
      photos: [],
      videos: [],
      events: [],
      eventRegistrations: [],
      prayerRequests: [],
      zoomMeetings: [],
      googleMeetings: [],
      contactMessages: [],
      notifications: [],
      bibleBookmarks: [],
    };
    this.save();
    return this.data;
  }
}

export const db = new Database();
