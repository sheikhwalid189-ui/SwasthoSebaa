import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Activity, 
  Heart, 
  Droplet, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Pill, 
  Calendar,
  Camera,
  Trash2
} from 'lucide-react';
import { PrescriptionAnalysisResult, HealthVitalRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const PrescriptionVault: React.FC = () => {
  const { language } = useLanguage();
  const { vitalRecords, addVitalRecord } = useApp();

  const [activeTab, setActiveTab] = useState<'scanner' | 'vitals'>('scanner');
  
  // Scanner state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PrescriptionAnalysisResult | null>(null);

  // Vitals form modal state
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [glucose, setGlucose] = useState('5.5');
  const [sugarType, setSugarType] = useState<'Fasting' | '2h After Meal' | 'Random'>('Fasting');
  const [weight, setWeight] = useState('68');
  const [height, setHeight] = useState('170');
  const [vitalNotes, setVitalNotes] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage && !manualText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/analyze-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          textContent: manualText,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('Prescription analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddVitalRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HealthVitalRecord = {
      id: `vit-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      systolicBp: Number(systolic) || 120,
      diastolicBp: Number(diastolic) || 80,
      pulseRate: Number(pulse) || 72,
      bloodSugar: Number(glucose) || 5.5,
      sugarType,
      weightKg: Number(weight) || 68,
      heightCm: Number(height) || 170,
      notes: vitalNotes
    };

    addVitalRecord(newRecord);
    setIsVitalsModalOpen(false);
    setVitalNotes('');
  };

  const getBpStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Optimal / Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated BP', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (sys <= 139 || dia <= 89) return { label: 'Stage 1 Hypertension', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Stage 2 Hypertension', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const getBmi = (w: number, h: number) => {
    if (!w || !h) return 0;
    const heightInMeters = h / 100;
    return Number((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title & Sub Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-teal-600" />
            <span>{language === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন ও স্বাস্থ্য রেকর্ড' : 'Digital Prescription & Health Records Vault'}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {language === 'bn'
              ? 'এআই দিয়ে প্রেসক্রিপশন ও ল্যাব রিপোর্ট বিশ্লেষণ করুন এবং রক্তচাপ, সুগার ও ওজন ট্র্যাকিং বজায় রাখুন।'
              : 'Scan prescriptions with Gemini OCR, understand medications & log daily health vitals.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scanner'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'এআই প্রেসক্রিপশন স্ক্যানার' : 'AI Prescription Scanner'}</span>
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'vitals'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'স্বাস্থ্য ভাইটালস ট্র্যাকার' : 'Health Vitals Vault'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Prescription Scanner */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          
          {/* Upload and Input Section (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'bn' ? 'প্রেসক্রিপশন আপলোড বা তথ্য প্রদান' : 'Upload Prescription or Clinical Note'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn'
                  ? 'আপনার প্রেসক্রিপশনের ছবি বা লিখিত ঔষধের নাম প্রদান করুন।'
                  : 'Upload an image or paste handwritten/printed medication text.'}
              </p>
            </div>

            <form onSubmit={handleAnalyzePrescription} className="space-y-4 text-xs">
              
              {/* File Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'bn' ? 'প্রেসক্রিপশনের ছবি নির্বাচন করুন' : 'Prescription Photo'}
                </label>
                
                {selectedImage ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 p-2 bg-slate-50">
                    <img
                      src={selectedImage}
                      alt="Uploaded Prescription"
                      className="max-h-48 w-full object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 right-3 bg-rose-600 text-white p-1.5 rounded-full shadow-md hover:bg-rose-700"
                      title="Remove Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30">
                    <Camera className="w-8 h-8 text-teal-600 mb-2" />
                    <span className="font-bold text-slate-800 text-xs">
                      {language === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to Upload / Take Photo'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Text note or manual medicine input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'অথবা ঔষধের নাম / প্রেসক্রিপশন টেক্সট লিখুন' : 'Or Paste Prescription Text / Medicines'}
                </label>
                <textarea
                  rows={3}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: Tab Napa 500mg (1+0+1), Cap Sergel 20mg (1+0+1 খাবার আগে)...' : 'e.g. Tab Napa Extra 1+0+1, Cap Sergel 20mg once daily before meals...'}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || (!selectedImage && !manualText.trim())}
                className="w-full py-3 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'bn' ? 'এআই বিশ্লেষণ চলছে...' : 'Analyzing with Gemini OCR...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রেসক্রিপশন বিশ্লেষণ করুন' : 'Analyze Prescription'}</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Results Section (7 cols) */}
          <div className="lg:col-span-7">
            {analysisResult ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 animate-fadeIn">
                
                {/* Doctor & Date Header */}
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 uppercase block">Prescribing Authority</span>
                    <h4 className="text-sm font-bold text-slate-900">{analysisResult.doctorInfo}</h4>
                  </div>
                  <span className="text-xs bg-white text-teal-800 font-semibold px-2.5 py-1 rounded-lg border border-teal-200">
                    Date: {analysisResult.date}
                  </span>
                </div>

                {/* Extracted Medications */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>{language === 'bn' ? 'শনাক্তকৃত ঔষধসমূহ ও নিয়মাবলী' : 'Identified Medications & Schedules'}</span>
                  </h4>

                  <div className="space-y-2.5">
                    {analysisResult.medications.map((med, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 text-sm font-bold">{med.name}</strong>
                          <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                            {med.schedule}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                          <p><strong>Timing:</strong> {med.timing}</p>
                          <p><strong>Duration:</strong> {med.duration}</p>
                        </div>
                        <p className="text-[11px] text-teal-900 bg-teal-50/60 p-2 rounded-lg border border-teal-100">
                          <strong>Purpose:</strong> {med.purpose}
                        </p>
                        {med.precautions && (
                          <p className="text-[10px] text-amber-800">⚠️ {med.precautions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Tests & Lifestyle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {analysisResult.suggestedTests?.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                      <h5 className="font-bold text-sky-900">Recommended Lab Tests</h5>
                      <ul className="list-disc list-inside text-sky-950 text-[11px] space-y-0.5">
                        {analysisResult.suggestedTests.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.dietaryAdvice?.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <h5 className="font-bold text-emerald-900">Diet & Lifestyle Guidance</h5>
                      <ul className="list-disc list-inside text-emerald-950 text-[11px] space-y-0.5">
                        {analysisResult.dietaryAdvice.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ℹ️ {language === 'bn' ? analysisResult.importantNoteBn : analysisResult.importantNoteEn}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 flex flex-col items-center justify-center h-full min-h-[400px]">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-800 text-base">
                  {language === 'bn' ? 'প্রেসক্রিপশন ফলাফল এখানে প্রদর্শিত হবে' : 'Prescription Analysis Appears Here'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  {language === 'bn'
                    ? 'প্রেসক্রিপশন আপলোড করে এআই বিশ্লেষণের মাধ্যমে ওষুধের তালিকা, ডোজের নিয়ম ও সতর্কতা জানুন।'
                    : 'Upload your medical prescription to extract dose schedules, precautions, and dietary advice.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Health Vitals Vault */}
      {activeTab === 'vitals' && (
        <div className="my-6 space-y-6">
          
          {/* Quick Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* BP Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Latest Blood Pressure</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {vitalRecords[0]?.systolicBp || 120}/{vitalRecords[0]?.diastolicBp || 80}
                  </span>
                  <span className="text-xs text-slate-500">mmHg</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block bg-emerald-100 text-emerald-800">
                  Normal Range
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
            </div>

            {/* Blood Sugar Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Blood Glucose</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {vitalRecords[0]?.bloodSugar || 5.6}
                  </span>
                  <span className="text-xs text-slate-500">mmol/L</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block bg-teal-100 text-teal-800">
                  {vitalRecords[0]?.sugarType || 'Fasting'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Droplet className="w-6 h-6" />
              </div>
            </div>

            {/* Pulse Rate */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Heart Pulse Rate</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {vitalRecords[0]?.pulseRate || 74}
                  </span>
                  <span className="text-xs text-slate-500">BPM</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block bg-sky-100 text-sky-800">
                  Resting Pulse
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* BMI Calculator */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Body Mass Index (BMI)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {getBmi(vitalRecords[0]?.weightKg || 68, vitalRecords[0]?.heightCm || 172)}
                  </span>
                  <span className="text-xs text-slate-500">kg/m²</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block bg-emerald-100 text-emerald-800">
                  Normal Weight
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Records Log Table Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {language === 'bn' ? 'দৈনিক স্বাস্থ্য রেকর্ড হিস্টোরি' : 'Health Vitals History Log'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'নিয়মিত পরিমাপ রেকর্ড করে স্বাস্থ্য সচেতন থাকুন।' : 'Log and review your periodic health indicators.'}
                </p>
              </div>

              <button
                onClick={() => setIsVitalsModalOpen(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ভাইটালস যোগ করুন' : 'Log New Vitals'}</span>
              </button>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Blood Pressure</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Pulse</th>
                    <th className="pb-3 px-3">Glucose (mmol/L)</th>
                    <th className="pb-3 px-3">Weight (Kg)</th>
                    <th className="pb-3 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vitalRecords.map((r) => {
                    const bpStatus = getBpStatus(r.systolicBp, r.diastolicBp);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.date}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{r.systolicBp}/{r.diastolicBp} mmHg</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${bpStatus.color}`}>
                            {bpStatus.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{r.pulseRate} bpm</td>
                        <td className="py-3 px-3 text-slate-700">{r.bloodSugar} ({r.sugarType})</td>
                        <td className="py-3 px-3 text-slate-700">{r.weightKg} kg</td>
                        <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{r.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Log New Vitals Modal */}
      {isVitalsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'bn' ? 'নতুন স্বাস্থ্য ভাইটালস রেকর্ড করুন' : 'Log New Health Vitals'}
              </h4>
              <button onClick={() => setIsVitalsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddVitalRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Sugar (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sugar Measurement Type</label>
                  <select
                    value={sugarType}
                    onChange={(e) => setSugarType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Fasting">Fasting (খালি পেটে)</option>
                    <option value="2h After Meal">2h After Meal (খাবারের ২ ঘণ্টা পর)</option>
                    <option value="Random">Random (র‍্যান্ডম)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (Kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Feeling</label>
                <input
                  type="text"
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                  placeholder="e.g. After morning brisk walk"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVitalsModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
