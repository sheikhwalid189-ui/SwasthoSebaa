import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { DoctorDirectory } from './components/DoctorDirectory';
import { AiHealthAssistant } from './components/AiHealthAssistant';
import { PrescriptionVault } from './components/PrescriptionVault';
import { EPharmacy } from './components/EPharmacy';
import { AmbulanceServices } from './components/AmbulanceServices';
import { BloodDonorHub } from './components/BloodDonorHub';
import { DiagnosticLabTests } from './components/DiagnosticLabTests';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { AppointmentsListModal } from './components/AppointmentsListModal';
import { ToastContainer } from './components/ToastContainer';
import { EmergencyQuickBar } from './components/EmergencyQuickBar';
import { useApp } from './context/AppContext';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection onSearchQuery={(q) => setGlobalSearchQuery(q)} />
            <div className="border-t border-slate-200">
              <DoctorDirectory initialSearch={globalSearchQuery} />
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory initialSearch={globalSearchQuery} />
        )}

        {activeTab === 'ai-assistant' && (
          <AiHealthAssistant />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionVault />
        )}

        {activeTab === 'pharmacy' && (
          <EPharmacy />
        )}

        {activeTab === 'ambulance' && (
          <AmbulanceServices />
        )}

        {activeTab === 'blood' && (
          <BloodDonorHub />
        )}

        {activeTab === 'lab-tests' && (
          <DiagnosticLabTests />
        )}
      </main>

      {/* Modals & Overlays */}
      <BookAppointmentModal />
      <AppointmentsListModal />
      <EmergencyQuickBar />
      <ToastContainer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
