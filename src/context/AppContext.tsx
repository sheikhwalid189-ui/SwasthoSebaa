import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, Appointment, Medicine, CartItem, BloodRequest, HealthVitalRecord } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doc: Doctor | null) => void;
  appointments: Appointment[];
  addAppointment: (apt: Appointment) => void;
  cancelAppointment: (id: string) => void;
  cart: CartItem[];
  addToCart: (med: Medicine) => void;
  removeFromCart: (medId: string) => void;
  updateCartQuantity: (medId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  bloodRequests: BloodRequest[];
  addBloodRequest: (req: BloodRequest) => void;
  vitalRecords: HealthVitalRecord[];
  addVitalRecord: (record: HealthVitalRecord) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isAppointmentsModalOpen: boolean;
  setIsAppointmentsModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  
  // Local appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('swastho_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: "APT-8821",
        doctorId: "doc-1",
        doctorName: "Prof. Dr. Syed Atiqul Haq",
        doctorSpecialty: "Rheumatology & Medicine",
        doctorDegree: "FCPS, FRCP (Edin), PhD",
        hospital: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
        patientName: "Rahim Uddin",
        patientPhone: "+880 1712-345678",
        patientAge: 45,
        patientGender: "Male",
        date: "2026-08-28",
        timeSlot: "06:30 PM",
        type: "Video Consultation (অনলাইন ভিডিও)",
        fee: 1500,
        status: "Confirmed",
        paymentStatus: "Paid (bKash)",
        tokenNumber: 14,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('swastho_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Blood Requests
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);

  // Health Vitals
  const [vitalRecords, setVitalRecords] = useState<HealthVitalRecord[]>(() => {
    const saved = localStorage.getItem('swastho_vitals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'vit-1',
        date: '2026-08-24',
        systolicBp: 122,
        diastolicBp: 80,
        pulseRate: 74,
        bloodSugar: 5.6,
        sugarType: 'Fasting',
        weightKg: 68,
        heightCm: 172,
        notes: 'Feeling energetic, morning walking completed.'
      },
      {
        id: 'vit-2',
        date: '2026-08-20',
        systolicBp: 128,
        diastolicBp: 84,
        pulseRate: 78,
        bloodSugar: 7.2,
        sugarType: '2h After Meal',
        weightKg: 68.5,
        heightCm: 172,
        notes: 'Post lunch measurement.'
      }
    ];
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('swastho_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('swastho_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('swastho_vitals', JSON.stringify(vitalRecords));
  }, [vitalRecords]);

  // Load blood requests from API if available
  useEffect(() => {
    fetch('/api/blood-requests')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setBloodRequests(data.data);
        }
      })
      .catch(e => console.log('Blood request load error:', e));
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAppointment = (apt: Appointment) => {
    setAppointments(prev => [apt, ...prev]);
    showToast(`Appointment booked with ${apt.doctorName} (Token: #${apt.tokenNumber || 'A-1'})`, 'success');
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    showToast('Appointment cancelled successfully', 'info');
  };

  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const exists = prev.find(item => item.medicine.id === med.id);
      if (exists) {
        return prev.map(item => item.medicine.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { medicine: med, quantity: 1 }];
    });
    showToast(`${med.brandName} added to cart`, 'success');
  };

  const removeFromCart = (medId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (medId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medId);
      return;
    }
    setCart(prev => prev.map(item => item.medicine.id === medId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  const addBloodRequest = (req: BloodRequest) => {
    setBloodRequests(prev => [req, ...prev]);
    showToast(`Emergency Blood Request posted for ${req.bloodGroup} at ${req.hospital}`, 'success');
  };

  const addVitalRecord = (record: HealthVitalRecord) => {
    setVitalRecords(prev => [record, ...prev]);
    showToast('Health vitals saved to your personal medical record vault', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        appointments,
        addAppointment,
        cancelAppointment,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        bloodRequests,
        addBloodRequest,
        vitalRecords,
        addVitalRecord,
        toasts,
        showToast,
        removeToast,
        isAppointmentsModalOpen,
        setIsAppointmentsModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
