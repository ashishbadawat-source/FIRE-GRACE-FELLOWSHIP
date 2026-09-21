/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Heart,
  BookMarked,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ALL_66_BIBLE_BOOKS } from '../data/bibleBooks';
import type { BibleVerse, BibleBookmark, BibleBook, TestimonyItem } from '../types';

interface BibleViewProps {
  onNavigate?: (view: string) => void;
}

export const BibleView: React.FC<BibleViewProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  const [books, setBooks] = useState<BibleBook[]>(ALL_66_BIBLE_BOOKS);
  const [selectedBook, setSelectedBook] = useState<string>('John');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookFilterQuery, setBookFilterQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'books' | 'read' | 'search' | 'bookmarks' | 'testimonies'>('books');
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [filterTestament, setFilterTestament] = useState<'all' | 'Old' | 'New'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [chapterPickerBook, setChapterPickerBook] = useState<BibleBook | null>(null);

  // Quick testimonies preview state
  const [quickTestimonies, setQuickTestimonies] = useState<TestimonyItem[]>([]);
  const [isLoadingTestimonies, setIsLoadingTestimonies] = useState<boolean>(false);

  useEffect(() => {
    // Load dynamic books from server if available, fallback to ALL_66_BIBLE_BOOKS
    api.getBibleBooks().then(res => {
      if (res.books && res.books.length > 0) {
        setBooks(res.books);
      }
    }).catch(() => {});
  }, []);

  // Fetch chapter verses
  useEffect(() => {
    api.getBibleChapter(selectedBook, selectedChapter).then(res => {
      setVerses(res.verses);
    }).catch(() => {});
  }, [selectedBook, selectedChapter]);

  // Fetch bookmarks if logged in
  useEffect(() => {
    if (user) {
      api.getBibleBookmarks().then(res => setBookmarks(res.bookmarks)).catch(() => {});
    }
  }, [user]);

  // Fetch testimonies when testimonies tab is chosen
  useEffect(() => {
    if (activeTab === 'testimonies' && quickTestimonies.length === 0) {
      setIsLoadingTestimonies(true);
      api.getTestimonies().then(res => {
        setQuickTestimonies(res.testimonies);
      }).catch(() => {}).finally(() => {
        setIsLoadingTestimonies(false);
      });
    }
  }, [activeTab]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if query matches a book name first
    const qLower = searchQuery.trim().toLowerCase();
    const matchedBook = books.find(
      b =>
        b.name.toLowerCase().includes(qLower) ||
        (b.hindiName && b.hindiName.includes(qLower))
    );

    if (matchedBook) {
      // Focus on books directory with filter
      setBookFilterQuery(searchQuery.trim());
      setActiveTab('books');
    }

    // Also search verses
    setIsSearching(true);
    try {
      const res = await api.searchBible(searchQuery.trim());
      setSearchResults(res.results);
      if (!matchedBook) {
        setActiveTab('search');
      }
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  };

  const currentBookObj =
    books.find(b => b.name.toLowerCase() === selectedBook.toLowerCase()) ||
    books.find(b => b.name === 'John') ||
    ALL_66_BIBLE_BOOKS[42];

  const totalChapters = currentBookObj.chapters || (currentBookObj as any).chaptersCount || 21;

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < totalChapters) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const handleCopyVerse = (v: BibleVerse) => {
    const text = `"${v.text}" — ${v.book} ${v.chapter}:${v.verse} (पवित्र शास्त्र)`;
    navigator.clipboard.writeText(text);
    setCopiedId(`${v.book}_${v.chapter}_${v.verse}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveBookmark = async (v: BibleVerse) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await api.addBibleBookmark({
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      });
      setBookmarks(prev => [res.bookmark, ...prev]);
    } catch {
      // ignore
    }
  };

  const isBookmarked = (v: BibleVerse) => {
    return bookmarks.some(b => b.book === v.book && b.chapter === v.chapter && b.verse === v.verse);
  };

  // Filter 66 Books list
  const filteredBooks = books.filter(b => {
    // Testament filter
    if (filterTestament === 'Old' && !(b.testament === 'Old' || (b.testament as any) === 'OT')) return false;
    if (filterTestament === 'New' && !(b.testament === 'New' || (b.testament as any) === 'NT')) return false;

    // Category filter
    if (selectedCategory !== 'All' && b.category !== selectedCategory && b.categoryHindi !== selectedCategory) {
      return false;
    }

    // Book search query filter
    const q = (bookFilterQuery || searchQuery).trim().toLowerCase();
    if (q) {
      const matchName = b.name.toLowerCase().includes(q);
      const matchHindi = b.hindiName ? b.hindiName.toLowerCase().includes(q) : false;
      const matchCat = b.category ? b.category.toLowerCase().includes(q) : false;
      const matchCatHindi = b.categoryHindi ? b.categoryHindi.toLowerCase().includes(q) : false;
      if (!matchName && !matchHindi && !matchCat && !matchCatHindi) {
        return false;
      }
    }

    return true;
  });

  const oldTestamentCount = books.filter(b => b.testament === 'Old' || (b.testament as any) === 'OT').length;
  const newTestamentCount = books.filter(b => b.testament === 'New' || (b.testament as any) === 'NT').length;

  const selectBookAndChapter = (book: BibleBook, chapter: number = 1) => {
    setSelectedBook(book.name);
    setSelectedChapter(chapter);
    setActiveTab('read');
    setChapterPickerBook(null);
  };

  return (
    <div id="bible-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/25 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <span>पवित्र शास्त्र बाईबल • 66 पुस्तकें (66 Holy Books)</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold font-cinzel text-white tracking-wide">
                पवित्र शास्त्र बाईबल (HOLY SCRIPTURES)
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-light">
                पुराना नियम (39 पुस्तकें) एवं नया नियम (27 पुस्तकें) • वचन खोजें, अध्ययन करें और प्रभु के जीवित वचनों से सामर्थ्य पाएं।
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setBookFilterQuery(e.target.value);
                }}
                placeholder="किताब या वचन खोजें (उदा. मत्ती, भजन, प्रेम, विश्वास)..."
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Search className="w-3.5 h-3.5" />
              <span>बाईबल सर्च</span>
            </button>
          </form>
        </div>

        {/* Tab Controls & Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* 66 Books Tab */}
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'books'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>66 किताबें (66 Books Directory)</span>
            </button>

            {/* Reader Tab */}
            <button
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'read'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>
                अध्ययन: {currentBookObj.hindiName || currentBookObj.name} {selectedChapter}
              </span>
            </button>

            {/* Search Results Tab */}
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>वचन खोज ({searchResults.length})</span>
            </button>

            {/* Bookmarks Tab */}
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>बुकमार्क ({bookmarks.length})</span>
            </button>

            {/* Testimony Book Option */}
            <button
              onClick={() => setActiveTab('testimonies')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'testimonies'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>गवाही पुस्तिका (Testimony Book)</span>
            </button>
          </div>

          {/* Reader Font Controls (when on read tab) */}
          {activeTab === 'read' && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>फ़ॉन्ट:</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                छोटा
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                सामान्य
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                बड़ा
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- 1. 66 BOOKS DIRECTORY TAB ---------------- */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          {/* Testament & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Testament Toggle Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTestament('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterTestament === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                सभी 66 पुस्तकें (All 66 Books)
              </button>
              <button
                onClick={() => setFilterTestament('Old')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterTestament === 'Old'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                पुराना नियम (Old Testament - {oldTestamentCount})
              </button>
              <button
                onClick={() => setFilterTestament('New')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterTestament === 'New'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                नया नियम (New Testament - {newTestamentCount})
              </button>
            </div>

            {/* Quick Live Filter Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={bookFilterQuery}
                onChange={e => setBookFilterQuery(e.target.value)}
                placeholder="किताब का नाम छांटें..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 66 Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
              <p className="text-sm">कोई पुस्तक नहीं मिली। कृपया खोज शब्द बदलें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredBooks.map(b => {
                const isSelected = selectedBook.toLowerCase() === b.name.toLowerCase();
                const totalCh = b.chapters || (b as any).chaptersCount || 1;
                return (
                  <div
                    key={b.name}
                    className={`rounded-2xl p-4 transition flex flex-col justify-between border cursor-pointer group hover:scale-[1.02] shadow-sm ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 shadow-amber-500/20 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80'
                    }`}
                    onClick={() => selectBookAndChapter(b, 1)}
                  >
                    <div>
                      {/* Order and Testament badges */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                          #{b.order}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-semibold ${
                            b.testament === 'Old' || (b.testament as any) === 'OT'
                              ? 'bg-blue-950 text-blue-300 border border-blue-900/50'
                              : 'bg-amber-950 text-amber-300 border border-amber-900/50'
                          }`}
                        >
                          {b.testament === 'Old' || (b.testament as any) === 'OT' ? 'पुराना नियम' : 'नया नियम'}
                        </span>
                      </div>

                      {/* Hindi Name in bold gold */}
                      <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition leading-tight">
                        {b.hindiName || b.name}
                      </h3>

                      {/* English Name */}
                      <p className="text-[11px] text-slate-400 font-serif italic mt-0.5">
                        {b.name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400/90 font-medium">
                        {totalCh} अध्याय
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChapterPickerBook(b);
                        }}
                        className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
                        title="अध्याय चुनें"
                      >
                        चुनें
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Option to Testimony Book */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-base font-bold text-white">
                  कलीसिया की जीवित गवाही पुस्तिका (Testimonies Book)
                </h4>
                <p className="text-xs text-slate-300">
                  प्रभु यीशु ने असाध्य रोगों से चंगाई, असंभव आर्थिक छुटकारे और अद्भुत चमत्कार किए हैं।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('testimonies')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <span>गवाहियां पढ़ें (Read Testimonies)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('testimonies')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition border border-amber-500/30"
                >
                  सम्पूर्ण गवाही पृष्ठ
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. SCRIPTURE READER TAB ---------------- */}
      {activeTab === 'read' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Books & Chapters Selector (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold font-cinzel text-amber-400">किताब चुनें (Select Book)</h3>
                <button
                  onClick={() => setActiveTab('books')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>सभी 66 देखें</span>
                </button>
              </div>

              {/* Book Select Dropdown with all 66 books */}
              <select
                value={selectedBook}
                onChange={e => {
                  setSelectedBook(e.target.value);
                  setSelectedChapter(1);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
              >
                <optgroup label="पुराना नियम (Old Testament - 39)">
                  {books
                    .filter(b => b.testament === 'Old' || (b.testament as any) === 'OT')
                    .map(b => (
                      <option key={b.name} value={b.name}>
                        #{b.order} {b.hindiName ? `${b.hindiName} (${b.name})` : b.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="नया नियम (New Testament - 27)">
                  {books
                    .filter(b => b.testament === 'New' || (b.testament as any) === 'NT')
                    .map(b => (
                      <option key={b.name} value={b.name}>
                        #{b.order} {b.hindiName ? `${b.hindiName} (${b.name})` : b.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Chapters Grid Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  अध्याय (Chapters): {totalChapters}
                </span>
                <span className="text-[11px] text-amber-400">
                  वर्तमान: अध्याय {selectedChapter}
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto pr-1 grid grid-cols-5 gap-1.5">
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={`py-2 rounded-lg text-xs font-mono font-semibold transition ${
                      selectedChapter === ch
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation back to all 66 books */}
            <button
              onClick={() => setActiveTab('books')}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>66 पुस्तकों की सूची पर वापस जाएं</span>
            </button>
          </div>

          {/* Scripture Reading Content Pane (Col 8) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Chapter Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
                  <span>{currentBookObj.hindiName || currentBookObj.name}</span>
                  <span className="text-amber-400">अध्याय {selectedChapter}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentBookObj.name} Chapter {selectedChapter} • {currentBookObj.categoryHindi || currentBookObj.category}
                </p>
              </div>

              {/* Prev / Next Chapter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapter <= 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला</span>
                </button>
                <span className="text-xs font-mono text-amber-400 px-2">
                  {selectedChapter} / {totalChapters}
                </span>
                <button
                  onClick={handleNextChapter}
                  disabled={selectedChapter >= totalChapters}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center gap-1"
                >
                  <span>अगला</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verses Container */}
            <div className="space-y-4">
              {verses.map(v => (
                <div
                  key={`${v.book}_${v.chapter}_${v.verse}`}
                  className="group p-3.5 rounded-2xl bg-slate-950/60 border border-transparent hover:border-amber-500/30 transition flex gap-3.5 items-start"
                >
                  <span className="font-mono text-xs font-bold text-amber-500 mt-0.5 shrink-0 select-none">
                    {v.verse}
                  </span>
                  <p
                    className={`flex-1 font-serif leading-relaxed text-slate-200 ${
                      fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {v.text}
                  </p>

                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopyVerse(v)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                      title="Copy verse"
                    >
                      {copiedId === `${v.book}_${v.chapter}_${v.verse}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSaveBookmark(v)}
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked(v)
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400'
                      }`}
                      title={isBookmarked(v) ? 'Bookmarked' : 'Add to bookmarks'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Nav Bar */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapter <= 1}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>अध्याय {selectedChapter - 1}</span>
              </button>

              <button
                onClick={() => setActiveTab('books')}
                className="text-xs text-amber-400 hover:underline"
              >
                66 किताबों की सूची
              </button>

              <button
                onClick={handleNextChapter}
                disabled={selectedChapter >= totalChapters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <span>अध्याय {selectedChapter + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. VERSE SEARCH TAB ---------------- */}
      {activeTab === 'search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">वचन खोज परिणाम (Search Results)</h2>
              <p className="text-xs text-slate-400">
                "{searchQuery}" के लिए {searchResults.length} संदर्भ मिले
              </p>
            </div>
            <button
              onClick={() => setActiveTab('books')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
            >
              66 किताबों पर जाएं
            </button>
          </div>

          {isSearching ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs">पवित्र शास्त्र में वचन खोजे जा रहे हैं...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">कोई वचन नहीं मिला। कृपया अन्य शब्द लिखकर पुनः खोजें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((v, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-amber-400 text-sm">
                      {v.book} {v.chapter}:{v.verse}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedBook(v.book);
                        setSelectedChapter(v.chapter);
                        setActiveTab('read');
                      }}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 font-semibold transition"
                    >
                      पढ़ें (Read)
                    </button>
                  </div>
                  <p className="font-serif text-xs text-slate-200 leading-relaxed italic">
                    "{v.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 4. BOOKMARKS TAB ---------------- */}
      {activeTab === 'bookmarks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">आपके सहेजे गए वचन (Bookmarks)</h2>
              <p className="text-xs text-slate-400">व्यक्तिगत मनन एवं प्रार्थना हेतु बुकमार्क</p>
            </div>
            <button
              onClick={() => setActiveTab('read')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
            >
              रीडर पर जाएं
            </button>
          </div>

          {!user ? (
            <div className="py-16 text-center text-slate-400 space-y-4">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">वचन बुकमार्क सहेजने के लिए कृपया लॉगिन करें।</p>
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                साइन इन करें (Sign In)
              </button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">अभी कोई बुकमार्क नहीं सहेजा गया है।</p>
              <p className="text-xs text-slate-500">
                वचन पढ़ते समय किसी भी आयत के पास बुकमार्क आइकन दबाएं।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map(bm => (
                <div
                  key={bm.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-amber-400 text-sm">
                      {bm.book} {bm.chapter}:{bm.verse}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedBook(bm.book);
                          setSelectedChapter(bm.chapter);
                          setActiveTab('read');
                        }}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                      >
                        खोलें
                      </button>
                      <button
                        onClick={async () => {
                          await api.deleteBibleBookmark(bm.id);
                          setBookmarks(prev => prev.filter(b => b.id !== bm.id));
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                  <p className="font-serif text-xs text-slate-200 leading-relaxed italic">
                    "{bm.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 5. TESTIMONY BOOK TAB ---------------- */}
      {activeTab === 'testimonies' && (
        <div className="bg-slate-900 border border-amber-500/25 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> गवाही पुस्तिका • BOOK OF TESTIMONIES
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                परमेश्वर के जीवित कार्यों की गवाहियां
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                "और वे मेम्ने के लोहू के कारण, और अपनी गवाही के वचन के कारण उस पर जयवन्त हुए..." (प्रकाशितवाक्य 12:11)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('testimonies')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <span>गवाही पृष्ठ खोलें (Full Page)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {isLoadingTestimonies ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs">गवाहियां लोड हो रही हैं...</p>
            </div>
          ) : quickTestimonies.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">अभी कोई गवाही उपलब्ध नहीं है।</p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('testimonies')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  अपनी गवाही जोड़ें
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {quickTestimonies.map(t => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                        {t.categoryHindi || t.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(t.date).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm leading-snug">
                      {t.title}
                    </h4>

                    <p className="text-xs text-amber-300 font-medium">
                      गवाह: {t.name} {t.city ? `(${t.city})` : ''}
                    </p>

                    {t.verse && (
                      <p className="text-xs italic text-amber-200/80 font-serif border-l-2 border-amber-500/40 pl-2">
                        "{t.verse}"
                      </p>
                    )}

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                      {t.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                      🙏 {t.amenCount || 0} आमीन
                    </span>

                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('testimonies')}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>विस्तार से पढ़ें</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chapter Picker Modal when user clicks 'चुनें' on a book card */}
      {chapterPickerBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-white">
                  {chapterPickerBook.hindiName || chapterPickerBook.name}
                </h4>
                <p className="text-xs text-amber-400">
                  {chapterPickerBook.name} • {chapterPickerBook.chapters} अध्याय
                </p>
              </div>
              <button
                onClick={() => setChapterPickerBook(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                बंद करें
              </button>
            </div>

            <p className="text-xs text-slate-300">पढ़ने के लिए अध्याय चुनें:</p>

            <div className="max-h-60 overflow-y-auto grid grid-cols-5 gap-2 pr-1">
              {Array.from({ length: chapterPickerBook.chapters }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => selectBookAndChapter(chapterPickerBook, ch)}
                  className="py-2 rounded-lg bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-mono font-semibold transition border border-slate-800 hover:border-amber-500"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
