import React, { useState } from 'react';
import { 
  Activity, 
  PhoneCall, 
  Globe, 
  Calendar, 
  ShoppingBag, 
  Bot, 
  FileText, 
  Ambulance, 
  Droplet, 
  FlaskConical, 
  Menu, 
  X, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { activeTab, setActiveTab, appointments, cart, setIsAppointmentsModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelKey: 'navHome', icon: Activity },
    { id: 'doctors', labelKey: 'navDoctors', icon: Stethoscope },
    { id: 'ai-assistant', labelKey: 'navAiAssistant', icon: Bot, badge: 'AI' },
    { id: 'prescriptions', labelKey: 'navPrescription', icon: FileText },
    { id: 'pharmacy', labelKey: 'navPharmacy', icon: ShoppingBag, count: cart.length },
    { id: 'ambulance', labelKey: 'navAmbulance', icon: Ambulance, emergency: true },
    { id: 'blood', labelKey: 'navBlood', icon: Droplet },
    { id: 'lab-tests', labelKey: 'navLabTests', icon: FlaskConical },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner with 24/7 Hotline & Emergency Alert */}
      <div className="bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-teal-50 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider animate-pulse">
              24/7 Live
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-teal-400 inline" />
              {t('emergencyHotline')}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>BMDC Verified Physicians</span>
            </div>

            {/* Language Switcher Button */}
            <div className="flex items-center bg-teal-950/70 rounded-full p-0.5 border border-teal-700/50">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  language === 'bn' 
                    ? 'bg-teal-500 text-white shadow-xs' 
                    : 'text-teal-200 hover:text-white'
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  language === 'en' 
                    ? 'bg-teal-500 text-white shadow-xs' 
                    : 'text-teal-200 hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors font-sans">
                  Swastho<span className="text-teal-600">Seba</span>
                </span>
                <span className="text-xs bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                  {language === 'bn' ? 'স্বাস্থ্যসেবা' : 'BD'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                {language === 'bn' ? 'ডিজিটাল স্বাস্থ্য ও টেলিমেডিসিন' : 'Digital Health & Telemedicine'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{t(item.labelKey)}</span>

                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-linear-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-extrabold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 bg-teal-600 text-white text-[10px] font-bold rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => setIsAppointmentsModalOpen(true)}
              className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{t('myAppointments')}</span>
              {appointments.length > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {appointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডাক্তার বুক করুন' : 'Book Doctor'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setIsAppointmentsModalOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
              title="Appointments"
            >
              <Calendar className="w-5 h-5" />
              {appointments.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-teal-600 rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-xl text-left text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span className="truncate">{t(item.labelKey)}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('doctors');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-teal-600 to-emerald-600 shadow-md"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট নিন' : 'Book Doctor Appointment'}</span>
            </button>
            <button
              onClick={() => {
                setIsAppointmentsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{t('myAppointments')} ({appointments.length})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
