/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Share2,
  Search,
  Plus,
  X,
  Check,
  BookOpen,
  Send,
  Upload,
  Calendar,
  MapPin,
  Flame,
  MessageCircle,
  FileCheck,
} from 'lucide-react';
import { api } from '../services/api';
import type { TestimonyItem } from '../types';

interface TestimoniesViewProps {
  onNavigate?: (view: string) => void;
}

const CATEGORIES = [
  { id: 'All', labelHindi: 'सभी गवाहियां', labelEn: 'All Testimonies' },
  { id: 'Miracle', labelHindi: 'अद्भुत चमत्कार', labelEn: 'Miracles' },
  { id: 'Healing', labelHindi: 'चंगाई व आरोग्य', labelEn: 'Divine Healing' },
  { id: 'Deliverance', labelHindi: 'छुटकारा व आज़ादी', labelEn: 'Deliverance' },
  { id: 'Financial', labelHindi: 'वित्तीय आशीष व नौकरी', labelEn: 'Financial Breakthrough' },
  { id: 'Family', labelHindi: 'पारिवारिक बहाली', labelEn: 'Family Restoration' },
  { id: 'Salvation', labelHindi: 'उद्धार व नया जीवन', labelEn: 'Salvation' },
];

export const TestimoniesView: React.FC<TestimoniesViewProps> = ({ onNavigate }) => {
  const [testimonies, setTestimonies] = useState<TestimonyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [amenLoadingId, setAmenLoadingId] = useState<string | null>(null);

  // Submit Modal
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    city: '',
    category: 'Miracle' as TestimonyItem['category'],
    categoryHindi: 'अद्भुत चमत्कार',
    content: '',
    verse: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadTestimonies();
  }, [selectedCategory, searchQuery]);

  const loadTestimonies = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTestimonies(selectedCategory, searchQuery);
      setTestimonies(res.testimonies);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmen = async (item: TestimonyItem) => {
    setAmenLoadingId(item.id);
    try {
      const res = await api.amenTestimony(item.id);
      setTestimonies(prev =>
        prev.map(t => (t.id === item.id ? { ...t, amenCount: res.amenCount } : t))
      );
    } catch {
      // ignore
    } finally {
      setAmenLoadingId(null);
    }
  };

  const handleShare = (item: TestimonyItem) => {
    const text = `गवाही: "${item.title}" — ${item.name} (${item.city || 'India'}) | प्रभु यीशु की महिमा हो! फायर एंड ग्रेस फेलोशिप`;
    if (navigator.share) {
      navigator.share({ title: item.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} \n\n${window.location.href}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.name.trim() || !formData.content.trim()) {
      alert('कृपया शीर्षक, नाम और गवाही का विवरण अवश्य भरें।');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.submitTestimony(formData);
      setSubmitSuccess(res.message || 'आपकी गवाही सफलतापूर्वक दर्ज कर ली गई है!');
      setTestimonies(prev => [res.testimony, ...prev]);
      setFormData({
        title: '',
        name: '',
        city: '',
        category: 'Miracle',
        categoryHindi: 'अद्भुत चमत्कार',
        content: '',
        verse: '',
        imageUrl: '',
      });
      setTimeout(() => {
        setIsSubmitOpen(false);
        setSubmitSuccess(null);
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'गवाही दर्ज करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="testimonies-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner / Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/25 p-8 md:p-12 text-center space-y-4 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> गवाही पुस्तिका • BOOK OF TESTIMONIES
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-white tracking-wide">
          परमेश्वर के जीवित कार्यों की गवाही
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          "और वे मेम्ने के लोहू के कारण, और अपनी गवाही के वचन के कारण उस पर जयवन्त हुए..." (प्रकाशितवाक्य 12:11)
          <br />
          हमारे प्रभु यीशु मसीह ने विश्वासियों के जीवन में जो चंगाई, छुटकारा और असंभव चमत्कार किए हैं, उनकी सत्य गवाहियां।
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>अपनी गवाही दर्ज करें (Share Testimony)</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('bible')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm transition border border-amber-500/30 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>पवित्र शास्त्र बाईबल पढ़ें (Open Bible)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Horizontal Scroll */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat.labelHindi}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="गवाही या बीमारी खोजें (Search testimonies)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Testimonies Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">गवाहियां लोड हो रही हैं...</p>
        </div>
      ) : testimonies.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">कोई गवाही नहीं मिली</h3>
          <p className="text-xs text-slate-400">
            खोजे गए शब्दों से संबंधित कोई गवाही नहीं मिली। कृपया अन्य श्रेणी चुनें या अपनी गवाही जोड़ें।
          </p>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            अपनी गवाही साझा करें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map(item => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              {/* Optional Photo */}
              {item.imageUrl && (
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Category & Verified Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                      {item.categoryHindi || item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(item.date).toLocaleDateString('hi-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-300 transition leading-snug">
                    {item.title}
                  </h3>

                  {/* Name & City */}
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <span>गवाह: {item.name}</span>
                    {item.city && (
                      <span className="flex items-center gap-0.5 text-slate-400 text-[11px]">
                        <MapPin className="w-3 h-3 text-amber-500" /> {item.city}
                      </span>
                    )}
                  </div>

                  {/* Verse Reference quote box if present */}
                  {item.verse && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/20 text-xs italic text-amber-200/90 font-serif">
                      "{item.verse}"
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-line">
                    {item.content}
                  </p>
                </div>

                {/* Footer Actions: Amen Counter & Share */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleAmen(item)}
                    disabled={amenLoadingId === item.id}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white transition flex items-center gap-1.5 font-semibold text-xs active:scale-95"
                    title="प्रभु की स्तुति करें (Say Amen!)"
                  >
                    <span>🙏 आमीन (Amen)</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/30 text-white font-mono text-[10px]">
                      {item.amenCount || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs"
                    title="गवाही शेयर करें (Share to WhatsApp)"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className="hidden sm:inline">शेयर</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Testimony Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">अपनी गवाही दर्ज करें</h3>
                  <p className="text-xs text-amber-400">परमेश्वर के अद्भुत कार्यों को कलीसिया के साथ साझा करें</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold font-cinzel text-white">हालेलूइयाह!</h4>
                <p className="text-sm text-slate-200 max-w-md mx-auto">{submitSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTestimony} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      आपका नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="उदा. अमित मसीह / ब्रदर डेविड"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      शहर / गाँव (City / State)
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="उदा. नई दिल्ली, चंडीगढ़, मुंबई"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    गवाही की श्रेणी (Category) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => {
                      const cat = CATEGORIES.find(c => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                        categoryHindi: cat?.labelHindi || 'अद्भुत चमत्कार',
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Miracle">अद्भुत चमत्कार (Miracle)</option>
                    <option value="Healing">चंगाई व आरोग्य (Divine Healing)</option>
                    <option value="Deliverance">छुटकारा व आज़ादी (Deliverance)</option>
                    <option value="Financial">वित्तीय आशीष व नौकरी (Financial Breakthrough)</option>
                    <option value="Family">पारिवारिक बहाली (Family Restoration)</option>
                    <option value="Salvation">उद्धार व नया जीवन (Salvation)</option>
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    गवाही का मुख्य शीर्षक (Title of Testimony) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="उदा. 5 साल पुरानी असाध्य बीमारी से प्रार्थना के बाद पूर्ण चंगाई मिली"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    गवाही का पूरा विवरण (Detailed Testimony) *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="विस्तार से बताएं कि परमेश्वर ने आपके जीवन में क्या चमत्कार किया, प्रार्थना से पहले क्या परिस्थिति थी और प्रार्थना के बाद प्रभु यीशु ने कैसे आशीष दी..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                  ></textarea>
                </div>

                {/* Scripture Reference */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    बाईबल का वचन (Scripture Reference - Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.verse}
                    onChange={e => setFormData({ ...formData, verse: e.target.value })}
                    placeholder="उदा. यशायाह 53:5 - उसके कोड़े खाने से हम चंगे हुए"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Photo Upload or Direct Link */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    तस्वीर या मेडिकल रिपोर्ट (Optional Photo / Document)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>फोटो चुनें (Upload File)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">या डायरेक्ट इमेज लिंक नीचे डालें</span>
                  </div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... (Image URL)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'दर्ज हो रहा है...' : 'गवाही सबमिट करें (Submit)'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
