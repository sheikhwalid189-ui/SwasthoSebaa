import React, { useState } from 'react';
import { 
  Search, 
  Stethoscope, 
  Bot, 
  ShoppingBag, 
  Ambulance, 
  Droplet, 
  FlaskConical, 
  FileText,
  ShieldCheck, 
  Star, 
  Users, 
  ArrowRight,
  Sparkles,
  Video,
  Building2,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC<{ onSearchQuery: (q: string) => void }> = ({ onSearchQuery }) => {
  const { language, t } = useLanguage();
  const { setActiveTab } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
      setActiveTab('doctors');
    }
  };

  const quickSpecialtyTags = [
    { en: 'General Medicine', bn: 'মেডিসিন' },
    { en: 'Pediatrics', bn: 'শিশু রোগ' },
    { en: 'Cardiology', bn: 'হৃদরোগ' },
    { en: 'Gynecology', bn: 'স্ত্রীরোগ' },
    { en: 'Dermatology', bn: 'চর্ম ও এলার্জি' },
    { en: 'Diabetes', bn: 'ডায়াবেটিস' },
    { en: 'Neurology', bn: 'স্নায়ুরোগ' }
  ];

  const quickActionCards = [
    {
      id: 'doctors',
      title: t('cardDocTitle'),
      desc: t('cardDocDesc'),
      icon: Stethoscope,
      color: 'from-teal-600 to-emerald-600',
      bgLight: 'bg-teal-50 hover:bg-teal-100/70 border-teal-200/80',
      badge: 'BMDC Verified',
      accent: 'text-teal-600'
    },
    {
      id: 'ai-assistant',
      title: t('cardAiTitle'),
      desc: t('cardAiDesc'),
      icon: Bot,
      color: 'from-sky-600 to-indigo-600',
      bgLight: 'bg-sky-50 hover:bg-sky-100/70 border-sky-200/80',
      badge: 'Gemini AI',
      accent: 'text-sky-600'
    },
    {
      id: 'pharmacy',
      title: t('cardPharmTitle'),
      desc: t('cardPharmDesc'),
      icon: ShoppingBag,
      color: 'from-emerald-600 to-green-600',
      bgLight: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200/80',
      badge: '2-4h Delivery',
      accent: 'text-emerald-600'
    },
    {
      id: 'prescriptions',
      title: language === 'bn' ? 'প্রেসক্রিপশন ও স্বাস্থ্য রেকর্ড' : 'Prescription & Vitals Vault',
      desc: language === 'bn' ? 'প্রেসক্রিপশন আপলোড ও এআই বিশ্লেষণ এবং স্বাস্থ্য চার্ট।' : 'Upload prescription, AI report scanner & daily health tracker.',
      icon: FileText,
      color: 'from-indigo-600 to-purple-600',
      bgLight: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200/80',
      badge: 'OCR & Vitals',
      accent: 'text-indigo-600'
    },
    {
      id: 'ambulance',
      title: t('cardAmbTitle'),
      desc: t('cardAmbDesc'),
      icon: Ambulance,
      color: 'from-rose-600 to-red-600',
      bgLight: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200/80',
      badge: 'Emergency 24/7',
      accent: 'text-rose-600'
    },
    {
      id: 'blood',
      title: t('cardBloodTitle'),
      desc: t('cardBloodDesc'),
      icon: Droplet,
      color: 'from-red-600 to-rose-600',
      bgLight: 'bg-red-50 hover:bg-red-100/70 border-red-200/80',
      badge: 'Live Donors',
      accent: 'text-red-600'
    },
    {
      id: 'lab-tests',
      title: t('cardLabTitle'),
      desc: t('cardLabDesc'),
      icon: FlaskConical,
      color: 'from-amber-600 to-orange-600',
      bgLight: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200/80',
      badge: 'Home Collection',
      accent: 'text-amber-600'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-radial from-teal-50/70 via-slate-50 to-white">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-900 border border-teal-300 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>
              {language === 'bn' ? 'বাংলাদেশের আধুনিক পূর্ণাঙ্গ ডিজিটাল স্বাস্থ্য প্ল্যাটফর্ম' : "Bangladesh's Most Trusted Digital Health Platform"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {language === 'bn' ? (
              <>
                আপনার ও আপনার পরিবারের <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  নিরাপদ ও বিশ্বস্ত স্বাস্থ্যসেবা
                </span>
              </>
            ) : (
              <>
                Accessible, Quality Healthcare <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  At Your Fingertips
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            {t('heroSubtitle')}
          </p>

          {/* Instant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg shadow-slate-200/60 rounded-2xl bg-white border-2 border-teal-500/30 focus-within:border-teal-500 transition-all p-1.5">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-teal-600" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Specialty Filters */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">{language === 'bn' ? 'জনপ্রিয় বিভাগ:' : 'Popular:'}</span>
            {quickSpecialtyTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSearchQuery(language === 'bn' ? tag.bn : tag.en);
                  setActiveTab('doctors');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 font-medium transition-colors"
              >
                {language === 'bn' ? tag.bn : tag.en}
              </button>
            ))}
          </div>

        </div>

        {/* Live Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {quickActionCards.slice(0, 4).map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`relative p-5 rounded-2xl border ${card.bgLight} transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-tr ${card.color} text-white flex items-center justify-center shadow-md shadow-slate-300/40 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                  <span>{language === 'bn' ? 'সেবা নিন' : 'Explore Now'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Second Row of Emergency & Support Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {quickActionCards.slice(4).map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`p-4 rounded-xl border ${card.bgLight} transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3.5 group`}
              >
                <div className={`w-11 h-11 rounded-lg bg-linear-to-tr ${card.color} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-teal-700">
                      {card.title}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white text-slate-600 rounded shrink-0">
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Metric Highlights */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-teal-600 font-extrabold text-2xl sm:text-3xl">
                <span>500+</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t('quickStatsDoctors')}
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="flex items-center justify-center gap-1 text-teal-600 font-extrabold text-2xl sm:text-3xl">
                <span>120k+</span>
                <Users className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t('quickStatsPatients')}
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="flex items-center justify-center gap-1 text-teal-600 font-extrabold text-2xl sm:text-3xl">
                <span>64</span>
                <Building2 className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t('quickStatsDistricts')}
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="flex items-center justify-center gap-1 text-teal-600 font-extrabold text-2xl sm:text-3xl">
                <span>4.9</span>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t('quickStatsRating')}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
