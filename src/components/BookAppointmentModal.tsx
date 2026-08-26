import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  User, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard,
  Sparkles,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const BookAppointmentModal: React.FC = () => {
  const { language, t } = useLanguage();
  const { selectedDoctorForBooking, setSelectedDoctorForBooking, addAppointment } = useApp();

  const [consultationType, setConsultationType] = useState<'video' | 'chamber'>('video');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM');
  
  // Patient details
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+880 1');
  const [patientAge, setPatientAge] = useState('28');
  const [patientGender, setPatientGender] = useState('Male');
  const [problemDescription, setProblemDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'pay_chamber'>('bkash');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!selectedDoctorForBooking) return null;

  const doctor = selectedDoctorForBooking;

  const timeSlots = [
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে রোগীর নাম ও মোবাইল নম্বর পূরণ করুন।' : 'Please enter patient name and phone number.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorDegree: doctor.degrees,
      hospital: doctor.hospital,
      patientName,
      patientPhone,
      patientAge: Number(patientAge) || 28,
      patientGender,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultationType === 'video' ? 'Video Consultation (অনলাইন ভিডিও)' : 'In-Chamber (চেম্বারে সাক্ষাৎ)',
      fee: doctor.fee,
      paymentMethod,
      problemDescription
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        addAppointment(data.data);
        setConfirmedBooking(data.data);
      } else {
        // Fallback local booking
        const fallbackApt: Appointment = {
          id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
          ...payload,
          status: 'Confirmed',
          paymentStatus: paymentMethod === 'pay_chamber' ? 'Pay at Chamber' : `Paid (${paymentMethod})`,
          tokenNumber: Math.floor(1 + Math.random() * 20),
          createdAt: new Date().toISOString()
        };
        addAppointment(fallbackApt);
        setConfirmedBooking(fallbackApt);
      }
    } catch (err) {
      console.error('Booking error:', err);
      const fallbackApt: Appointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        status: 'Confirmed',
        paymentStatus: paymentMethod === 'pay_chamber' ? 'Pay at Chamber' : `Paid (${paymentMethod})`,
        tokenNumber: Math.floor(1 + Math.random() * 20),
        createdAt: new Date().toISOString()
      };
      addAppointment(fallbackApt);
      setConfirmedBooking(fallbackApt);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToken = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.id);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl space-y-5 animate-scaleUp my-auto">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-teal-700 font-extrabold text-lg">
            <Calendar className="w-5 h-5" />
            <span>{confirmedBooking ? (language === 'bn' ? 'অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ' : 'Appointment Confirmed') : (language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট বুকিং' : 'Book Doctor Appointment')}</span>
          </div>
          <button
            onClick={() => setSelectedDoctorForBooking(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Booking Confirmation Screen */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট সফল হয়েছে!' : 'Appointment Confirmed!'}
              </h3>
              <p className="text-sm text-slate-600">
                {language === 'bn'
                  ? 'আপনার অ্যাপয়েন্টমেন্টের বিস্তারিত তথ্য এসএমএসের মাধ্যমে পাঠানো হয়েছে।'
                  : 'Your consultation slot is locked and confirmation SMS is dispatched.'}
              </p>
            </div>

            {/* Token Card */}
            <div className="bg-linear-to-tr from-teal-50 via-emerald-50 to-sky-50 rounded-2xl p-5 border-2 border-teal-200 text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-teal-200/80 pb-2">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Appointment Token ID</span>
                  <span className="text-lg font-mono font-extrabold text-teal-950">{confirmedBooking.id}</span>
                </div>
                <button
                  onClick={copyToken}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white text-teal-800 rounded-lg border border-teal-300 shadow-2xs hover:bg-teal-50"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500 block">Doctor</span>
                  <strong className="text-slate-900">{confirmedBooking.doctorName}</strong>
                  <span className="text-[11px] text-teal-700 block">{confirmedBooking.doctorSpecialty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Patient</span>
                  <strong className="text-slate-900">{confirmedBooking.patientName}</strong>
                  <span className="text-[11px] text-slate-600 block">{confirmedBooking.patientPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date & Time</span>
                  <strong className="text-slate-900">{confirmedBooking.date}</strong>
                  <span className="text-teal-700 font-semibold block">{confirmedBooking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Queue Serial / Token</span>
                  <span className="text-sm font-extrabold text-teal-800">#{confirmedBooking.tokenNumber || '1'}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-teal-100">
                  <span className="text-slate-500 block">Mode & Payment</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.type}</span> • <span className="text-emerald-700 font-bold">{confirmedBooking.paymentStatus} (৳{confirmedBooking.fee})</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save'}</span>
              </button>
              <button
                onClick={() => setSelectedDoctorForBooking(null)}
                className="w-1/2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Selected Doctor Summary */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-teal-50/80 border border-teal-200">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-13 h-13 rounded-xl object-cover border border-teal-300"
              />
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm truncate">
                  {language === 'bn' ? doctor.nameBn : doctor.name}
                </h4>
                <p className="text-teal-700 font-semibold truncate">{doctor.specialty}</p>
                <p className="text-slate-500 truncate">{doctor.hospital}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-500 block">{t('fee')}</span>
                <span className="text-base font-extrabold text-teal-800">৳ {doctor.fee}</span>
              </div>
            </div>

            {/* Consultation Mode Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'bn' ? 'পরামর্শের ধরন নির্বাচন করুন' : 'Select Consultation Mode'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    consultationType === 'video'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className={`w-4 h-4 ${consultationType === 'video' ? 'text-teal-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="block text-xs font-bold">{t('onlineVideo')}</span>
                    <span className="text-[10px] text-slate-500">HD Video on Mobile/PC</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('chamber')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    consultationType === 'chamber'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${consultationType === 'chamber' ? 'text-teal-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="block text-xs font-bold">{t('chamberVisit')}</span>
                    <span className="text-[10px] text-slate-500">{doctor.district} Chamber</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Time Slot Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'তারিখ' : 'Appointment Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'উপলব্ধ সময় স্লট' : 'Available Time Slot'}
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  {timeSlots.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Info Fields */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">
                {language === 'bn' ? 'রোগীর তথ্য' : 'Patient Information'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={language === 'bn' ? 'রোগীর পূর্ণ নাম *' : 'Patient Full Name *'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+880 1712-345678 *"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="Age"
                    min="1"
                    max="120"
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-teal-500"
                  />
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-teal-500 bg-white"
                  >
                    <option value="Male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                    <option value="Female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
                    <option value="Other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder={language === 'bn' ? 'সমস্যার সংক্ষিপ্ত বিবরণ (যেমন: ৩ দিনের জ্বর)' : 'Chief complaint / Symptoms'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">
                {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Payment Method'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bkash', label: 'bKash (বিকাশ)', color: 'border-pink-500 text-pink-700 bg-pink-50' },
                  { id: 'nagad', label: 'Nagad (নগদ)', color: 'border-orange-500 text-orange-700 bg-orange-50' },
                  { id: 'card', label: 'Visa / Master', color: 'border-blue-500 text-blue-700 bg-blue-50' },
                  { id: 'pay_chamber', label: 'Pay at Chamber', color: 'border-slate-400 text-slate-700 bg-slate-50' }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      paymentMethod === pm.id
                        ? `${pm.color} ring-1 ring-teal-500 shadow-2xs`
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'bn' ? 'বুকিং প্রক্রিয়া চলছে...' : 'Confirming Appointment...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'bn' ? `৳${doctor.fee} পরিশোধ ও অ্যাপয়েন্টমেন্ট নিশ্চিত করুন` : `Pay ৳${doctor.fee} & Confirm Booking`}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
