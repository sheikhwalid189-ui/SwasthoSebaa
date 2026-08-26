import React, { useState } from 'react';
import { Phone, ShieldAlert, X, HeartPulse, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyQuickBar: React.FC = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const emergencyContacts = [
    { number: '16263', nameEn: 'National Health Window (স্বাস্থ্য বাতায়ন)', nameBn: 'জাতীয় স্বাস্থ্য বাতায়ন (১৬২৬৩)', desc: '24/7 Free Doctor Advice by Govt' },
    { number: '999', nameEn: 'National Emergency Service (Police, Fire, Ambulance)', nameBn: 'জাতীয় জরুরি সেবা (৯৯৯)', desc: 'Instant Police, Fire & Govt Ambulance' },
    { number: '106', nameEn: 'Anti-Corruption & Emergency Medical Complaints', nameBn: 'জরুরি সেবা ও অভিযোগ', desc: 'Hospital Malpractice Redressal' },
    { number: '333', nameEn: 'Govt Citizen Services & Doctor Advice', nameBn: 'জাতীয় তথ্য সেবা (৩৩৩)', desc: 'Public Medical Assistance' },
    { number: '01779554391', nameEn: 'Kaan Pete Roi (Mental Health & Suicide Prevention)', nameBn: 'কান পেতে রই (মানসিক স্বাস্থ্য হেল্পলাইন)', desc: 'Emotional Support & Crisis Hotline' }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isExpanded ? (
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700 max-w-sm w-80 sm:w-96 space-y-3 animate-scaleUp">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>{language === 'bn' ? 'জরুরি স্বাস্থ্য হেল্পলাইন' : 'Emergency Health Hotlines'}</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {emergencyContacts.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.number}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/60 border border-slate-700/60 transition-colors text-xs group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="font-bold text-slate-100 group-hover:text-rose-200 truncate">
                    {language === 'bn' ? c.nameBn : c.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{c.desc}</div>
                </div>

                <span className="shrink-0 font-mono font-extrabold text-xs px-2.5 py-1 bg-rose-600 text-white rounded-lg group-hover:bg-rose-500">
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-600/30 transition-transform active:scale-95 group"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span>{language === 'bn' ? 'জরুরি হেল্পলাইন' : 'Emergency 24/7'}</span>
          <ChevronUp className="w-3.5 h-3.5 opacity-80" />
        </button>
      )}
    </div>
  );
};
