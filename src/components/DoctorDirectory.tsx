import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Video, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Phone,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Doctor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const DoctorDirectory: React.FC<{ initialSearch?: string }> = ({ initialSearch = '' }) => {
  const { language, t } = useLanguage();
  const { setSelectedDoctorForBooking } = useApp();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [telemedicineOnly, setTelemedicineOnly] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, selectedDistrict, telemedicineOnly]);

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = '/api/doctors?';
      if (selectedSpecialty !== 'All') url += `specialty=${encodeURIComponent(selectedSpecialty)}&`;
      if (selectedDistrict !== 'All') url += `district=${encodeURIComponent(selectedDistrict)}&`;
      if (telemedicineOnly) url += `telemedicine=true&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDoctors(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const specialtiesList = [
    { value: 'All', labelEn: 'All Specialties', labelBn: 'সকল বিভাগ' },
    { value: 'Medicine', labelEn: 'General Medicine', labelBn: 'মেডিসিন বিশেষজ্ঞ' },
    { value: 'Pediatrics', labelEn: 'Pediatrics & Child Health', labelBn: 'শিশু রোগ বিশেষজ্ঞ' },
    { value: 'Cardiology', labelEn: 'Cardiology & Heart', labelBn: 'হৃদরোগ বিশেষজ্ঞ' },
    { value: 'Gynecology', labelEn: 'Gynecology & Obstetrics', labelBn: 'স্ত্রীরোগ ও প্রসূতি' },
    { value: 'Neurology', labelEn: 'Neurology & Brain', labelBn: 'স্নায়ুরোগ বিশেষজ্ঞ' },
    { value: 'Orthopedics', labelEn: 'Orthopedics & Spine', labelBn: 'হাড় ও জোড়া সার্জন' },
    { value: 'Dermatology', labelEn: 'Dermatology & Skin', labelBn: 'চর্ম ও এলার্জি' },
    { value: 'Endocrinology', labelEn: 'Diabetes & Endocrinology', labelBn: 'ডায়াবেটিস ও হরমোন' }
  ];

  const districtsList = [
    'All', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{language === 'bn' ? 'বিশেষজ্ঞ ডাক্তার খুঁজুন ও অ্যাপয়েন্টমেন্ট নিন' : 'Find Specialist Doctors & Book Appointment'}</span>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {doctors.length} {language === 'bn' ? 'জন ডাক্তার' : 'Doctors Available'}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'bn' 
              ? 'বিএমডিসি নিবন্ধিত অভিজ্ঞ চিকিৎসকদের সাথে অনলাইন ভিডিও কনসালটেশন অথবা চেম্বার ভিজিট করুন।'
              : 'Consult verified BMDC physicians through live video telemedicine or in-chamber clinic visits.'}
          </p>
        </div>

        {/* Telemedicine fast toggle */}
        <div className="flex items-center gap-2 bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-200 shrink-0">
          <Video className="w-4 h-4 text-teal-600" />
          <label className="text-xs sm:text-sm font-semibold text-teal-900 cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={telemedicineOnly}
              onChange={(e) => setTelemedicineOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
            {language === 'bn' ? 'অনলাইন ভিডিও কনসালটেশন' : 'Online Video Only'}
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 my-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Keyword Search */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {language === 'bn' ? 'ডাক্তার / হাসপাতালের নাম' : 'Doctor / Hospital / Disease'}
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: Dr. Farzana, কার্ডিওলজি...' : 'e.g. Dr. Syed, Heart...'}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {language === 'bn' ? 'বিশেষজ্ঞ বিভাগ' : 'Medical Specialty'}
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            >
              {specialtiesList.map((spec, i) => (
                <option key={i} value={spec.value}>
                  {language === 'bn' ? spec.labelBn : spec.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {language === 'bn' ? 'জেলা / অঞ্চল' : 'District Location'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            >
              {districtsList.map((dist, i) => (
                <option key={i} value={dist}>
                  {dist === 'All' ? (language === 'bn' ? 'সকল জেলা' : 'All Districts') : dist}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Doctor Cards List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-slate-500 text-sm font-medium">{t('loading')}</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">
            {language === 'bn' ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No Doctors Found'}
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            {language === 'bn' ? 'অনুগ্রহ করে ভিন্ন বিভাগ বা কীওয়ার্ড দিয়ে অনুসন্ধান করুন।' : 'Try changing your search terms or filter selection.'}
          </p>
          <button
            onClick={() => { setSelectedSpecialty('All'); setSelectedDistrict('All'); setSearchTerm(''); setTelemedicineOnly(false); }}
            className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-100"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Doctor Head Info */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-teal-100 shadow-2xs group-hover:border-teal-500 transition-colors"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 bg-teal-600 text-white p-0.5 rounded-full shadow-xs" title="BMDC Verified">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {language === 'bn' ? doctor.specialtyBn : doctor.specialty}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{doctor.rating}</span>
                        <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-1 leading-snug group-hover:text-teal-700 transition-colors">
                      {language === 'bn' ? doctor.nameBn : doctor.name}
                    </h3>
                    
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                      {doctor.degrees}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{doctor.experience}</span>
                      <span>•</span>
                      <span className="text-teal-700 font-mono text-[11px]">{doctor.bmdcReg}</span>
                    </div>
                  </div>
                </div>

                {/* Hospital & Chamber Address */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.chamberAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-slate-700 font-medium">
                      {doctor.availableTime} ({doctor.availableDays.join(', ')})
                    </span>
                  </div>
                </div>

                {/* Consultation Fee & Mode Badges */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">{t('fee')}</span>
                    <span className="text-base font-extrabold text-teal-700">
                      ৳ {doctor.fee}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">(Follow-up: ৳{doctor.followupFee})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doctor.telemedicine && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 px-2 py-1 rounded-lg">
                        <Video className="w-3 h-3" />
                        {language === 'bn' ? 'ভিডিও কল' : 'Video Call'}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-lg">
                      <Building2 className="w-3 h-3" />
                      {language === 'bn' ? 'চেম্বার' : 'Chamber'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoctorDetails(doctor)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {t('details')}
                </button>
                <button
                  onClick={() => setSelectedDoctorForBooking(doctor)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-xs shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('bookNow')}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Doctor Full Profile Modal */}
      {selectedDoctorDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctorDetails.avatar}
                  alt={selectedDoctorDetails.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'bn' ? selectedDoctorDetails.nameBn : selectedDoctorDetails.name}
                  </h3>
                  <p className="text-xs text-teal-700 font-semibold">{selectedDoctorDetails.specialty}</p>
                  <p className="text-[11px] text-slate-500">{selectedDoctorDetails.degrees}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorDetails(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{language === 'bn' ? 'ডাক্তার পরিচিতি' : 'About the Doctor'}</h4>
                <p className="text-slate-600 leading-relaxed">{selectedDoctorDetails.about}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                <p><strong>{language === 'bn' ? 'বিএমডিসি নম্বর:' : 'BMDC Reg:'}</strong> {selectedDoctorDetails.bmdcReg}</p>
                <p><strong>{language === 'bn' ? 'অভিজ্ঞতা:' : 'Experience:'}</strong> {selectedDoctorDetails.experience}</p>
                <p><strong>{language === 'bn' ? 'কর্মস্থল:' : 'Affiliated Hospital:'}</strong> {selectedDoctorDetails.hospital}</p>
                <p><strong>{language === 'bn' ? 'চেম্বার ঠিকানা:' : 'Chamber:'}</strong> {selectedDoctorDetails.chamberAddress}</p>
                <p><strong>{language === 'bn' ? 'পরামর্শ ফি:' : 'Consultation Fee:'}</strong> ৳{selectedDoctorDetails.fee} (Follow-up: ৳{selectedDoctorDetails.followupFee})</p>
                <p><strong>{language === 'bn' ? 'ভাষাসমূহ:' : 'Consultation Languages:'}</strong> {selectedDoctorDetails.languages.join(', ')}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedDoctorDetails(null)}
                className="w-1/3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const doc = selectedDoctorDetails;
                  setSelectedDoctorDetails(null);
                  setSelectedDoctorForBooking(doc);
                }}
                className="w-2/3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                {t('bookNow')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
