/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Heart,
  Book,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { BibleVerse, BibleBookmark } from '../types';

export const BibleView: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('John');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'read' | 'search' | 'bookmarks'>('read');
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [filterTestament, setFilterTestament] = useState<'all' | 'OT' | 'NT'>('all');

  useEffect(() => {
    api.getBibleBooks().then(res => setBooks(res.books)).catch(() => {});
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchBible(searchQuery.trim());
      setSearchResults(res.results);
      setActiveTab('search');
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  };

  const currentBookObj = books.find(b => b.name === selectedBook) || { name: 'John', chaptersCount: 21, testament: 'NT' };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < currentBookObj.chaptersCount) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const handleCopyVerse = (v: BibleVerse) => {
    const text = `"${v.text}" — ${v.book} ${v.chapter}:${v.verse}`;
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

  const filteredBooks = books.filter(b => {
    if (filterTestament === 'OT') return b.testament === 'OT';
    if (filterTestament === 'NT') return b.testament === 'NT';
    return true;
  });

  return (
    <div id="bible-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-amber-500/25 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-cinzel text-white">THE HOLY SCRIPTURES</h1>
              <p className="text-xs text-slate-400">King James / Modern English Translation • All 66 Books of the Bible</p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search verse, topic, or keyword (e.g. grace, love, faith)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Tab & Font Size Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'read' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Scripture Reader
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'search' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Search Results ({searchResults.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'bookmarks' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              My Bookmarks ({bookmarks.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Font:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- READ TAB ---------------- */}
      {activeTab === 'read' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Books & Chapters Selector (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold font-cinzel text-amber-400">Books of the Bible</h3>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setFilterTestament('all')}
                    className={`px-2 py-1 rounded ${filterTestament === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterTestament('OT')}
                    className={`px-2 py-1 rounded ${filterTestament === 'OT' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    OT
                  </button>
                  <button
                    onClick={() => setFilterTestament('NT')}
                    className={`px-2 py-1 rounded ${filterTestament === 'NT' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    NT
                  </button>
                </div>
              </div>

              {/* Books List */}
              <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
                {filteredBooks.map(b => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setSelectedBook(b.name);
                      setSelectedChapter(1);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition truncate ${
                      selectedBook === b.name
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2">Select Chapter ({currentBookObj.name})</h4>
              <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {Array.from({ length: currentBookObj.chaptersCount }, (_, i) => i + 1).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                      selectedChapter === ch
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Text Display (Col 8) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-6">
            {/* Chapter Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {currentBookObj.testament === 'OT' ? 'Old Testament' : 'New Testament'}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-white">
                  {selectedBook} {selectedChapter}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapter <= 1}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                  title="Previous Chapter"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextChapter}
                  disabled={selectedChapter >= currentBookObj.chaptersCount}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                  title="Next Chapter"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verses List */}
            <div
              className={`space-y-4 font-serif leading-relaxed text-slate-200 ${
                fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
              }`}
            >
              {verses.map(v => (
                <div
                  key={v.verse}
                  className="p-3 rounded-2xl transition hover:bg-slate-800/40 group flex items-start gap-3"
                >
                  <span className="text-xs font-mono font-bold text-amber-400 select-none shrink-0 mt-1">
                    {v.verse}
                  </span>
                  <div className="flex-1">
                    <p>{v.text}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleCopyVerse(v)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
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
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title={isBookmarked(v) ? 'Bookmarked' : 'Save Bookmark'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Chapter Pager */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapter <= 1}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>
              <span>{selectedBook} • Chapter {selectedChapter} of {currentBookObj.chaptersCount}</span>
              <button
                onClick={handleNextChapter}
                disabled={selectedChapter >= currentBookObj.chaptersCount}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center gap-1.5"
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SEARCH TAB ---------------- */}
      {activeTab === 'search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">Search Results</h2>
              <p className="text-xs text-slate-400">
                Found {searchResults.length} scriptures matching "{searchQuery}"
              </p>
            </div>
            <button
              onClick={() => setActiveTab('read')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Back to Reader
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">No scripture passages found matching your search term.</p>
              <p className="text-xs text-slate-500">Try searching for keywords such as "Grace", "Spirit", "Fire", "Love", or "Faith".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map(v => (
                <div
                  key={`${v.book}_${v.chapter}_${v.verse}`}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-amber-500/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-amber-400 text-sm">
                      {v.book} {v.chapter}:{v.verse}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedBook(v.book);
                          setSelectedChapter(v.chapter);
                          setActiveTab('read');
                        }}
                        className="px-3 py-1 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 rounded-lg text-xs font-semibold"
                      >
                        Read Chapter
                      </button>
                      <button
                        onClick={() => handleCopyVerse(v)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="font-serif text-sm text-slate-200 leading-relaxed italic">
                    "{v.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- BOOKMARKS TAB ---------------- */}
      {activeTab === 'bookmarks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">Your Saved Bookmarks</h2>
              <p className="text-xs text-slate-400">Verses highlighted for personal meditation</p>
            </div>
            <button
              onClick={() => setActiveTab('read')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Back to Reader
            </button>
          </div>

          {!user ? (
            <div className="py-16 text-center text-slate-400 space-y-4">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Sign in to save and sync your scripture bookmarks.</p>
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Sign In to Save Bookmarks
              </button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">No bookmarks saved yet.</p>
              <p className="text-xs text-slate-500">While reading scriptures, click the bookmark icon next to any verse to save it here.</p>
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
                        Open
                      </button>
                      <button
                        onClick={async () => {
                          await api.deleteBibleBookmark(bm.id);
                          setBookmarks(prev => prev.filter(b => b.id !== bm.id));
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                      >
                        Remove
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
    </div>
  );
};
