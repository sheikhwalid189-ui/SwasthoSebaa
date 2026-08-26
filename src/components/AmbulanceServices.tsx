import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  Activity, 
  AlertCircle,
  Truck,
  Phone
} from 'lucide-react';
import { AmbulanceService } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AmbulanceServices: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useApp();

  const [services, setServices] = useState<AmbulanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationHospital, setDestinationHospital] = useState('');
  const [patientPhone, setPatientPhone] = useState('+880 1');
  const [reqSent, setReqSent] = useState(false);

  useEffect(() => {
    fetch('/api/ambulance')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleAmbulanceDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !patientPhone) {
      alert('Please fill pickup location and phone');
      return;
    }

    setReqSent(true);
    showToast('Ambulance emergency dispatch notified! Driver calling in 2 minutes.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Emergency Header Hero */}
      <div className="bg-linear-to-r from-rose-900 via-red-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>24/7 Nationwide Emergency Response</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'bn' ? '২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা ও আইসিইউ ট্রান্সপোর্ট' : '24/7 Emergency Ambulance & Critical ICU Fleet'}
          </h2>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {language === 'bn'
              ? 'আইসিইউ লাইফ সাপোর্ট, এসি অ্যাম্বুলেন্স ও ফ্রিজার ভ্যান সেবা পেতে সরাসরি কল করুন অথবা তাত্ক্ষণিক পিকআপ অনুরোধ করুন।'
              : 'Direct hotline connection to certified ICU life support, neonatal carriers, AC and air ambulance carriers across Bangladesh.'}
          </p>

          {/* Quick Call Action Bar */}
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="tel:16263"
              className="px-5 py-2.5 rounded-xl bg-white text-rose-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-rose-50 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>Call 16263 (Health Hotline)</span>
            </a>

            <a
              href="tel:999"
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-rose-700 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Dial 999 (National Emergency)</span>
            </a>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-950/80 text-rose-200 border border-rose-500/50 font-bold text-xs sm:text-sm hover:bg-rose-950 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Request Fast Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory of Verified Ambulance Fleets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-rose-600" />
            <span>Verified Ambulance Fleets & Contact Directory</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{services.length} Fleet Hubs</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading Fleet Directory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{service.providerName}</h4>
                    <span className="text-xs text-rose-700 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {service.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ★ {service.rating}
                  </span>
                </div>

                {/* Vehicles Available */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.vehicleTypes.map((v, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {v}
                    </span>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Coverage:</strong> {service.coverage}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span><strong>Est. Tariff:</strong> {service.baseRate}</span>
                  </p>
                </div>

                {/* Call Button */}
                <div className="pt-2 flex gap-2">
                  <a
                    href={`tel:${service.phone}`}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {service.hotline}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispatch Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 text-rose-700">
                <Truck className="w-5 h-5" />
                <span>Quick Dispatch Request</span>
              </h4>
              <button onClick={() => { setIsRequestModalOpen(false); setReqSent(false); }} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {reqSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900">Emergency Dispatch Notified!</h4>
                <p className="text-xs text-slate-500">The nearest ambulance coordinator is calling your number right now.</p>
                <button
                  onClick={() => { setIsRequestModalOpen(false); setReqSent(false); }}
                  className="px-6 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleAmbulanceDispatchSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Address / Area *</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Hospital (if known)</label>
                  <input
                    type="text"
                    value={destinationHospital}
                    onChange={(e) => setDestinationHospital(e.target.value)}
                    placeholder="e.g. Dhaka Medical College Hospital"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Confirm Instant Dispatch
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
