import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  RefreshCw, 
  Stethoscope, 
  ShieldAlert, 
  User, 
  Activity, 
  ArrowRight,
  Flame,
  Info,
  Clock,
  HeartPulse
} from 'lucide-react';
import { ChatMessage, SymptomTriageResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AiHealthAssistant: React.FC = () => {
  const { language, t } = useLanguage();
  const { setActiveTab } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'symptom-checker'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: language === 'bn' 
        ? `নমস্কার / আসসালামু আলাইকুম! আমি **স্বাস্থ্যসেবা এআই সহকারী** (SwasthoSeba AI)।
আপনার শারীরিক লক্ষণ, প্রাথমিক চিকিৎসা পরামর্শ, খাদ্যতালিকা কিংবা কোনো ওষুধের নিয়ম সম্পর্কে যেকোনো প্রশ্ন আমাকে করতে পারেন।

*জরুরি দ্রষ্টব্য: যেকোনো জীবনঘাতী বা গুরুতর সমস্যায় অবিলম্বে ৯৯৯ বা ১৬২৬৩ নম্বরে ডায়াল করুন।*`
        : `Hello! I am your **SwasthoSeba AI Health Assistant**.
Feel free to ask me about symptoms, initial health triage, diet advice, or understanding prescriptions.

*Emergency Note: For life-threatening symptoms, immediately call 999 or 16263.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Symptom Checker State
  const [symptomsInput, setSymptomsInput] = useState('');
  const [patientAge, setPatientAge] = useState('30');
  const [patientGender, setPatientGender] = useState('Male');
  const [symptomDuration, setSymptomDuration] = useState('2-3 Days');
  const [severityLevel, setSeverityLevel] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<SymptomTriageResult | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Suggested Prompts
  const suggestedPrompts = [
    { en: "How to manage high fever at home?", bn: "উচ্চ জ্বর হলে তাৎক্ষণিক কী করা উচিত?" },
    { en: "Diet tips for gastric & acidity relief", bn: "গ্যাস্ট্রিক ও বুকজ্বালা দূর করার ঘরোয়া খাদ্যতালিকা" },
    { en: "Normal fasting blood sugar range", bn: "খালি পেটে রক্তের সুগার কত থাকা স্বাভাবিক?" },
    { en: "Early symptoms of Dengue fever in Bangladesh", bn: "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ ও করণীয়" }
  ];

  const handleSendMessage = async (customMessage?: string) => {
    const text = (customMessage || inputPrompt).trim();
    if (!text || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInputPrompt('');
    setIsChatLoading(true);

    try {
      // Build conversation history format for server
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyPayload,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: Math.random().toString(),
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'No response generated');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        content: language === 'bn'
          ? "দুঃখিত, সংযোগে সাময়িক সমস্যা হচ্ছে। জরুরি স্বাস্থ্য সহায়তার জন্য জাতীয় স্বাস্থ্য বাতায়ন ১৬২৬৩ নম্বরে ডায়াল করুন অথবা স্বাস্হ্যসেবা বিশেষজ্ঞ ডাক্তার বুক করুন।"
          : "We encountered a temporary connection issue. For immediate medical guidance, please dial the national health hotline 16263 or consult our verified doctors.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSymptomTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsTriageLoading(true);
    setTriageResult(null);

    try {
      const res = await fetch('/api/gemini/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsInput,
          age: patientAge,
          gender: patientGender,
          duration: symptomDuration,
          severity: severityLevel,
          additionalNotes,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setTriageResult(data.data);
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsTriageLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Google Gemini 2.5 Flash</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'bn' ? 'স্বাস্হ্যসেবা এআই স্বাস্থ্য সহকারী ও লক্ষণ পরীক্ষক' : 'SwasthoSeba AI Health Assistant & Symptom Triage'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {language === 'bn'
              ? 'সার্বক্ষণিক নির্ভরযোগ্য স্বাস্থ্য তথ্য, লক্ষণ মূল্যায়ন, জরুরি সতর্কতা এবং প্রাথমিক চিকিৎসার দিকনির্দেশনা পান বাংলা ও ইংরেজিতে।'
              : 'Get instant clinical health answers, symptom analysis, emergency red-flag screening, and actionable lifestyle advice in real-time.'}
          </p>

          {/* Sub Tab Switcher */}
          <div className="pt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'chat'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{language === 'bn' ? 'এআই লাইভ চ্যাট' : 'Live AI Health Chat'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('symptom-checker')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'symptom-checker'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{language === 'bn' ? 'স্মার্ট লক্ষণ পরীক্ষক (Triage)' : 'Smart Symptom Checker'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode 1: Live AI Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[650px]">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">SwasthoSeba AI Assistant</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Online & Ready in বাংলা / English</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
              title="Clear Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'চ্যাট রিসেট' : 'Reset'}</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                    isUser ? 'bg-slate-800' : 'bg-teal-600 shadow-xs'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>
                    <div className={`text-[10px] mt-1.5 flex items-center justify-between gap-2 ${
                      isUser ? 'text-slate-400' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.source && (
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                          {msg.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>{language === 'bn' ? 'এআই উত্তর প্রস্তুত করছে...' : 'Consulting Gemini medical engine...'}</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">{language === 'bn' ? 'পরামর্শ:' : 'Suggestions:'}</span>
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(language === 'bn' ? p.bn : p.en)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200"
              >
                {language === 'bn' ? p.bn : p.en}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার স্বাস্থ্য জিজ্ঞাসা লিখুন (বাংলা বা ইংরেজিতে)...' : 'Type your health question in Bangla or English...'}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={isChatLoading || !inputPrompt.trim()}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'পাঠান' : 'Send'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Main Mode 2: Symptom Checker Triage Form */}
      {activeSubTab === 'symptom-checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                <span>{language === 'bn' ? 'লক্ষণ ও তথ্যাদি পূরণ করুন' : 'Enter Symptoms & Details'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'সঠিক মূল্যায়নের জন্য নির্ভুল তথ্য প্রদান করুন।' : 'Provide comprehensive information for accurate triage.'}
              </p>
            </div>

            <form onSubmit={handleSymptomTriage} className="space-y-4 text-xs">
              
              {/* Symptoms Main Box */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'শারীরিক লক্ষণ বা সমস্যা *' : 'Symptoms or Health Complaints *'}
                </label>
                <textarea
                  rows={3}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: ২ দিন ধরে তীব্র জ্বর, সাথে শুকনো কাশি, গলাব্যথা এবং গা ব্যথা করছে...' : 'e.g. Fever for 2 days, dry cough, sore throat and severe body ache...'}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'bn' ? 'বয়স (বছর)' : 'Age (Years)'}</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    min="1"
                    max="120"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'bn' ? 'লিঙ্গ' : 'Gender'}</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                    <option value="Female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
                    <option value="Other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>
              </div>

              {/* Duration and Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'bn' ? 'কতদিন ধরে লক্ষণ?' : 'Duration'}</label>
                  <select
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Today (আজ শুরু)">Today (আজকে)</option>
                    <option value="2-3 Days">2-3 Days (২-৩ দিন)</option>
                    <option value="1 Week">1 Week (১ সপ্তাহ)</option>
                    <option value="Over 2 Weeks">Over 2 Weeks (২ সপ্তাহের বেশি)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'bn' ? 'তীব্রতা' : 'Reported Severity'}</label>
                  <select
                    value={severityLevel}
                    onChange={(e) => setSeverityLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Mild">Mild (হালকা)</option>
                    <option value="Moderate">Moderate (মাঝারি)</option>
                    <option value="Severe">Severe (তীব্র)</option>
                  </select>
                </div>
              </div>

              {/* Additional Context */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'অতিরিক্ত কোনো সমস্যা (যেমন: ডায়াবেটিস, গর্ভবতী)' : 'Pre-existing Conditions / Notes'}
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'উচ্চ রক্তচাপ, ডায়াবেটিস বা এলার্জির ইতিহাস...' : 'Hypertension, Asthma, Pregnancy, etc.'}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isTriageLoading || !symptomsInput.trim()}
                className="w-full py-3 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isTriageLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'bn' ? 'এআই বিশ্লেষণ চলছে...' : 'Analyzing with Gemini...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'bn' ? 'লক্ষণ বিশ্লেষণ করুন' : 'Analyze Symptoms'}</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Results (7 cols) */}
          <div className="lg:col-span-7">
            {triageResult ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 animate-fadeIn">
                
                {/* Urgency Badge Header */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  triageResult.urgencyLevel === 'Emergency'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : triageResult.urgencyLevel === 'High'
                    ? 'bg-orange-50 border-orange-200 text-orange-900'
                    : triageResult.urgencyLevel === 'Moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      triageResult.urgencyLevel === 'Emergency' ? 'bg-rose-600' :
                      triageResult.urgencyLevel === 'High' ? 'bg-orange-600' :
                      triageResult.urgencyLevel === 'Moderate' ? 'bg-amber-600' : 'bg-emerald-600'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">Urgency Level / সতর্কতার মাত্রা</span>
                      <h4 className="text-lg font-black">{triageResult.urgencyLevel}</h4>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-white rounded-full shadow-2xs border">
                    {language === 'bn' ? 'এআই ট্রায়াজ সম্পন্ন' : 'AI Triage Complete'}
                  </span>
                </div>

                {/* Summary */}
                <div className="space-y-1 text-xs sm:text-sm">
                  <h4 className="font-bold text-slate-900">{language === 'bn' ? 'মূল্যায়ন সারসংক্ষেপ' : 'Clinical Summary'}</h4>
                  <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                    {language === 'bn' ? triageResult.assessmentSummaryBn : triageResult.assessmentSummaryEn}
                  </p>
                </div>

                {/* Probable Conditions */}
                {triageResult.possibleConditions && triageResult.possibleConditions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      {language === 'bn' ? 'সম্ভাব্য কারণ বা অবস্থা' : 'Possible Conditions'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {triageResult.possibleConditions.map((cond, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900">
                              {language === 'bn' ? cond.nameBn : cond.nameEn}
                            </strong>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                              {cond.probability} Match
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1">{cond.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Specialist with 1-Click Booking */}
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-teal-800 font-semibold block">{language === 'bn' ? 'পরামর্শযোগ্য বিশেষজ্ঞ চিকিৎসক:' : 'Recommended Specialist:'}</span>
                    <strong className="text-slate-900 text-sm">{triageResult.recommendedSpecialist}</strong>
                  </div>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ডাক্তার খুঁজুন ও বুক করুন' : 'Find Specialists'}</span>
                  </button>
                </div>

                {/* Immediate Home Care & Red Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'bn' ? 'প্রাথমিক করণীয়' : 'Immediate Home Care'}</span>
                    </h5>
                    <ul className="list-disc list-inside text-emerald-950 space-y-1 text-[11px] leading-relaxed">
                      {triageResult.immediateActions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
                    <h5 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>{language === 'bn' ? 'জরুরি বিপদচিহ্ন (Red Flags)' : 'Emergency Red Flags'}</span>
                    </h5>
                    <ul className="list-disc list-inside text-rose-950 space-y-1 text-[11px] leading-relaxed">
                      {triageResult.redFlagWarnings.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ⚠️ {triageResult.disclaimer}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                  <Bot className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">
                  {language === 'bn' ? 'লক্ষণ ট্রায়াজ ফলাফল এখানে প্রদর্শিত হবে' : 'Symptom Triage Results Will Appear Here'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  {language === 'bn'
                    ? 'বামপাশের ফর্মে আপনার স্বাস্থ্য লক্ষণসমূহ লিখে "লক্ষণ বিশ্লেষণ করুন" বাটনে চাপ দিন।'
                    : 'Fill in your symptoms on the left and submit to receive instant clinical triage.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
