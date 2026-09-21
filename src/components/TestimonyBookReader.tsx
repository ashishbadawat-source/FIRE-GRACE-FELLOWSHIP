/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Bookmark,
  Check,
  Search,
  Printer,
  Flame,
  Quote,
} from 'lucide-react';
import { FREE_TESTIMONY_BOOK, TestimonyBookChapter } from '../data/testimonyBook';

interface TestimonyBookReaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestimonyBookReader: React.FC<TestimonyBookReaderProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [bookmarkedStories, setBookmarkedStories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fgf_testimony_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const currentChapter: TestimonyBookChapter = FREE_TESTIMONY_BOOK.chapters[currentChapterIndex];

  const toggleBookmark = (storyId: string) => {
    const updated = bookmarkedStories.includes(storyId)
      ? bookmarkedStories.filter(id => id !== storyId)
      : [...bookmarkedStories, storyId];
    setBookmarkedStories(updated);
    try {
      localStorage.setItem('fgf_testimony_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDownloadBook = () => {
    // Generate an offline-friendly HTML book that can be saved or printed as PDF
    const bookHtml = `
      <!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="utf-8">
        <title>${FREE_TESTIMONY_BOOK.titleHindi} - Free E-Book</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
          .cover { text-align: center; border-bottom: 3px double #f59e0b; padding-bottom: 40px; margin-bottom: 40px; }
          .title { font-size: 28px; color: #b45309; font-weight: bold; margin-bottom: 8px; }
          .subtitle { font-size: 16px; color: #475569; margin-bottom: 16px; }
          .edition { font-size: 13px; color: #94a3b8; font-weight: bold; text-transform: uppercase; }
          .preface { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 40px; font-style: italic; white-space: pre-line; }
          .chapter-title { font-size: 22px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 50px; }
          .theme-verse { background: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 14px; color: #334155; margin-bottom: 24px; }
          .story { margin-bottom: 40px; page-break-inside: avoid; }
          .story-title { font-size: 18px; color: #b45309; font-weight: bold; }
          .meta { font-size: 13px; color: #64748b; margin-bottom: 12px; }
          .story-content { font-size: 15px; color: #334155; white-space: pre-line; text-align: justify; }
          .impact { background: #ecfdf5; border-left: 3px solid #10b981; padding: 8px 12px; margin-top: 12px; font-size: 13px; color: #065f46; }
          @media print {
            body { padding: 0; }
            .chapter-title { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="cover">
          <div class="edition">🔥 ${FREE_TESTIMONY_BOOK.edition}</div>
          <h1 class="title">${FREE_TESTIMONY_BOOK.titleHindi}</h1>
          <div class="subtitle">${FREE_TESTIMONY_BOOK.subtitleHindi}</div>
          <p style="color: #64748b; font-size: 14px;">प्रकाशक: ${FREE_TESTIMONY_BOOK.publisher}</p>
        </div>

        <div class="preface">
          <strong>आमुख (Preface):</strong>
          ${FREE_TESTIMONY_BOOK.prefaceHindi}
        </div>

        ${FREE_TESTIMONY_BOOK.chapters
          .map(
            ch => `
          <div class="chapter">
            <h2 class="chapter-title">${ch.titleHindi}</h2>
            <div class="theme-verse">
              <strong>वचन:</strong> "${ch.themeVerse}" (<em>${ch.verseRef}</em>)
            </div>
            ${ch.stories
              .map(
                st => `
              <div class="story">
                <div class="story-title">✝ ${st.titleHindi}</div>
                <div class="meta">
                  गवाह: <strong>${st.personName}</strong> | स्थान: ${st.location} | दिनांक: ${st.date}
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #0284c7; margin-bottom: 8px;">वचन आधार: ${st.keyVerse}</div>
                <div class="story-content">${st.fullStoryHindi}</div>
                <div class="impact">🌟 <strong>आशीष व फल:</strong> ${st.impactHindi}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}

        <footer style="margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          यह निःशुल्क जीवित गवाही पुस्तिका फायर एंड ग्रेस फेलोशिप द्वारा ईश्वरीय महिमा हेतु निशुल्क वितरित है।
        </footer>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([bookHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // If popup blocked, create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fire_Grace_Free_Testimony_Book_2026.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleShareStory = (story: any) => {
    const text = `📖 *जीवित गवाही पुस्तिका (Free Testimony Book)*\n\n*${story.titleHindi}*\n\nगवाह: ${story.personName} (${story.location})\nवचन: ${story.keyVerse}\n\n"${story.summaryHindi}"\n\nप्रभु यीशु की महिमा हो! पूरी गवाही पुस्तक ऑनलाइन पढ़ें:\n${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: story.titleHindi, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Search filter across all chapters
  const searchResults = searchQuery.trim()
    ? FREE_TESTIMONY_BOOK.chapters.flatMap(ch =>
        ch.stories
          .filter(
            st =>
              st.titleHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
              st.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              st.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
              st.fullStoryHindi.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(st => ({ ...st, chapterTitle: ch.titleHindi }))
      )
    : [];

  const textClasses =
    fontSize === 'xlarge'
      ? 'text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-relaxed';

  return (
    <div
      id="testimony-book-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-200">
        {/* Book Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  निशुल्क ई-बुक (Free E-Book)
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">2026 Edition</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {FREE_TESTIMONY_BOOK.titleHindi}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size controls */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg transition ${
                  fontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Normal Text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  fontSize === 'large' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Large Text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Extra Large Text"
              >
                A++
              </button>
            </div>

            {/* Print / Download Free PDF */}
            <button
              onClick={handleDownloadBook}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              title="डाउनलोड या प्रिंट करें (Download / Print PDF)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">फ्री डाउनलोड PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Chapter Bar */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs text-amber-400 font-semibold shrink-0 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> अध्याय चुनें:
            </span>
            {FREE_TESTIMONY_BOOK.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentChapterIndex(idx);
                  setSelectedStoryId(null);
                  setSearchQuery('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                  currentChapterIndex === idx && !searchQuery
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                अध्याय {ch.chapterNumber}
              </button>
            ))}
          </div>

          {/* Search inside Book */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="गवाही में खोजें (Search)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Book Body: Two columns layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Stories Index for Current Chapter */}
          <div className="w-full md:w-80 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-4 overflow-y-auto shrink-0 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery ? `खोज परिणाम (${searchResults.length})` : `अध्याय ${currentChapter.chapterNumber} की गवाहियां`}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {searchQuery ? `${searchResults.length} मिली` : `${currentChapter.stories.length} गवाहियां`}
              </span>
            </div>

            {searchQuery ? (
              searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  कोई गवाही नहीं मिली। कृपया दूसरा शब्द खोजें।
                </div>
              ) : (
                searchResults.map(st => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStoryId(st.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition border text-left ${
                      selectedStoryId === st.id
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-amber-400 font-semibold mb-1">{st.chapterTitle}</div>
                    <div className="text-xs font-bold line-clamp-2">{st.titleHindi}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {st.personName} • {st.location}
                    </div>
                  </div>
                ))
              )
            ) : (
              currentChapter.stories.map((st, i) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStoryId(st.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-left ${
                    (selectedStoryId === st.id || (!selectedStoryId && i === 0))
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-amber-400">गवाही {i + 1}</span>
                    {bookmarkedStories.includes(st.id) && (
                      <Bookmark className="w-3 h-3 text-amber-400 fill-current" />
                    )}
                  </div>
                  <div className="text-xs font-bold line-clamp-2">{st.titleHindi}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{st.personName}</span>
                    <span className="text-slate-500">{st.location}</span>
                  </div>
                </div>
              ))
            )}

            {/* Free Download Callout Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 text-xs mt-4">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" /> 100% फ्री गवाही पुस्तक
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                इस पूरी पुस्तक को अपने फोन में हमेशा के लिए सेव करें और अपने प्रियजनों को व्हाट्सएप्प पर मुफ्त शेयर करें।
              </p>
              <button
                onClick={handleDownloadBook}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड करें (Free PDF)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Full Reading View */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6">
            {(() => {
              const activeStory = searchQuery
                ? searchResults.find(st => st.id === selectedStoryId) || searchResults[0]
                : currentChapter.stories.find(st => st.id === selectedStoryId) || currentChapter.stories[0];

              if (!activeStory) {
                return (
                  <div className="py-20 text-center text-slate-400">
                    बाईं ओर से कोई गवाही चुनें या खोजें।
                  </div>
                );
              }

              return (
                <article className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
                  {/* Chapter Theme banner */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 opacity-80" />
                    <div className="text-xs">
                      <div className="font-semibold text-amber-300 mb-0.5">
                        {currentChapter.titleHindi}
                      </div>
                      <p className="text-slate-300 italic">"{currentChapter.themeVerse}"</p>
                      <span className="text-[11px] font-bold text-amber-400 mt-1 block">
                        — {currentChapter.verseRef}
                      </span>
                    </div>
                  </div>

                  {/* Story Title & Meta */}
                  <div className="space-y-2 border-b border-slate-800 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {activeStory.miracleType}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(activeStory.id)}
                          className={`p-2 rounded-xl border transition ${
                            bookmarkedStories.includes(activeStory.id)
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title="बुकमार्क करें (Bookmark)"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareStory(activeStory)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                          title="गवाही शेयर करें (Share)"
                        >
                          {copiedText ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">कॉपी हो गई!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-4 h-4" />
                              <span>शेयर करें</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {activeStory.titleHindi}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="text-amber-300 font-semibold">
                        गवाह: {activeStory.personName}
                      </span>
                      <span>•</span>
                      <span>स्थान: {activeStory.location}</span>
                      <span>•</span>
                      <span>दिनांक: {activeStory.date}</span>
                    </div>

                    {/* Key Scripture callout */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{activeStory.keyVerse}</span>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-300 font-medium italic">
                    "{activeStory.summaryHindi}"
                  </div>

                  {/* Full Story Content */}
                  <div className={`text-slate-200 font-sans space-y-4 ${textClasses}`}>
                    {activeStory.fullStoryHindi.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Impact & Result */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-300 block mb-0.5">
                        आशीष व कलीसियाई प्रभाव (Divine Impact):
                      </span>
                      <p className="text-emerald-200/90 leading-relaxed">
                        {activeStory.impactHindi}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Navigation between Chapters */}
                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                    <button
                      disabled={currentChapterIndex === 0}
                      onClick={() => {
                        if (currentChapterIndex > 0) {
                          setCurrentChapterIndex(currentChapterIndex - 1);
                          setSelectedStoryId(null);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>पिछला अध्याय</span>
                    </button>

                    <span className="text-xs text-slate-400">
                      अध्याय {currentChapterIndex + 1} / {FREE_TESTIMONY_BOOK.chapters.length}
                    </span>

                    <button
                      disabled={currentChapterIndex === FREE_TESTIMONY_BOOK.chapters.length - 1}
                      onClick={() => {
                        if (currentChapterIndex < FREE_TESTIMONY_BOOK.chapters.length - 1) {
                          setCurrentChapterIndex(currentChapterIndex + 1);
                          setSelectedStoryId(null);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-950 flex items-center gap-1.5 transition shadow"
                    >
                      <span>अगला अध्याय</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
