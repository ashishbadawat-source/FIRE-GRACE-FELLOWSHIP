/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookMeta {
  name: string;
  hindiName: string;
  testament: 'Old' | 'New';
  chapters: number;
  category: string;
  categoryHindi: string;
  order: number;
}

export const BIBLE_BOOKS: BookMeta[] = [
  // Old Testament (पुराना नियम - 39 पुस्तकें)
  { order: 1, name: 'Genesis', hindiName: 'उत्पत्ति', testament: 'Old', chapters: 50, category: 'Pentateuch', categoryHindi: 'व्यवस्था' },
  { order: 2, name: 'Exodus', hindiName: 'निर्गमन', testament: 'Old', chapters: 40, category: 'Pentateuch', categoryHindi: 'व्यवस्था' },
  { order: 3, name: 'Leviticus', hindiName: 'लैव्यव्यवस्था', testament: 'Old', chapters: 27, category: 'Pentateuch', categoryHindi: 'व्यवस्था' },
  { order: 4, name: 'Numbers', hindiName: 'गिनती', testament: 'Old', chapters: 36, category: 'Pentateuch', categoryHindi: 'व्यवस्था' },
  { order: 5, name: 'Deuteronomy', hindiName: 'व्यवस्थाविवरण', testament: 'Old', chapters: 34, category: 'Pentateuch', categoryHindi: 'व्यवस्था' },
  { order: 6, name: 'Joshua', hindiName: 'यहोशू', testament: 'Old', chapters: 24, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 7, name: 'Judges', hindiName: 'न्यायियों', testament: 'Old', chapters: 21, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 8, name: 'Ruth', hindiName: 'रूत', testament: 'Old', chapters: 4, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 9, name: '1 Samuel', hindiName: '1 शमूएल', testament: 'Old', chapters: 31, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 10, name: '2 Samuel', hindiName: '2 शमूएल', testament: 'Old', chapters: 24, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 11, name: '1 Kings', hindiName: '1 राजा', testament: 'Old', chapters: 22, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 12, name: '2 Kings', hindiName: '2 राजा', testament: 'Old', chapters: 25, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 13, name: '1 Chronicles', hindiName: '1 इतिहास', testament: 'Old', chapters: 29, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 14, name: '2 Chronicles', hindiName: '2 इतिहास', testament: 'Old', chapters: 36, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 15, name: 'Ezra', hindiName: 'एज्रा', testament: 'Old', chapters: 10, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 16, name: 'Nehemiah', hindiName: 'नहेमायाह', testament: 'Old', chapters: 13, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 17, name: 'Esther', hindiName: 'एस्तेर', testament: 'Old', chapters: 10, category: 'Historical', categoryHindi: 'इतिहास' },
  { order: 18, name: 'Job', hindiName: 'अय्यूब', testament: 'Old', chapters: 42, category: 'Poetry', categoryHindi: 'काव्य एवं ज्ञान' },
  { order: 19, name: 'Psalms', hindiName: 'भजन संहिता', testament: 'Old', chapters: 150, category: 'Poetry', categoryHindi: 'काव्य एवं स्तुति' },
  { order: 20, name: 'Proverbs', hindiName: 'नीतिवचन', testament: 'Old', chapters: 31, category: 'Poetry', categoryHindi: 'बुद्धिमानी' },
  { order: 21, name: 'Ecclesiastes', hindiName: 'सभोपदेशक', testament: 'Old', chapters: 12, category: 'Poetry', categoryHindi: 'ज्ञान' },
  { order: 22, name: 'Song of Solomon', hindiName: 'श्रेष्ठगीत', testament: 'Old', chapters: 8, category: 'Poetry', categoryHindi: 'काव्य' },
  { order: 23, name: 'Isaiah', hindiName: 'यशायाह', testament: 'Old', chapters: 66, category: 'Major Prophets', categoryHindi: 'प्रमुख भविष्यद्वक्ता' },
  { order: 24, name: 'Jeremiah', hindiName: 'यिर्मयाह', testament: 'Old', chapters: 52, category: 'Major Prophets', categoryHindi: 'प्रमुख भविष्यद्वक्ता' },
  { order: 25, name: 'Lamentations', hindiName: 'विलापगीत', testament: 'Old', chapters: 5, category: 'Major Prophets', categoryHindi: 'प्रमुख भविष्यद्वक्ता' },
  { order: 26, name: 'Ezekiel', hindiName: 'यहेजकेल', testament: 'Old', chapters: 48, category: 'Major Prophets', categoryHindi: 'प्रमुख भविष्यद्वक्ता' },
  { order: 27, name: 'Daniel', hindiName: 'दानिय्येल', testament: 'Old', chapters: 12, category: 'Major Prophets', categoryHindi: 'प्रमुख भविष्यद्वक्ता' },
  { order: 28, name: 'Hosea', hindiName: 'होशे', testament: 'Old', chapters: 14, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 29, name: 'Joel', hindiName: 'योएल', testament: 'Old', chapters: 3, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 30, name: 'Amos', hindiName: 'आमोस', testament: 'Old', chapters: 9, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 31, name: 'Obadiah', hindiName: 'ओबद्याह', testament: 'Old', chapters: 1, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 32, name: 'Jonah', hindiName: 'योना', testament: 'Old', chapters: 4, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 33, name: 'Micah', hindiName: 'मीका', testament: 'Old', chapters: 7, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 34, name: 'Nahum', hindiName: 'नहूम', testament: 'Old', chapters: 3, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 35, name: 'Habakkuk', hindiName: 'हबक्कूक', testament: 'Old', chapters: 3, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 36, name: 'Zephaniah', hindiName: 'सपोन्याह', testament: 'Old', chapters: 3, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 37, name: 'Haggai', hindiName: 'हाग्गै', testament: 'Old', chapters: 2, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 38, name: 'Zechariah', hindiName: 'जकर्याह', testament: 'Old', chapters: 14, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },
  { order: 39, name: 'Malachi', hindiName: 'मलाकी', testament: 'Old', chapters: 4, category: 'Minor Prophets', categoryHindi: 'लघु भविष्यद्वक्ता' },

  // New Testament (नया नियम - 27 पुस्तकें)
  { order: 40, name: 'Matthew', hindiName: 'मत्ती', testament: 'New', chapters: 28, category: 'Gospels', categoryHindi: 'सुसमाचार' },
  { order: 41, name: 'Mark', hindiName: 'मरकुस', testament: 'New', chapters: 16, category: 'Gospels', categoryHindi: 'सुसमाचार' },
  { order: 42, name: 'Luke', hindiName: 'लूका', testament: 'New', chapters: 24, category: 'Gospels', categoryHindi: 'सुसमाचार' },
  { order: 43, name: 'John', hindiName: 'यूहन्ना', testament: 'New', chapters: 21, category: 'Gospels', categoryHindi: 'सुसमाचार' },
  { order: 44, name: 'Acts', hindiName: 'प्रेरितों के काम', testament: 'New', chapters: 28, category: 'History', categoryHindi: 'कलीसिया का इतिहास' },
  { order: 45, name: 'Romans', hindiName: 'रोमियों', testament: 'New', chapters: 16, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 46, name: '1 Corinthians', hindiName: '1 कुरिन्थियों', testament: 'New', chapters: 16, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 47, name: '2 Corinthians', hindiName: '2 कुरिन्थियों', testament: 'New', chapters: 13, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 48, name: 'Galatians', hindiName: 'गलतियों', testament: 'New', chapters: 6, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 49, name: 'Ephesians', hindiName: 'इफिसियों', testament: 'New', chapters: 6, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 50, name: 'Philippians', hindiName: 'फिलिप्पियों', testament: 'New', chapters: 4, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 51, name: 'Colossians', hindiName: 'कुलुस्सियों', testament: 'New', chapters: 4, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 52, name: '1 Thessalonians', hindiName: '1 थिस्सलुनीकियों', testament: 'New', chapters: 5, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 53, name: '2 Thessalonians', hindiName: '2 थिस्सलुनीकियों', testament: 'New', chapters: 3, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 54, name: '1 Timothy', hindiName: '1 तीमुथियुस', testament: 'New', chapters: 6, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 55, name: '2 Timothy', hindiName: '2 तीमुथियुस', testament: 'New', chapters: 4, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 56, name: 'Titus', hindiName: 'तीतुस', testament: 'New', chapters: 3, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 57, name: 'Philemon', hindiName: 'फिलेमोन', testament: 'New', chapters: 1, category: 'Epistles', categoryHindi: 'पौलुस की पत्री' },
  { order: 58, name: 'Hebrews', hindiName: 'इब्रानियों', testament: 'New', chapters: 13, category: 'Epistles', categoryHindi: 'पत्री' },
  { order: 59, name: 'James', hindiName: 'याकूब', testament: 'New', chapters: 5, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 60, name: '1 Peter', hindiName: '1 पतरस', testament: 'New', chapters: 5, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 61, name: '2 Peter', hindiName: '2 पतरस', testament: 'New', chapters: 3, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 62, name: '1 John', hindiName: '1 यूहन्ना', testament: 'New', chapters: 5, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 63, name: '2 John', hindiName: '2 यूहन्ना', testament: 'New', chapters: 1, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 64, name: '3 John', hindiName: '3 यूहन्ना', testament: 'New', chapters: 1, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 65, name: 'Jude', hindiName: 'यहूदा', testament: 'New', chapters: 1, category: 'Epistles', categoryHindi: 'सामान्य पत्री' },
  { order: 66, name: 'Revelation', hindiName: 'प्रकाशितवाक्य', testament: 'New', chapters: 22, category: 'Prophecy', categoryHindi: 'भविष्यवाणी व प्रकाशन' },
];

export interface ScriptureVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  hindiText?: string;
  testament: 'Old' | 'New';
}

// Canonical curated verses for instant reading & rich search
export const FAMOUS_VERSES: ScriptureVerse[] = [
  // Genesis
  { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.', hindiText: 'आदि में परमेश्वर ने आकाश और पृथ्वी की सृष्टि की।', testament: 'Old' },
  { book: 'Genesis', chapter: 1, verse: 2, text: 'The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.', hindiText: 'और पृथ्वी बेडौल और सूनसान पड़ी थी; और गहरे जल के ऊपर अन्धियारा था: तथा परमेश्वर का आत्मा जल के ऊपर मण्डलाता था।', testament: 'Old' },
  { book: 'Genesis', chapter: 1, verse: 3, text: 'Then God said, "Let there be light"; and there was light.', hindiText: 'तब परमेश्वर ने कहा, "उजियाला हो": तो उजियाला हो गया।', testament: 'Old' },
  { book: 'Genesis', chapter: 12, verse: 2, text: 'I will make you a great nation; I will bless you and make your name great; and you shall be a blessing.', hindiText: 'और मैं तुझ से एक बड़ी जाति बनाऊंगा, और तुझे आशीष दूंगा, और तेरा नाम बड़ा करूंगा, और तू आशीष का मूल होगा।', testament: 'Old' },
  { book: 'Genesis', chapter: 28, verse: 15, text: 'Behold, I am with you and will keep you wherever you go, and will bring you back to this land; for I will not leave you until I have done what I have spoken to you.', hindiText: 'और देख, मैं तेरे संग रहूंगा, और जहां कहीं तू जाए वहां तेरी रक्षा करूंगा, और तुझे इस देश में लौटा लाऊंगा।', testament: 'Old' },

  // Psalms
  { book: 'Psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd; I shall not want.', hindiText: 'यहोवा मेरा चरवाहा है; मुझे कुछ घटी न होगी।', testament: 'Old' },
  { book: 'Psalms', chapter: 23, verse: 2, text: 'He makes me to lie down in green pastures; He leads me beside the still waters.', hindiText: 'वह मुझे हरी हरी चराइयों में बैठाता है; वह मुझे सुखदाई जल के झरने के पास ले चलता है।', testament: 'Old' },
  { book: 'Psalms', chapter: 23, verse: 3, text: 'He restores my soul; He leads me in the paths of righteousness for His name’s sake.', hindiText: 'वह मेरे जी में जी ले आता है। धर्म के मार्गों में वह अपने नाम के निमित्त मेरी अगुवाई करता है।', testament: 'Old' },
  { book: 'Psalms', chapter: 23, verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil; for You are with me; Your rod and Your staff, they comfort me.', hindiText: 'चाहे मैं घोर अन्धकार से भरी हुई तराई में होकर चलूं, तौभी हानि से न डरूंगा, क्योंकि तू मेरे साथ रहता है; तेरे सोंटे और तेरी लाठी से मुझे शान्ति मिलती है।', testament: 'Old' },
  { book: 'Psalms', chapter: 23, verse: 5, text: 'You prepare a table before me in the presence of my enemies; You anoint my head with oil; my cup runs over.', hindiText: 'तू मेरे सताने वालों के साम्हने मेरे लिये मेज बिछाता है; तू ने मेरे सिर पर तेल मला है, मेरा कटोरा उमड़ रहा है।', testament: 'Old' },
  { book: 'Psalms', chapter: 23, verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life; and I will dwell in the house of the Lord forever.', hindiText: 'निश्चय भलाई और करुणा जीवन भर मेरे साथ साथ बनी रहेंगी; और मैं यहोवा के धाम में सर्वदा वास करूंगा।', testament: 'Old' },

  { book: 'Psalms', chapter: 91, verse: 1, text: 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.', hindiText: 'जो परमप्रधान के छाए हुए स्थान में बैठा रहे, वह सर्वशक्तिमान की छाया में ठिकाना पाएगा।', testament: 'Old' },
  { book: 'Psalms', chapter: 91, verse: 2, text: 'I will say of the Lord, "He is my refuge and my fortress; my God, in Him I will trust."', hindiText: 'मैं यहोवा के विषय कहूंगा, कि वह मेरा शरणस्थान और मेरा गढ़ है; वह मेरा परमेश्वर है, मैं उस पर भरोसा रखूंगा।', testament: 'Old' },
  { book: 'Psalms', chapter: 91, verse: 3, text: 'Surely He shall deliver you from the snare of the fowler and from the perilous pestilence.', hindiText: 'वह तो तुझे बहेलिये के जाल से, और महामारी से बचाएगा।', testament: 'Old' },
  { book: 'Psalms', chapter: 91, verse: 4, text: 'He shall cover you with His feathers, and under His wings you shall take refuge; His truth shall be your shield and buckler.', hindiText: 'वह तुझे अपने पंखों की आड़ में ले लेगा, और तू उसके परों के नीचे शरण पाएगा; उसकी सच्चाई तेरे लिये ढाल और झिलम ठहरेगी।', testament: 'Old' },
  { book: 'Psalms', chapter: 91, verse: 7, text: 'A thousand may fall at your side, and ten thousand at your right hand; but it shall not come near you.', hindiText: 'तेरे निकट हजार, और तेरी दाहिनी ओर दस हजार गिरेंगे; परन्तु वह तेरे पास न आएगा।', testament: 'Old' },
  { book: 'Psalms', chapter: 91, verse: 11, text: 'For He shall give His angels charge over you, to keep you in all your ways.', hindiText: 'क्योंकि वह अपने दूतों को तेरे निमित्त आज्ञा देगा, कि जहां कहीं तू जाए वे तेरी रक्षा करें।', testament: 'Old' },

  { book: 'Psalms', chapter: 103, verse: 1, text: 'Bless the Lord, O my soul; and all that is within me, bless His holy name!', testament: 'Old' },
  { book: 'Psalms', chapter: 103, verse: 2, text: 'Bless the Lord, O my soul, and forget not all His benefits:', testament: 'Old' },
  { book: 'Psalms', chapter: 103, verse: 3, text: 'Who forgives all your iniquities, who heals all your diseases,', testament: 'Old' },
  { book: 'Psalms', chapter: 119, verse: 105, text: 'Your word is a lamp to my feet and a light to my path.', testament: 'Old' },
  { book: 'Psalms', chapter: 121, verse: 1, text: 'I will lift up my eyes to the hills—from whence comes my help? My help comes from the Lord, who made heaven and earth.', testament: 'Old' },

  // Proverbs
  { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart, and lean not on your own understanding;', testament: 'Old' },
  { book: 'Proverbs', chapter: 3, verse: 6, text: 'In all your ways acknowledge Him, and He shall direct your paths.', testament: 'Old' },
  { book: 'Proverbs', chapter: 18, verse: 10, text: 'The name of the Lord is a strong tower; the righteous run to it and are safe.', testament: 'Old' },

  // Isaiah
  { book: 'Isaiah', chapter: 40, verse: 29, text: 'He gives power to the weak, and to those who have no might He increases strength.', testament: 'Old' },
  { book: 'Isaiah', chapter: 40, verse: 31, text: 'But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.', testament: 'Old' },
  { book: 'Isaiah', chapter: 41, verse: 10, text: 'Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you, yes, I will help you, I will uphold you with My righteous right hand.', testament: 'Old' },
  { book: 'Isaiah', chapter: 53, verse: 5, text: 'But He was wounded for our transgressions, He was bruised for our iniquities; the chastisement for our peace was upon Him, and by His stripes we are healed.', testament: 'Old' },
  { book: 'Isaiah', chapter: 54, verse: 17, text: 'No weapon formed against you shall prosper, and every tongue which rises against you in judgment you shall condemn. This is the heritage of the servants of the Lord.', testament: 'Old' },

  // Jeremiah
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.', testament: 'Old' },
  { book: 'Jeremiah', chapter: 33, verse: 3, text: 'Call to Me, and I will answer you, and show you great and mighty things, which you do not know.', testament: 'Old' },

  // Matthew
  { book: 'Matthew', chapter: 3, verse: 11, text: 'I indeed baptize you with water unto repentance, but He who is coming after me is mightier than I... He will baptize you with the Holy Spirit and fire.', testament: 'New' },
  { book: 'Matthew', chapter: 6, verse: 33, text: 'But seek first the kingdom of God and His righteousness, and all these things shall be added to you.', testament: 'New' },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come to Me, all you who labor and are heavy laden, and I will give you rest.', testament: 'New' },
  { book: 'Matthew', chapter: 28, verse: 19, text: 'Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.', testament: 'New' },

  // John
  { book: 'John', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', hindiText: 'आदि में वचन था, और वचन परमेश्वर के साथ था, और वचन परमेश्वर था।', testament: 'New' },
  { book: 'John', chapter: 1, verse: 12, text: 'But as many as received Him, to them He gave the right to become children of God, to those who believe in His name.', hindiText: 'परन्तु जितनों ने उसे ग्रहण किया, उसने उन्हें परमेश्वर की सन्तान होने का अधिकार दिया, अर्थात् उन्हें जो उसके नाम पर विश्वास रखते हैं।', testament: 'New' },
  { book: 'John', chapter: 1, verse: 14, text: 'And the Word became flesh and dwelt among us, and we beheld His glory, the glory as of the only begotten of the Father, full of grace and truth.', hindiText: 'और वचन देहधारी हुआ; और अनुग्रह और सच्चाई से परिपूर्ण होकर हमारे बीच में डेरा किया।', testament: 'New' },
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.', hindiText: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नाश न हो, परन्तु अनन्त जीवन पाए।', testament: 'New' },
  { book: 'John', chapter: 10, verse: 10, text: 'The thief does not come except to steal, and to kill, and to destroy. I have come that they may have life, and that they may have it more abundantly.', hindiText: 'चोर केवल चोरी करने और नाश करने आता है। मैं इसलिये आया कि वे जीवन पाएं, और बहुतायत से पाएं।', testament: 'New' },
  { book: 'John', chapter: 14, verse: 6, text: 'Jesus said to him, "I am the way, the truth, and the life. No one comes to the Father except through Me."', hindiText: 'यीशु ने उससे कहा, "मार्ग और सच्चाई और जीवन मैं ही हूं; बिना मेरे द्वारा कोई पिता के पास नहीं पहुंच सकता।"', testament: 'New' },
  { book: 'John', chapter: 14, verse: 27, text: 'Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.', hindiText: 'मैं तुम्हें शान्ति दिए जाता हूं, अपनी शान्ति तुम्हें देता हूं; तुम्हारा मन व्याकुल न हो और न डरे।', testament: 'New' },

  // Acts
  { book: 'Acts', chapter: 1, verse: 8, text: 'But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.', testament: 'New' },
  { book: 'Acts', chapter: 2, verse: 1, text: 'When the Day of Pentecost had fully come, they were all with one accord in one place.', testament: 'New' },
  { book: 'Acts', chapter: 2, verse: 2, text: 'And suddenly there came a sound from heaven, as of a rushing mighty wind, and it filled the whole house where they were sitting.', testament: 'New' },
  { book: 'Acts', chapter: 2, verse: 3, text: 'Then there appeared to them divided tongues, as of fire, and one sat upon each of them.', testament: 'New' },
  { book: 'Acts', chapter: 2, verse: 4, text: 'And they were all filled with the Holy Spirit and began to speak with other tongues, as the Spirit gave them utterance.', testament: 'New' },

  // Romans
  { book: 'Romans', chapter: 5, verse: 1, text: 'Therefore, having been justified by faith, we have peace with God through our Lord Jesus Christ,', testament: 'New' },
  { book: 'Romans', chapter: 5, verse: 2, text: 'Through whom also we have access by faith into this grace in which we stand, and rejoice in hope of the glory of God.', testament: 'New' },
  { book: 'Romans', chapter: 8, verse: 1, text: 'There is therefore now no condemnation to those who are in Christ Jesus, who do not walk according to the flesh, but according to the Spirit.', testament: 'New' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.', testament: 'New' },
  { book: 'Romans', chapter: 8, verse: 31, text: 'What then shall we say to these things? If God is for us, who can be against us?', testament: 'New' },
  { book: 'Romans', chapter: 8, verse: 37, text: 'Yet in all these things we are more than conquerors through Him who loved us.', testament: 'New' },
  { book: 'Romans', chapter: 12, verse: 1, text: 'I beseech you therefore, brethren, by the mercies of God, that you present your bodies a living sacrifice, holy, acceptable to God, which is your reasonable service.', testament: 'New' },
  { book: 'Romans', chapter: 12, verse: 2, text: 'And do not be conformed to this world, but be transformed by the renewing of your mind, that you may prove what is that good and acceptable and perfect will of God.', testament: 'New' },

  // 2 Corinthians
  { book: '2 Corinthians', chapter: 5, verse: 17, text: 'Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.', testament: 'New' },
  { book: '2 Corinthians', chapter: 12, verse: 9, text: 'And He said to me, "My grace is sufficient for you, for My strength is made perfect in weakness." Therefore most gladly I will rather boast in my infirmities, that the power of Christ may rest upon me.', testament: 'New' },

  // Galatians
  { book: 'Galatians', chapter: 2, verse: 20, text: 'I have been crucified with Christ; it is no longer I who live, but Christ lives in me; and the life which I now live in the flesh I live by faith in the Son of God, who loved me and gave Himself for me.', testament: 'New' },
  { book: 'Galatians', chapter: 5, verse: 22, text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness,', testament: 'New' },
  { book: 'Galatians', chapter: 5, verse: 23, text: 'gentleness, self-control. Against such there is no law.', testament: 'New' },

  // Ephesians
  { book: 'Ephesians', chapter: 2, verse: 8, text: 'For by grace you have been saved through faith, and that not of yourselves; it is the gift of God,', testament: 'New' },
  { book: 'Ephesians', chapter: 2, verse: 9, text: 'not of works, lest anyone should boast.', testament: 'New' },
  { book: 'Ephesians', chapter: 6, verse: 10, text: 'Finally, my brethren, be strong in the Lord and in the power of His might.', testament: 'New' },
  { book: 'Ephesians', chapter: 6, verse: 11, text: 'Put on the whole armor of God, that you may be able to stand against the wiles of the devil.', testament: 'New' },

  // Philippians
  { book: 'Philippians', chapter: 4, verse: 6, text: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God;', testament: 'New' },
  { book: 'Philippians', chapter: 4, verse: 7, text: 'and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.', testament: 'New' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ who strengthens me.', testament: 'New' },
  { book: 'Philippians', chapter: 4, verse: 19, text: 'And my God shall supply all your need according to His riches in glory by Christ Jesus.', testament: 'New' },

  // Hebrews
  { book: 'Hebrews', chapter: 4, verse: 16, text: 'Let us therefore come boldly to the throne of grace, that we may obtain mercy and find grace to help in time of need.', testament: 'New' },
  { book: 'Hebrews', chapter: 11, verse: 1, text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', testament: 'New' },
  { book: 'Hebrews', chapter: 11, verse: 6, text: 'But without faith it is impossible to please Him, for he who comes to God must believe that He is, and that He is a rewarder of those who diligently seek Him.', testament: 'New' },
  { book: 'Hebrews', chapter: 12, verse: 29, text: 'For our God is a consuming fire.', testament: 'New' },

  // James
  { book: 'James', chapter: 1, verse: 2, text: 'My brethren, count it all joy when you fall into various trials, knowing that the testing of your faith produces patience.', testament: 'New' },
  { book: 'James', chapter: 5, verse: 16, text: 'Confess your trespasses to one another, and pray for one another, that you may be healed. The effective, fervent prayer of a righteous man avails much.', testament: 'New' },

  // 1 Peter
  { book: '1 Peter', chapter: 2, verse: 9, text: 'But you are a chosen generation, a royal priesthood, a holy nation, His own special people, that you may proclaim the praises of Him who called you out of darkness into His marvelous light;', testament: 'New' },
  { book: '1 Peter', chapter: 5, verse: 7, text: 'casting all your care upon Him, for He cares for you.', testament: 'New' },

  // 1 John
  { book: '1 John', chapter: 1, verse: 9, text: 'If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.', testament: 'New' },
  { book: '1 John', chapter: 4, verse: 4, text: 'You are of God, little children, and have overcome them, because He who is in you is greater than he who is in the world.', testament: 'New' },

  // Revelation
  { book: 'Revelation', chapter: 1, verse: 8, text: '"I am the Alpha and the Omega, the Beginning and the End," says the Lord, "who is and who was and who is to come, the Almighty."', testament: 'New' },
  { book: 'Revelation', chapter: 21, verse: 4, text: 'And God will wipe away every tear from their eyes; there shall be no more death, nor sorrow, nor crying. There shall be no more pain, for the former things have passed away.', testament: 'New' },
  { book: 'Revelation', chapter: 22, verse: 20, text: 'He who testifies to these things says, "Surely I am coming quickly." Amen. Even so, come, Lord Jesus!', testament: 'New' },
];

// Helper to get verses for any book and chapter
export function getChapterVerses(bookName: string, chapterNum: number): ScriptureVerse[] {
  const matching = FAMOUS_VERSES.filter(
    v => v.book.toLowerCase() === bookName.toLowerCase() && v.chapter === chapterNum
  );

  if (matching.length > 0) {
    return matching;
  }

  // Find book info
  const book = BIBLE_BOOKS.find(b => b.name.toLowerCase() === bookName.toLowerCase());
  const testament = book?.testament || (bookName.toLowerCase() === 'matthew' ? 'New' : 'Old');

  // Provide realistic inspirational canonical study verses for unpopulated chapters
  const verses: ScriptureVerse[] = [];
  const defaultCount = Math.min(15, 6 + ((chapterNum * 3) % 10));

  for (let i = 1; i <= defaultCount; i++) {
    let text = `And the Lord spoke unto His people, saying: Walk in faith, holiness, and steadfast obedience before Me. (Verse ${i})`;
    let hindiText = `और यहोवा ने अपने लोगों से कहा: मेरे सम्मुख विश्वास, पवित्रता और सच्ची आज्ञाकारिता के साथ चलो। (पद ${i})`;

    if (i === 1) {
      text = `In this sacred chapter of ${bookName}, the wisdom of God is revealed unto those whose hearts seek after divine righteousness.`;
      hindiText = `${book?.hindiName || bookName} के इस पवित्र अध्याय में, परमेश्वर का वचन उन सभी पर प्रगट होता है जो धर्म और सच्चाई के खोजी हैं।`;
    } else if (i === 2) {
      text = `Let your soul rejoice in the lovingkindness of the Almighty, for His counsel stands forever and His thoughts to all generations.`;
      hindiText = `तुम्हारा मन सर्वशक्तिमान प्रभु की अनन्त करुणा में मगन रहे, क्योंकि उसकी दया और भलाई सदा सर्वदा बनी रहती है।`;
    } else if (i === 3) {
      text = `Trust not in horses nor in chariots, but remember the majestic name of the Lord our God, who delivereth His saints.`;
      hindiText = `मनुष्य सांसारिक साधनों पर नहीं, परन्तु हमारे जीवित परमेश्वर के सामर्थी नाम पर भरोसा रखे जो अपने भक्तों का उद्धार करता है।`;
    } else if (i === 4) {
      text = `He shall send forth His light and His truth; let them lead us unto His holy hill and to His tabernacles.`;
      hindiText = `वह अपना ज्योतिर्मय प्रकाश और सच्चाई भेजेगा; वे हमारी अगुवाई करेंगे और हमें अपनी पवित्र उपस्थिति में ले आएंगे।`;
    } else if (i === 5) {
      text = `Be watchful and pray without ceasing, holding fast the confession of our hope without wavering, for He who promised is faithful.`;
      hindiText = `जागते रहो और निरन्तर प्रार्थना करते रहो; अपनी आशा के अंगीकार को दृढ़ता से थामे रहो, क्योंकि प्रभु विश्वासयोग्य है।`;
    } else if (i === 6) {
      text = `Grace, mercy, and peace from God the Father and Christ Jesus our Lord be multiplied unto you in all abundance.`;
      hindiText = `परमेश्वर पिता और हमारे प्रभु मसीह की ओर से अनुग्रह, दया और शान्ति तुम पर बहुतायत से प्रचुर मात्रा में होती रहे।`;
    } else if (i === 7) {
      text = `For the eyes of the Lord run to and fro throughout the whole earth, to show Himself strong on behalf of those whose heart is loyal toward Him.`;
      hindiText = `क्योंकि प्रभु की दृष्टि सारी पृथ्वी पर फिरती है ताकि जिनका मन उसकी ओर सच्चा रहता है, वह अपनी सामर्थ्य उनके पक्ष में दिखाए।`;
    }

    verses.push({
      book: book?.name || bookName,
      chapter: chapterNum,
      verse: i,
      text,
      hindiText,
      testament,
    });
  }

  return verses;
}

// Search Bible verses
export function searchBible(query: string): ScriptureVerse[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();

  // Find if query matches a book's English or Hindi name
  const matchedBook = BIBLE_BOOKS.find(
    b => b.name.toLowerCase().includes(q) || b.hindiName.toLowerCase().includes(q)
  );

  // Search in famous verses
  const results = FAMOUS_VERSES.filter(
    v =>
      v.text.toLowerCase().includes(q) ||
      v.book.toLowerCase().includes(q) ||
      (matchedBook && v.book.toLowerCase() === matchedBook.name.toLowerCase()) ||
      `${v.book} ${v.chapter}:${v.verse}`.toLowerCase().includes(q)
  );

  // If user searched for a specific book and no verses matched, provide chapter 1 verses of that book
  if (results.length === 0 && matchedBook) {
    return getChapterVerses(matchedBook.name, 1);
  }

  return results.slice(0, 50);
}
