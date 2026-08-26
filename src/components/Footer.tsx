import React from 'react';
import { 
  Activity, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Lock, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
                Swastho<span className="text-teal-400">Seba</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {language === 'bn' 
                ? 'বাংলাদেশের শীর্ষস্থানীয় সমন্বিত ডিজিটাল স্বাস্থ্যসেবা প্ল্যাটফর্ম। বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তার, এআই লক্ষণ পরীক্ষক ও সার্বক্ষণিক জরুরি সেবায় আমরা সদা নিয়োজিত।'
                : 'Bangladesh\'s leading integrated digital healthcare ecosystem connecting patients with BMDC verified doctors, Gemini AI clinical guidance, e-pharmacy, and nationwide ambulance emergency care.'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                BMDC Verified Care
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                HIPAA & Data Privacy Protected
              </span>
            </div>
          </div>

          {/* Quick Healthcare Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {language === 'bn' ? 'স্বাস্থ্যসেবা' : 'Healthcare Services'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition-colors">
                  {language === 'bn' ? 'বিশেষজ্ঞ ডাক্তার খুঁজুন' : 'Find Specialists'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <span>{language === 'bn' ? 'এআই স্বাস্থ্য সহকারী' : 'AI Health Assistant'}</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1 rounded">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pharmacy')} className="hover:text-teal-400 transition-colors">
                  {language === 'bn' ? 'অনলাইন ঔষধ শপ' : 'E-Pharmacy Delivery'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('prescriptions')} className="hover:text-teal-400 transition-colors">
                  {language === 'bn' ? 'প্রেসক্রিপশন ও ভাইটালস' : 'Digital Prescriptions'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lab-tests')} className="hover:text-teal-400 transition-colors">
                  {language === 'bn' ? 'ল্যাব টেস্ট ও চেকআপ' : 'Diagnostic Lab Tests'}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-rose-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              {language === 'bn' ? 'জরুরি হটলাইন' : 'Emergency Hotlines'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="block text-xs text-slate-400 font-medium">National Health Help</span>
                <span className="text-white font-bold text-base flex items-center gap-1.5">
                  📞 16263 <span className="text-xs text-teal-400 font-normal">(Shastho Batayon)</span>
                </span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="block text-xs text-slate-400 font-medium">National Emergency Service</span>
                <span className="text-white font-bold text-base text-rose-400">
                  🚨 999 <span className="text-xs text-slate-300 font-normal">(Ambulance / Police)</span>
                </span>
              </li>
              <li>
                <button onClick={() => setActiveTab('ambulance')} className="text-xs text-teal-400 hover:underline flex items-center gap-1 pt-1">
                  <span>{language === 'bn' ? '২৪/৭ অ্যাম্বুলেন্স তালিকা দেখুন' : 'View Ambulance Directory'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Bangladesh HQ */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & HQ'}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Level 7, Health Tech Tower, Panthapath, Dhaka 1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@swasthoseba.com.bd</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+880 9612-445566 (Toll-Free)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Compliance Notice */}
        <div className="py-6 text-xs text-slate-400 border-b border-slate-800/80 leading-relaxed">
          <p>
            <strong className="text-slate-300">Medical Disclaimer: </strong>
            {language === 'bn'
              ? 'স্বাস্থ্যসেবা (SwasthoSeba) একটি ডিজিটাল টেলিমেডিসিন ও স্বাস্থ্য তথ্য সহায়তা প্ল্যাটফর্ম। এআই স্বাস্থ্য সহকারী ও তথ্যসমূহ কেবল সাধারণ সচেতনতামূলক কাজে ব্যবহারের জন্য। জীবন সংশয়পূর্ণ জরুরি পরিস্থিতিতে অনতিবিলম্বে নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।'
              : 'SwasthoSeba is a digital telemedicine and medical information coordination service. AI triage and content are for educational and guidance purposes only and do not constitute a final medical diagnosis. In life-threatening emergencies, immediately seek emergency medical attention.'}
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SwasthoSeba Limited. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Bangladesh Healthcare
            </span>
            <span className="text-teal-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini 2.5
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
