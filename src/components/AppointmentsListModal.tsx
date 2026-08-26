import React from 'react';
import { Calendar, Clock, Video, Building2, User, Phone, CheckCircle, X, Printer, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AppointmentsListModal: React.FC = () => {
  const { language } = useLanguage();
  const { appointments, isAppointmentsModalOpen, setIsAppointmentsModalOpen, setActiveTab } = useApp();

  if (!isAppointmentsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              {language === 'bn' ? 'আমার সকল অ্যাপয়েন্টমেন্ট' : 'My Booked Consultations'}
            </h3>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {appointments.length}
            </span>
          </div>
          <button
            onClick={() => setIsAppointmentsModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">
              {language === 'bn' ? 'আপনার এখনো কোনো অ্যাপয়েন্টমেন্ট বুক করা নেই।' : 'You have no booked doctor appointments yet.'}
            </p>
            <button
              onClick={() => {
                setIsAppointmentsModalOpen(false);
                setActiveTab('doctors');
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {language === 'bn' ? 'ডাক্তার বুক করুন' : 'Book a Doctor Now'}
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                      Token: {apt.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">{apt.doctorName}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{apt.doctorSpecialty}</p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {apt.status || 'Confirmed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                  <p><strong>Patient:</strong> {apt.patientName} ({apt.patientAge}y, {apt.patientGender})</p>
                  <p><strong>Phone:</strong> {apt.patientPhone}</p>
                  <p><strong>Date & Time:</strong> {apt.date} • {apt.timeSlot}</p>
                  <p><strong>Type:</strong> {apt.type}</p>
                  <p><strong>Payment:</strong> <span className="text-emerald-700 font-bold">{apt.paymentStatus} (৳{apt.fee})</span></p>
                  <p><strong>Queue Token:</strong> <span className="font-black text-teal-800">#{apt.tokenNumber || '1'}</span></p>
                </div>

                {apt.problemDescription && (
                  <p className="text-[11px] text-slate-500 bg-slate-100/70 p-2 rounded-lg">
                    <strong>Complaint:</strong> {apt.problemDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
