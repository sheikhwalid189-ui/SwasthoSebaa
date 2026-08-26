export type Language = 'en' | 'bn';

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  specialty: string;
  specialtyBn: string;
  degrees: string;
  bmdcReg: string;
  experience: string;
  hospital: string;
  district: string;
  fee: number;
  followupFee: number;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  availableTime: string;
  avatar: string;
  languages: string[];
  chamberAddress: string;
  telemedicine: boolean;
  about: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorDegree: string;
  hospital: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  date: string;
  timeSlot: string;
  type: string;
  fee: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: string;
  paymentMethod?: string;
  problemDescription?: string;
  tokenNumber?: number;
  createdAt: string;
}

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  category: string;
  unit: string;
  price: number;
  prescriptionRequired: boolean;
  dosage: string;
  indications: string;
  inStock: boolean;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
  reason: string;
  urgency: string;
  status: string;
  postedAt: string;
}

export interface AmbulanceService {
  id: string;
  providerName: string;
  phone: string;
  hotline: string;
  vehicleTypes: string[];
  coverage: string;
  baseRate: string;
  rating: number;
  status: string;
}

export interface LabPackage {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  testsCount: number;
  originalPrice: number;
  discountedPrice: number;
  homeCollectionAvailable: boolean;
  reportTime: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: string;
}

export interface TriageCondition {
  nameBn: string;
  nameEn: string;
  probability: 'High' | 'Moderate' | 'Possible';
  explanation: string;
}

export interface SymptomTriageResult {
  urgencyLevel: 'Emergency' | 'High' | 'Moderate' | 'Mild / Self-Care';
  urgencyColor: 'red' | 'orange' | 'amber' | 'emerald';
  assessmentSummaryBn: string;
  assessmentSummaryEn: string;
  possibleConditions: TriageCondition[];
  recommendedSpecialist: string;
  immediateActions: string[];
  redFlagWarnings: string[];
  dietAndLifestyle: string[];
  disclaimer: string;
}

export interface PrescriptionAnalysisResult {
  doctorInfo: string;
  date: string;
  diagnosedConditions: string[];
  medications: {
    name: string;
    schedule: string;
    timing: string;
    duration: string;
    purpose: string;
    precautions: string;
  }[];
  suggestedTests: string[];
  dietaryAdvice: string[];
  importantNoteBn: string;
  importantNoteEn: string;
}

export interface HealthVitalRecord {
  id: string;
  date: string;
  systolicBp: number;
  diastolicBp: number;
  pulseRate: number;
  bloodSugar: number; // mmol/L
  sugarType: 'Fasting' | '2h After Meal' | 'Random';
  weightKg: number;
  heightCm: number;
  notes: string;
}
