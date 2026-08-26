import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Plus, 
  MapPin, 
  Phone, 
  Hospital, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { BloodRequest } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const BloodDonorHub: React.FC = () => {
  const { language } = useLanguage();
  const { bloodRequests, addBloodRequest, showToast } = useApp();

  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // New request form state
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [unitsNeeded, setUnitsNeeded] = useState('1');
  const [hospital, setHospital] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('+880 1');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('Immediate (জরুরি)');

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredRequests = bloodRequests.filter(req => {
    if (selectedGroup !== 'All' && req.bloodGroup !== selectedGroup) return false;
    if (selectedDistrict !== 'All' && req.district !== selectedDistrict) return false;
    return true;
  });

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospital || !contactPhone) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      patientName,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded) || 1,
      hospital,
      district,
      contactPerson: contactPerson || patientName,
      contactPhone,
      reason,
      urgency
    };

    try {
      const res = await fetch('/api/blood-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        addBloodRequest(data.data);
      } else {
        const fallback: BloodRequest = {
          id: `BLD-${Math.floor(100 + Math.random() * 900)}`,
          ...payload,
          status: 'Active',
          postedAt: new Date().toISOString()
        };
        addBloodRequest(fallback);
      }
    } catch (e) {
      const fallback: BloodRequest = {
        id: `BLD-${Math.floor(100 + Math.random() * 900)}`,
        ...payload,
        status: 'Active',
        postedAt: new Date().toISOString()
      };
      addBloodRequest(fallback);
    }

    setIsPostModalOpen(false);
    setPatientName('');
    setHospital('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Droplet className="w-7 h-7 text-red-600 fill-red-600" />
            <span>{language === 'bn' ? 'জরুরি রক্তদান নেটওয়ার্ক ও রক্তদাতা সন্ধান' : 'Emergency Blood Donor Hub & Transfusion Network'}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {language === 'bn'
              ? 'জরুরি রক্তের প্রয়োজনে সরাসরি স্বতঃস্ফূর্ত রক্তদাতাদের সাথে যোগাযোগ করুন অথবা রিকুয়েস্ট পোস্ট করুন।'
              : 'Broadcast urgent blood requests or connect directly with voluntary donors in hospitals across Bangladesh.'}
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-600/20 flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'জরুরি রক্তের পোস্ট দিন' : 'Post Blood Emergency'}</span>
        </button>
      </div>

      {/* Blood Group Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs my-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Filter by Blood Group:</span>
          <span className="text-xs text-slate-400 font-semibold">{filteredRequests.length} Active Emergency Requests</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {bloodGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGroup === grp
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200/60'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-5 border-2 border-red-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{req.unitsNeeded} Bag(s) Needed</span>
                    <span className="text-[10px] text-red-600 font-bold uppercase">{req.urgency}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {req.id}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{req.reason}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 space-y-1">
                <p className="flex items-center gap-1.5 font-medium">
                  <Hospital className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">{req.hospital}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{req.district}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 truncate">
                <span>Contact: </span>
                <strong className="text-slate-800">{req.contactPerson}</strong>
              </div>

              <a
                href={`tel:${req.contactPhone}`}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Post Emergency Blood Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 text-red-600">
                <Droplet className="w-5 h-5 fill-red-600" />
                <span>Broadcast Urgent Blood Need</span>
              </h4>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-red-600"
                  >
                    {bloodGroups.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Units (Bags) *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
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
                <label className="block font-semibold text-slate-700 mb-1">Hospital & Ward *</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. DMCH Bed 14, New Surgery Wing"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+880 17..."
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Clinical Note</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Surgery / Thalassemia / Delivery"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md"
                >
                  Broadcast Emergency Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
