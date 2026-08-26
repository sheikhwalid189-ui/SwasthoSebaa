import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Home, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Plus, 
  Calendar, 
  Building2,
  FileCheck,
  Percent
} from 'lucide-react';
import { LabTest } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const DiagnosticLabTests: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useApp();

  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<LabTest | null>(null);
  
  // Home sample collection form
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+880 1');
  const [address, setAddress] = useState('');
  const [collectionDate, setCollectionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState('Morning (07:30 AM - 09:30 AM)');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    fetch('/api/lab-tests')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setTests(data.data);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !address) {
      alert('Please fill all required collection information');
      return;
    }

    setBookingConfirmed(true);
    showToast('Diagnostic Home Sample Collection Booked!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-amber-600" />
            <span>{language === 'bn' ? 'ডায়াগনস্টিক ল্যাব টেস্ট ও বাসায় স্যাম্পল কালেকশন' : 'Diagnostic Lab Tests & Home Sample Collection'}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {language === 'bn'
              ? 'আইএসও ও জেসিআই অনুমোদিত নির্ভরযোগ্য ল্যাব পার্টনারদের মাধ্যমে বাসায় বসে রক্ত ও নমুনা পরীক্ষা দিন এবং অনলাইনে ডিজিটাল রিপোর্ট গ্রহণ করুন।'
              : 'Book pathology checkups with certified lab partners. Trained phlebotomist collects blood samples at home.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-4 py-2 rounded-2xl border border-amber-200 text-xs font-bold shrink-0">
          <Home className="w-4 h-4 text-amber-600" />
          <span>Home Sample Collection Available</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs my-6">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'টেস্টের নাম লিখে খুঁজুন (যেমন: CBC, Lipid, Thyroid, Dengue...)' : 'Search diagnostic test or health package...'}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Lab Tests Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Loading Diagnostic Packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {test.category}
                  </span>
                  {test.homeSampleCollection && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      Home Collection
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{test.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{test.description}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Report Time:</strong> {test.reportTime}</span>
                  </p>
                  <p className="text-amber-900 bg-amber-50/70 p-1.5 rounded border border-amber-100">
                    <strong>Preparation:</strong> {test.fastingRequired}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-slate-900">৳ {test.price}</span>
                  {test.discountPrice && (
                    <span className="text-xs text-slate-400 line-through ml-1.5">৳{test.discountPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedTestForBooking(test);
                    setBookingConfirmed(false);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'টেস্ট বুক করুন' : 'Book Test'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Home Collection Booking Modal */}
      {selectedTestForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-600" />
                <span>Book Diagnostic Test</span>
              </h4>
              <button onClick={() => setSelectedTestForBooking(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900">Diagnostic Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  Our phlebotomist will arrive at your address on <strong>{collectionDate}</strong> during <strong>{preferredSlot}</strong>.
                </p>
                <button
                  onClick={() => setSelectedTestForBooking(null)}
                  className="px-6 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookLabTest} className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <strong className="text-slate-900 text-sm block">{selectedTestForBooking.name}</strong>
                  <span className="text-amber-800 font-bold">Total Fee: ৳{selectedTestForBooking.price} (Pay during sample collection)</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient name"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sample Pickup Address *</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, Road, Block, Thana"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Collection Date</label>
                    <input
                      type="date"
                      value={collectionDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCollectionDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Preference</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Morning (07:30 AM - 09:30 AM)">Morning (07:30 - 09:30 AM)</option>
                      <option value="Midday (10:00 AM - 12:00 PM)">Midday (10:00 - 12:00 PM)</option>
                      <option value="Afternoon (03:00 PM - 05:00 PM)">Afternoon (03:00 - 05:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Confirm Home Sample Pickup
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
