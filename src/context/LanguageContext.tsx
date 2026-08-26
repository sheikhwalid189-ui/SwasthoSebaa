import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  appName: {
    en: "SwasthoSeba",
    bn: "স্বাস্থ্যসেবা"
  },
  tagline: {
    en: "Digital Healthcare & Telemedicine for Bangladesh",
    bn: "বাংলাদেশের পূর্ণাঙ্গ ডিজিটাল স্বাস্থ্যসেবা ও টেলিমেডিসিন"
  },
  emergencyHotline: {
    en: "24/7 National Health Hotline: 16263 | Emergency: 999",
    bn: "২৪/৭ জাতীয় স্বাস্থ্য বাতায়ন: ১৬২৬৩ | জরুরি: ৯৯৯"
  },
  navHome: {
    en: "Home",
    bn: "হোম"
  },
  navDoctors: {
    en: "Find Doctors",
    bn: "ডাক্তার খুঁজুন"
  },
  navAiAssistant: {
    en: "AI Health Assistant",
    bn: "AI স্বাস্থ্য সহকারী"
  },
  navPrescription: {
    en: "Prescription & Vitals",
    bn: "প্রেসক্রিপশন ও স্বাস্থ্য রেকর্ড"
  },
  navPharmacy: {
    en: "E-Pharmacy",
    bn: "ঔষধ ও ফার্মেসি"
  },
  navAmbulance: {
    en: "Ambulance",
    bn: "অ্যাম্বুলেন্স"
  },
  navBlood: {
    en: "Blood Donors",
    bn: "রক্তদান কেন্দ্র"
  },
  navLabTests: {
    en: "Diagnostic Tests",
    bn: "ল্যাব ও ডায়াগনস্টিক"
  },
  myAppointments: {
    en: "My Appointments",
    bn: "আমার অ্যাপয়েন্টমেন্ট"
  },

  // Hero Section
  heroTitle: {
    en: "Accessible, Quality Healthcare at Your Fingertips",
    bn: "আপনার হাতের মুঠোয় সহজ ও বিশ্বস্ত ডিজিটাল স্বাস্থ্যসেবা"
  },
  heroSubtitle: {
    en: "Consult BMDC certified specialist doctors via video or chamber, check symptoms with Gemini AI, order authentic medicines, and access 24/7 emergency care across Bangladesh.",
    bn: "বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তারের পরামর্শ, জেমিনি এআই লক্ষণ পরীক্ষক, জেনুইন ঔষধ হোম ডেলিভারি এবং সার্বক্ষণিক জরুরি অ্যাম্বুলেন্স ও রক্তদান সেবা।"
  },
  searchPlaceholder: {
    en: "Search doctor name, specialty (e.g., Cardiology, Medicine, Gynecology) or disease...",
    bn: "ডাক্তারের নাম, বিভাগ (যেমন: মেডিসিন, হৃদরোগ, শিশু, চর্ম) বা লক্ষণ লিখে খুঁজুন..."
  },
  instantConsultBtn: {
    en: "Consult Doctor Now",
    bn: "ডাক্তার অ্যাপয়েন্টমেন্ট নিন"
  },
  aiSymptomBtn: {
    en: "AI Symptom Checker",
    bn: "এআই লক্ষণ পরীক্ষক"
  },
  quickStatsDoctors: {
    en: "Verified Specialists",
    bn: "নিবন্ধিত বিশেষজ্ঞ ডাক্তার"
  },
  quickStatsPatients: {
    en: "Happy Patients Served",
    bn: "সন্তুষ্ট রোগী সেবা গ্রহণ করেছেন"
  },
  quickStatsDistricts: {
    en: "Districts Covered",
    bn: "জেলায় বিস্তৃত সেবা"
  },
  quickStatsRating: {
    en: "User Satisfaction",
    bn: "ব্যবহারকারী সন্তুষ্টি রেটিং"
  },

  // Quick Action Cards
  cardDocTitle: {
    en: "Book Specialist Doctor",
    bn: "বিশেষজ্ঞ ডাক্তার বুকিং"
  },
  cardDocDesc: {
    en: "Online video consultation or in-clinic chamber appointments across 30+ specialties.",
    bn: "অনলাইন ভিডিও কনসালটেশন অথবা চেম্বার অ্যাপয়েন্টমেন্ট নিন।"
  },
  cardAiTitle: {
    en: "AI Health Assistant",
    bn: "এআই স্বাস্থ্য সহকারী"
  },
  cardAiDesc: {
    en: "Instant symptom triage, health guidance & advice powered by Gemini 2.5 Flash.",
    bn: "লক্ষণ বিশ্লেষণ ও প্রাথমিক চিকিৎসা পরামর্শ নিন নিমিষেই।"
  },
  cardPharmTitle: {
    en: "Order Medicines",
    bn: "জরুরি ঔষধ অর্ডার"
  },
  cardPharmDesc: {
    en: "100% authentic medicines delivered to your home within 2-4 hours.",
    bn: "শতভাগ আসল ঔষধ ঘরে বসেই অর্ডার করুন দ্রুত ডেলিভারিতে।"
  },
  cardAmbTitle: {
    en: "24/7 Emergency Ambulance",
    bn: "২৪/৭ জরুরি অ্যাম্বুলেন্স"
  },
  cardAmbDesc: {
    en: "ICU, AC & Standard ambulance dispatch with one-touch booking.",
    bn: "আইসিইউ, এসি ও সাধারণ অ্যাম্বুলেন্স সহজে কল করুন।"
  },
  cardBloodTitle: {
    en: "Emergency Blood Network",
    bn: "জরুরি রক্তদান নেটওয়ার্ক"
  },
  cardBloodDesc: {
    en: "Find voluntary blood donors or broadcast emergency blood request.",
    bn: "জরুরি রক্তের প্রয়োজনে রক্তদাতা খুঁজুন বা পোস্ট করুন।"
  },
  cardLabTitle: {
    en: "Home Diagnostic Lab",
    bn: "ঘরে বসে ল্যাব টেস্ট"
  },
  cardLabDesc: {
    en: "Sample collection from home with fast digital test reports.",
    bn: "বাসা থেকে রক্তের নমুনা সংগ্রহ ও দ্রুত অনলাইন রিপোর্ট।"
  },

  // Common UI
  loading: {
    en: "Loading...",
    bn: "লোড হচ্ছে..."
  },
  bookNow: {
    en: "Book Appointment",
    bn: "অ্যাপয়েন্টমেন্ট নিন"
  },
  details: {
    en: "View Details",
    bn: "বিস্তারিত দেখুন"
  },
  fee: {
    en: "Consultation Fee",
    bn: "পরামর্শ ফি"
  },
  currency: {
    en: "৳",
    bn: "৳"
  },
  specialty: {
    en: "Specialty",
    bn: "বিশেষত্ব"
  },
  experience: {
    en: "Experience",
    bn: "অভিজ্ঞতা"
  },
  hospital: {
    en: "Hospital",
    bn: "হাসপাতাল"
  },
  district: {
    en: "District",
    bn: "জেলা"
  },
  allDistricts: {
    en: "All Districts",
    bn: "সকল জেলা"
  },
  allSpecialties: {
    en: "All Specialties",
    bn: "সকল বিভাগ"
  },
  onlineVideo: {
    en: "Video Consultation",
    bn: "অনলাইন ভিডিও কনসালটেশন"
  },
  chamberVisit: {
    en: "In-Chamber Visit",
    bn: "চেম্বারে সরাসরি সাক্ষাৎ"
  },
  callNow: {
    en: "Call Hotline",
    bn: "সরাসরি কল করুন"
  },
  emergencyNotice: {
    en: "For severe life-threatening emergencies, immediately dial 999 or go to the nearest hospital emergency room.",
    bn: "জীবনঘাতী যেকোনো জরুরি অবস্থায় অবিলম্বে ৯৯৯ নম্বরে ডায়াল করুন বা নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('swastho_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'bn'; // Default to Bengali for local audience
  });

  useEffect(() => {
    localStorage.setItem('swastho_lang', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || translations[key].en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
