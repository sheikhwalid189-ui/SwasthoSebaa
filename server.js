import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing (supporting base64 images for prescriptions)
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Initial mock database store (persists in-memory during server lifecycle)
let appointments = [
  {
    id: "APT-8821",
    doctorName: "Prof. Dr. Syed Atiqul Haq",
    doctorSpecialty: "Rheumatology & Medicine",
    doctorDegree: "FCPS, FRCP (Edin), PhD",
    hospital: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
    patientName: "Rahim Uddin",
    patientPhone: "+880 1712-345678",
    patientAge: 45,
    patientGender: "Male",
    date: "2026-08-28",
    timeSlot: "10:30 AM",
    type: "Video Consultation (অনলাইন ভিডিও)",
    fee: 1500,
    status: "Confirmed",
    paymentStatus: "Paid (bKash)",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-9104",
    doctorName: "Dr. Farzana Yasmin",
    doctorSpecialty: "Pediatrics & Child Health",
    doctorDegree: "MBBS, DCH, MD (Pediatrics)",
    hospital: "Dhaka Shishu (Children) Hospital",
    patientName: "Ayman Khan (Child)",
    patientPhone: "+880 1819-987654",
    patientAge: 4,
    patientGender: "Male",
    date: "2026-08-29",
    timeSlot: "04:00 PM",
    type: "In-Chamber (চেম্বারে সাক্ষাৎ)",
    fee: 1000,
    status: "Confirmed",
    paymentStatus: "Pay at Chamber",
    createdAt: new Date().toISOString()
  }
];

let bloodRequests = [
  {
    id: "BLD-301",
    patientName: "Salma Begum",
    bloodGroup: "O+",
    unitsNeeded: 2,
    hospital: "Dhaka Medical College Hospital (DMCH)",
    district: "Dhaka",
    contactPerson: "Kamal Hossain",
    contactPhone: "+880 1711-223344",
    reason: "Cesarean Delivery Emergency",
    urgency: "Immediate (জরুরি)",
    status: "Active",
    postedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "BLD-302",
    patientName: "Tanvir Ahmed",
    bloodGroup: "B-",
    unitsNeeded: 1,
    hospital: "Square Hospital, Panthapath",
    district: "Dhaka",
    contactPerson: "Arif Ahmed",
    contactPhone: "+880 1912-556677",
    reason: "Thalassemia Transfusion",
    urgency: "Within 6 hours",
    status: "Active",
    postedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "BLD-303",
    patientName: "Monirul Islam",
    bloodGroup: "AB+",
    unitsNeeded: 2,
    hospital: "Chittagong Medical College Hospital",
    district: "Chittagong",
    contactPerson: "Shohel Rana",
    contactPhone: "+880 1814-332211",
    reason: "Road Accident Surgery",
    urgency: "Immediate (জরুরি)",
    status: "Active",
    postedAt: new Date(Date.now() - 10800000).toISOString()
  }
];

// Sample Verified Doctors Directory (Bangladesh Standard)
const doctors = [
  {
    id: "doc-1",
    name: "Prof. Dr. Syed Atiqul Haq",
    nameBn: "অধ্যাপক ডাঃ সৈয়দ আতিকুল হক",
    specialty: "Rheumatology & General Medicine",
    specialtyBn: "বাতজ্বর, বাতব্যাধি ও মেডিসিন বিশেষজ্ঞ",
    degrees: "MBBS, FCPS (Medicine), FRCP (Edin), PhD",
    bmdcReg: "BMDC-A-14280",
    experience: "32+ Years Experience",
    hospital: "BSMMU (PG Hospital) & Green Life Medical College",
    district: "Dhaka",
    fee: 1500,
    followupFee: 1000,
    rating: 4.9,
    reviewsCount: 340,
    availableDays: ["Saturday", "Sunday", "Tuesday", "Thursday"],
    availableTime: "05:00 PM - 09:00 PM",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Green Life Hospital, 32 Green Road, Dhanmondi, Dhaka",
    telemedicine: true,
    about: "Former President of Asia Pacific League of Associations for Rheumatology (APLAR) and leading clinical rheumatologist in South Asia."
  },
  {
    id: "doc-2",
    name: "Dr. Farzana Yasmin",
    nameBn: "ডাঃ ফারজানা ইয়াসমিন",
    specialty: "Pediatrics & Child Health",
    specialtyBn: "শিশু ও কিশোর রোগ বিশেষজ্ঞ",
    degrees: "MBBS, DCH, MD (Pediatrics), FCPS (Part-2)",
    bmdcReg: "BMDC-A-32910",
    experience: "14+ Years Experience",
    hospital: "Dhaka Shishu (Children) Hospital",
    district: "Dhaka",
    fee: 1000,
    followupFee: 700,
    rating: 4.8,
    reviewsCount: 215,
    availableDays: ["Monday", "Wednesday", "Friday", "Sunday"],
    availableTime: "04:00 PM - 08:30 PM",
    avatar: "https://images.unsplash.com/photo-1594824813590-781423853177?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Popular Diagnostic Center, Shantinagar Branch, Dhaka",
    telemedicine: true,
    about: "Specialized in newborn care, childhood infectious diseases, asthma, vaccination guidance and child nutrition."
  },
  {
    id: "doc-3",
    name: "Dr. Mohammad Shafiul Alam",
    nameBn: "ডাঃ মোহাম্মদ শফিউল আলম",
    specialty: "Cardiology & Heart Specialist",
    specialtyBn: "হৃদরোগ ও রক্তচাপ বিশেষজ্ঞ",
    degrees: "MBBS, D-Card (DU), MD (Cardiology), FACC (USA)",
    bmdcReg: "BMDC-A-21845",
    experience: "19+ Years Experience",
    hospital: "National Institute of Cardiovascular Diseases (NICVD)",
    district: "Dhaka",
    fee: 1200,
    followupFee: 800,
    rating: 4.9,
    reviewsCount: 420,
    availableDays: ["Saturday", "Monday", "Wednesday"],
    availableTime: "06:00 PM - 10:00 PM",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Ibn Sina Diagnostic Center, Dhanmondi, Dhaka",
    telemedicine: true,
    about: "Expert in interventional cardiology, coronary angiogram, heart failure management, and hypertension control."
  },
  {
    id: "doc-4",
    name: "Dr. Nusrat Jahan",
    nameBn: "ডাঃ নুসরাত জাহান",
    specialty: "Gynecology & Obstetrics",
    specialtyBn: "স্ত্রীরোগ ও প্রসূতি বিশেষজ্ঞ ও সার্জন",
    degrees: "MBBS, FCPS (OBGYN), MS (Gynae), Fellowship in Laparoscopy",
    bmdcReg: "BMDC-A-28419",
    experience: "16+ Years Experience",
    hospital: "Sir Salimullah Medical College & Mitford Hospital",
    district: "Dhaka",
    fee: 1200,
    followupFee: 800,
    rating: 4.9,
    reviewsCount: 310,
    availableDays: ["Sunday", "Tuesday", "Thursday"],
    availableTime: "05:00 PM - 09:00 PM",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Labaid Specialized Hospital, Mirpur 2, Dhaka",
    telemedicine: true,
    about: "Expert in high-risk pregnancy care, infertility treatment, laparoscopic gynecological surgery, and women's wellness."
  },
  {
    id: "doc-5",
    name: "Prof. Dr. M. A. Jalil",
    nameBn: "অধ্যাপক ডাঃ এম. এ. জলিল",
    specialty: "Neurology & Brain Specialist",
    specialtyBn: "স্নায়ুরোগ ও ব্রেন বিশেষজ্ঞ",
    degrees: "MBBS, FCPS, MD (Neurology), Fellow World Stroke Org",
    bmdcReg: "BMDC-A-16782",
    experience: "25+ Years Experience",
    hospital: "National Institute of Neurosciences & Hospital (NINS)",
    district: "Dhaka",
    fee: 1500,
    followupFee: 1000,
    rating: 4.8,
    reviewsCount: 280,
    availableDays: ["Saturday", "Monday", "Wednesday", "Thursday"],
    availableTime: "04:30 PM - 08:30 PM",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Medinova Medical Services, Dhanmondi, Dhaka",
    telemedicine: true,
    about: "Leading neurologist with expertise in stroke rehabilitation, epilepsy, Parkinson's disease, neuropathy, and migraine."
  },
  {
    id: "doc-6",
    name: "Dr. Tanvir Rahman",
    nameBn: "ডাঃ তানভীর রহমান",
    specialty: "Orthopedics & Spine Surgeon",
    specialtyBn: "হাড়, জোড়া, বাত ও স্পাইন সার্জন",
    degrees: "MBBS, MS (Orthopedics), AO Spine Fellow",
    bmdcReg: "BMDC-A-35120",
    experience: "13+ Years Experience",
    hospital: "National Institute of Traumatology and Orthopaedic Rehabilitation (NITOR / Pangu Hospital)",
    district: "Dhaka",
    fee: 1000,
    followupFee: 600,
    rating: 4.7,
    reviewsCount: 195,
    availableDays: ["Sunday", "Tuesday", "Friday"],
    availableTime: "05:30 PM - 09:30 PM",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Anwer Khan Modern Medical College Hospital, Dhanmondi",
    telemedicine: true,
    about: "Expert in knee and hip joint replacements, sports injury arthroscopy, spine disc prolapse, and fracture reconstruction."
  },
  {
    id: "doc-7",
    name: "Dr. Anika Chowdhury",
    nameBn: "ডাঃ অনিকা চৌধুরী",
    specialty: "Dermatology & Cosmetology",
    specialtyBn: "চর্ম, এলার্জি ও যৌনরোগ বিশেষজ্ঞ",
    degrees: "MBBS, DDV, MD (Dermatology)",
    bmdcReg: "BMDC-A-41098",
    experience: "10+ Years Experience",
    hospital: "Chittagong Medical College Hospital",
    district: "Chittagong",
    fee: 900,
    followupFee: 600,
    rating: 4.8,
    reviewsCount: 175,
    availableDays: ["Saturday", "Sunday", "Tuesday", "Wednesday"],
    availableTime: "04:00 PM - 08:00 PM",
    avatar: "https://images.unsplash.com/photo-1594824813603-ee838882894b?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "Epic Health Care, Panchlaish, Chittagong",
    telemedicine: true,
    about: "Specializing in severe acne, psoriasis, chronic eczema, fungal infections, hair loss treatment and laser aesthetic dermatology."
  },
  {
    id: "doc-8",
    name: "Dr. Kazi Mahfuzur Rahman",
    nameBn: "ডাঃ কাজী মাহফুজুর রহমান",
    specialty: "Endocrinology & Diabetes",
    specialtyBn: "ডায়াবেটিস, থাইরয়েড ও হরমোন বিশেষজ্ঞ",
    degrees: "MBBS, DEM (BIRDEM), MD (Endocrinology), FACE (USA)",
    bmdcReg: "BMDC-A-24311",
    experience: "17+ Years Experience",
    hospital: "BIRDEM General Hospital",
    district: "Dhaka",
    fee: 1200,
    followupFee: 800,
    rating: 4.9,
    reviewsCount: 380,
    availableDays: ["Saturday", "Monday", "Wednesday", "Thursday"],
    availableTime: "05:00 PM - 09:30 PM",
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&auto=format&fit=crop&q=80",
    languages: ["Bangla", "English"],
    chamberAddress: "BIRDEM-2, Segunbagicha, Dhaka",
    telemedicine: true,
    about: "Pioneer in modern diabetes management, diabetic foot prevention, thyroid nodules, obesity management, and hormonal imbalance."
  }
];

// Medicines List for E-Pharmacy
const medicines = [
  {
    id: "med-1",
    brandName: "Napa Extra 500mg/65mg",
    genericName: "Paracetamol + Caffeine",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    category: "Pain Relief & Fever",
    unit: "Strip of 10 Tablets",
    price: 30,
    prescriptionRequired: false,
    dosage: "1-2 tablets every 4-6 hours (Max 8 tablets/24 hours)",
    indications: "Fever, headache, migraine, toothache, muscle aches, back pain.",
    inStock: true
  },
  {
    id: "med-2",
    brandName: "Sergel 20mg",
    genericName: "Esomeprazole Magnesium Trihydrate",
    manufacturer: "Healthcare Pharmaceuticals Ltd.",
    category: "Gastric & Acidity",
    unit: "Strip of 10 Capsules",
    price: 70,
    prescriptionRequired: false,
    dosage: "1 capsule once daily 30 minutes before meal in the morning",
    indications: "GERD, acid reflux, peptic ulcer disease, heartburn relief.",
    inStock: true
  },
  {
    id: "med-3",
    brandName: "Monas 10mg",
    genericName: "Montelukast Sodium",
    manufacturer: "Acme Laboratories Ltd.",
    category: "Asthma & Allergy",
    unit: "Strip of 10 Tablets",
    price: 160,
    prescriptionRequired: true,
    dosage: "1 tablet once daily in the evening before sleeping",
    indications: "Chronic asthma maintenance, seasonal allergic rhinitis, allergy cough.",
    inStock: true
  },
  {
    id: "med-4",
    brandName: "Fexo 120mg",
    genericName: "Fexofenadine Hydrochloride",
    manufacturer: "Square Pharmaceuticals Ltd.",
    category: "Antihistamine / Allergy",
    unit: "Strip of 10 Tablets",
    price: 90,
    prescriptionRequired: false,
    dosage: "1 tablet once daily with water",
    indications: "Sneezing, runny nose, allergic skin rash, itching, hives.",
    inStock: true
  },
  {
    id: "med-5",
    brandName: "Azithrocin 500mg",
    genericName: "Azithromycin",
    manufacturer: "Incepta Pharmaceuticals Ltd.",
    category: "Antibiotic",
    unit: "Strip of 3 Tablets",
    price: 105,
    prescriptionRequired: true,
    dosage: "1 tablet daily for 3 to 5 days as prescribed by doctor",
    indications: "Respiratory tract infections, throat infection, bronchitis, sinusitis.",
    inStock: true
  },
  {
    id: "med-6",
    brandName: "Compath 5/20",
    genericName: "Amlodipine + Olmesartan",
    manufacturer: "Renata Limited",
    category: "Cardiovascular / Blood Pressure",
    unit: "Strip of 10 Tablets",
    price: 140,
    prescriptionRequired: true,
    dosage: "1 tablet once daily morning or evening regularly",
    indications: "Essential hypertension, blood pressure control.",
    inStock: true
  },
  {
    id: "med-7",
    brandName: "ORSaline-N Oral Saline",
    genericName: "Oral Rehydration Salts (ORS)",
    manufacturer: "SMC (Social Marketing Company)",
    category: "Hydration & Electrolytes",
    unit: "Pack of 5 Sachets",
    price: 35,
    prescriptionRequired: false,
    dosage: "Dissolve 1 sachet in 500ml clean drinking water; drink after each loose motion",
    indications: "Dehydration from diarrhea, vomiting, excessive sweating, heat exhaustion.",
    inStock: true
  },
  {
    id: "med-8",
    brandName: "Comet 500mg",
    genericName: "Metformin Hydrochloride",
    manufacturer: "Square Pharmaceuticals Ltd.",
    category: "Diabetes Care",
    unit: "Strip of 10 Tablets",
    price: 45,
    prescriptionRequired: true,
    dosage: "1 tablet twice daily with or immediately after meals",
    indications: "Type 2 Diabetes Mellitus glycemic management.",
    inStock: true
  }
];

// Emergency Ambulance Providers Directory
const ambulanceServices = [
  {
    id: "amb-1",
    providerName: "Alif Ambulance Service (Dhaka Metro)",
    phone: "+880 1713-205555",
    hotline: "01713-205555",
    vehicleTypes: ["ICU Ambulance with Ventilator", "AC Ambulance", "Non-AC Standard", "Freezer Van"],
    coverage: "All Dhaka Metro & Nationwide Interstate Dispatch",
    baseRate: "৳ 1,500 - ৳ 4,000 (Inside Dhaka)",
    rating: 4.9,
    status: "24/7 Available"
  },
  {
    id: "amb-2",
    providerName: "Anjuman Mufidul Islam Emergency Dispatch",
    phone: "+880 2-9336611",
    hotline: "02-9336611 / 01711-547085",
    vehicleTypes: ["Standard AC Ambulance", "Freezer Van", "Subsidized Community Carrier"],
    coverage: "Dhaka, Chittagong, Sylhet & Major Hubs",
    baseRate: "Non-profit / Highly Subsidized (৳ 800 - ৳ 2,000)",
    rating: 4.8,
    status: "24/7 Available"
  },
  {
    id: "amb-3",
    providerName: "Red Crescent Emergency Ambulance",
    phone: "16263",
    hotline: "16263 / 02-9352226",
    vehicleTypes: ["Emergency Response", "ICU Support"],
    coverage: "64 Districts of Bangladesh",
    baseRate: "Official Standard Govt/Charity Tariff",
    rating: 4.9,
    status: "24/7 Available"
  },
  {
    id: "amb-4",
    providerName: "Square Hospital Emergency Dispatch Fleet",
    phone: "10616",
    hotline: "10616 / 01713-066066",
    vehicleTypes: ["Advanced Cardiac ICU Life Support", "Neonatal Pediatric ICU", "Helicopter Air Ambulance"],
    coverage: "Panthapath Base & Nationwide Critical Transfer",
    baseRate: "Hospital Tier Tariff",
    rating: 5.0,
    status: "24/7 Available"
  }
];

// Diagnostic Lab Test Packages
const labTestPackages = [
  {
    id: "lab-1",
    name: "Full Body Master Health Checkup",
    nameBn: "সম্পূর্ণ শরীর মাস্টার হেলথ চেকআপ",
    description: "Includes CBC, Fasting Blood Sugar, HbA1c, Lipid Profile, Liver Function (SGPT/SGOT), Kidney Function (Serum Creatinine), Urine R/M/E, ECG.",
    testsCount: 28,
    originalPrice: 4500,
    discountedPrice: 2999,
    homeCollectionAvailable: true,
    reportTime: "Same Day (12-18 Hours)",
    badge: "Most Popular"
  },
  {
    id: "lab-2",
    name: "Comprehensive Diabetic & Renal Profile",
    nameBn: "ডায়াবেটিস ও কিডনি পরীক্ষা প্যাকেজ",
    description: "Fasting Blood Sugar, 2 Hours Post-Prandial, HbA1c, Serum Creatinine, eGFR, Blood Urea, Microalbumin, Lipid Profile.",
    testsCount: 14,
    originalPrice: 2800,
    discountedPrice: 1850,
    homeCollectionAvailable: true,
    reportTime: "12 Hours",
    badge: "Senior Friendly"
  },
  {
    id: "lab-3",
    name: "Dengue & Acute Fever Panel",
    nameBn: "ডেঙ্গু ও তীব্র জ্বর পরীক্ষা প্যানেল",
    description: "Dengue NS1 Antigen, Dengue IgG/IgM, CBC with Platelet Count & Haematocrit, MP (Malaria), Urine R/M/E.",
    testsCount: 8,
    originalPrice: 1600,
    discountedPrice: 1100,
    homeCollectionAvailable: true,
    reportTime: "4 - 6 Hours (Fast Track)",
    badge: "Emergency Fast Track"
  },
  {
    id: "lab-4",
    name: "Cardiac Health & Lipid Screen",
    nameBn: "হৃদযন্ত্র ও কোলেস্টেরল পরীক্ষা",
    description: "Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides), hs-CRP, Serum Electrolytes, Blood Pressure & 12-Lead ECG.",
    testsCount: 10,
    originalPrice: 2500,
    discountedPrice: 1650,
    homeCollectionAvailable: true,
    reportTime: "Same Day",
    badge: "Preventive Care"
  }
];

// Helper: Setup Gemini Client safely
function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Use recommended preview model
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Server status & capability
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SwasthoSeba API Backend',
    version: '1.0.0',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5),
    timestamp: new Date().toISOString()
  });
});

// 1. Doctors List & Filter
app.get('/api/doctors', (req, res) => {
  const { specialty, district, search, telemedicine } = req.query;
  let result = [...doctors];

  if (specialty && specialty !== 'All') {
    result = result.filter(d => 
      d.specialty.toLowerCase().includes(String(specialty).toLowerCase()) ||
      d.specialtyBn.includes(String(specialty))
    );
  }

  if (district && district !== 'All') {
    result = result.filter(d => d.district.toLowerCase() === String(district).toLowerCase());
  }

  if (telemedicine === 'true') {
    result = result.filter(d => d.telemedicine === true);
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.nameBn.includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.specialtyBn.includes(q) ||
      d.hospital.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// 2. Appointments CRUD
app.get('/api/appointments', (req, res) => {
  const { phone } = req.query;
  let list = [...appointments];
  if (phone) {
    list = list.filter(a => a.patientPhone.includes(String(phone)));
  }
  res.json({ success: true, count: list.length, data: list.reverse() });
});

app.post('/api/appointments', (req, res) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorDegree,
      hospital,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      date,
      timeSlot,
      type,
      fee,
      paymentMethod,
      problemDescription
    } = req.body;

    if (!patientName || !patientPhone || !date || !timeSlot) {
      return res.status(400).json({ success: false, error: 'Patient name, phone, date and time slot are required.' });
    }

    const newAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorId: doctorId || "doc-general",
      doctorName: doctorName || "Specialist Doctor",
      doctorSpecialty: doctorSpecialty || "General Medicine",
      doctorDegree: doctorDegree || "MBBS, FCPS",
      hospital: hospital || "SwasthoSeba Telemedicine Chamber",
      patientName,
      patientPhone,
      patientAge: Number(patientAge) || 30,
      patientGender: patientGender || "Other",
      date,
      timeSlot,
      type: type || "Video Consultation (অনলাইন ভিডিও)",
      fee: Number(fee) || 1000,
      status: "Confirmed",
      paymentStatus: paymentMethod === 'pay_chamber' ? 'Pay at Chamber' : `Paid (${paymentMethod || 'bKash'})`,
      paymentMethod: paymentMethod || 'bKash',
      problemDescription: problemDescription || '',
      tokenNumber: Math.floor(1 + Math.random() * 25),
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully / অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত করা হয়েছে',
      data: newAppointment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Medicines List & Search
app.get('/api/medicines', (req, res) => {
  const { query, category } = req.query;
  let list = [...medicines];

  if (category && category !== 'All') {
    list = list.filter(m => m.category.toLowerCase().includes(String(category).toLowerCase()));
  }

  if (query) {
    const q = String(query).toLowerCase();
    list = list.filter(m => 
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: list.length, data: list });
});

// 4. Ambulance Directory
app.get('/api/ambulance', (req, res) => {
  res.json({ success: true, data: ambulanceServices });
});

// 5. Blood Donors & Urgent Requests
app.get('/api/blood-requests', (req, res) => {
  const { bloodGroup, district } = req.query;
  let list = [...bloodRequests];

  if (bloodGroup && bloodGroup !== 'All') {
    list = list.filter(b => b.bloodGroup.toUpperCase() === String(bloodGroup).toUpperCase());
  }

  if (district && district !== 'All') {
    list = list.filter(b => b.district.toLowerCase() === String(district).toLowerCase());
  }

  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/blood-requests', (req, res) => {
  const { patientName, bloodGroup, unitsNeeded, hospital, district, contactPerson, contactPhone, reason, urgency } = req.body;
  if (!patientName || !bloodGroup || !contactPhone || !hospital) {
    return res.status(400).json({ success: false, error: 'Patient name, blood group, hospital and phone are required.' });
  }

  const newRequest = {
    id: `BLD-${Math.floor(100 + Math.random() * 900)}`,
    patientName,
    bloodGroup: bloodGroup.toUpperCase(),
    unitsNeeded: Number(unitsNeeded) || 1,
    hospital,
    district: district || "Dhaka",
    contactPerson: contactPerson || patientName,
    contactPhone,
    reason: reason || "Emergency transfusion",
    urgency: urgency || "Immediate (জরুরি)",
    status: "Active",
    postedAt: new Date().toISOString()
  };

  bloodRequests.unshift(newRequest);
  res.status(201).json({ success: true, message: 'Blood emergency request broadcasted successfully', data: newRequest });
});

// 6. Diagnostic Lab Packages
app.get('/api/lab-packages', (req, res) => {
  res.json({ success: true, data: labTestPackages });
});

// ----------------------------------------------------
// SERVER-SIDE GEMINI AI ENDPOINTS
// ----------------------------------------------------

// 7. AI Health Consultation & Assistant Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'both' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    const systemInstruction = `You are "SwasthoSeba AI" (স্বাস্থ্যসেবা এআই সহকারী), a compassionate, expert, and clinically sound digital health assistant for Bangladesh and global patients.
Primary Goals:
1. Provide accurate, supportive health advice, triage guidance, home-care recommendations, diet tips, and explanation of medical conditions.
2. Communicate fluently in both Bengali (বাংলা) and English (or matching the patient's language preference). When the user asks in Bengali or mixed Banglish, provide rich, helpful Bengali responses with medical terms explained clearly.
3. ALWAYS emphasize that you are an AI assistant and that in emergency cases (chest pain, severe shortness of breath, sudden paralysis, unconsciousness, heavy bleeding), the patient must immediately call 999 or 16263, or visit the nearest emergency hospital chamber.
4. When relevant, suggest appropriate medical specialties in Bangladesh (e.g. মেডিসিন, হৃদরোগ বিশেষজ্ঞ, শিশু বিশেষজ্ঞ, স্ত্রীরোগ বিশেষজ্ঞ) and recommend booking a doctor on SwasthoSeba.
5. Maintain a warm, empathetic, and respectful tone. Format responses with clean bullet points and clear sections.`;

    const model = getGeminiModel();

    if (model) {
      // Build conversation context
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemInstruction }]
          },
          {
            role: "model",
            parts: [{ text: "নমস্কার/আসসালামু আলাইকুম। আমি স্বাস্থ্যসেবা (SwasthoSeba) AI স্বাস্থ্য সহকারী। আপনার স্বাস্থ্য বিষয়ক যেকোনো প্রশ্ন, ঔষধের নিয়ম বা প্রাথমিক পরামর্শের জন্য আমি আপনাকে সাহায্য করতে প্রস্তুত।" }]
          },
          ...conversationHistory.map(item => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }]
          }))
        ]
      });

      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      return res.json({
        success: true,
        reply,
        source: 'gemini-model',
        timestamp: new Date().toISOString()
      });
    }

    // Fallback if API key is not configured yet
    const fallbackResponse = generateSmartHealthFallback(message, language);
    return res.json({
      success: true,
      reply: fallbackResponse,
      source: 'smart-clinical-heuristics',
      timestamp: new Date().toISOString(),
      note: 'To activate full live Gemini 2.5 Flash, ensure GEMINI_API_KEY is configured in AI Studio Secrets.'
    });

  } catch (err) {
    console.error('Gemini Chat Error:', err);
    // Graceful fallback on network or API failure
    const fallback = generateSmartHealthFallback(req.body.message || '', req.body.language || 'both');
    res.json({
      success: true,
      reply: fallback,
      source: 'fallback-on-error',
      errorDetails: err.message
    });
  }
});

// 8. AI Symptom Checker & Structured Triage
app.post('/api/gemini/symptom-checker', async (req, res) => {
  try {
    const { symptoms, age, gender, duration, severity, additionalNotes, language = 'both' } = req.body;

    if (!symptoms) {
      return res.status(400).json({ success: false, error: 'Symptoms description is required.' });
    }

    const prompt = `Perform a comprehensive medical symptom assessment for the following patient profile:
Patient Details:
- Symptoms: ${symptoms}
- Age: ${age || 'Not specified'} years
- Gender: ${gender || 'Not specified'}
- Duration: ${duration || 'Recent'}
- Reported Severity: ${severity || 'Moderate'}
- Extra Notes: ${additionalNotes || 'None'}

Please return a valid JSON object with the exact keys:
{
  "urgencyLevel": "Emergency" | "High" | "Moderate" | "Mild / Self-Care",
  "urgencyColor": "red" | "orange" | "amber" | "emerald",
  "assessmentSummaryBn": "সংক্ষিপ্ত বাংলা মূল্যায়ন",
  "assessmentSummaryEn": "Brief English assessment summary",
  "possibleConditions": [
    { "nameBn": "রোগ বা কারণের নাম (বাংলা)", "nameEn": "Condition name in English", "probability": "High" | "Moderate" | "Possible", "explanation": "Why this matches symptoms" }
  ],
  "recommendedSpecialist": "e.g. General Medicine / Cardiologist / Pediatrician / ডায়াবেটিস বিশেষজ্ঞ",
  "immediateActions": [
    "Step 1 home care / immediate precaution",
    "Step 2"
  ],
  "redFlagWarnings": [
    "Warning symptom 1 requiring instant emergency room visit"
  ],
  "dietAndLifestyle": [
    "Helpful nutrition or hydration tip"
  ],
  "disclaimer": "This AI assessment is for guidance only and does not replace in-person diagnosis by a BMDC registered physician."
}

Return ONLY raw JSON, with no markdown code blocks if possible.`;

    const model = getGeminiModel();

    if (model) {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const responseText = result.response.text();
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed, source: 'gemini-model' });
      } catch (e) {
        // In case of parsing mismatch, sanitize string
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({ success: true, data: parsed, source: 'gemini-model' });
      }
    }

    // Heuristic structured triage generator
    const heuristicTriage = generateHeuristicTriage(symptoms, age, severity, duration);
    return res.json({ success: true, data: heuristicTriage, source: 'clinical-heuristics' });

  } catch (err) {
    console.error('Symptom Checker Error:', err);
    const fallbackTriage = generateHeuristicTriage(req.body.symptoms || '', req.body.age, req.body.severity, req.body.duration);
    res.json({ success: true, data: fallbackTriage, source: 'fallback' });
  }
});

// 9. AI Prescription & Medical Report Analyzer
app.post('/api/gemini/analyze-prescription', async (req, res) => {
  try {
    const { imageBase64, textContent, language = 'both' } = req.body;

    if (!imageBase64 && !textContent) {
      return res.status(400).json({ success: false, error: 'Either prescription image (base64) or text is required.' });
    }

    const model = getGeminiModel();

    const analysisPrompt = `You are a clinical pharmacologist and prescription verification expert.
Analyze this medical prescription or test report thoroughly.
Extract and summarize:
1. Doctor / Clinic name (if visible)
2. Prescribed Medications with:
   - Brand & Generic name
   - Dosage (e.g. 500mg, 20mg)
   - Schedule/Frequency (e.g. 1+0+1, after food, morning empty stomach)
   - Duration (e.g. 5 days, 1 month, regular)
   - Primary Indication/Purpose (what it treats)
   - Common Precautions or interactions
3. Suggested Lab Tests or follow-up instructions.
4. Patient dietary/lifestyle advice in Bangla & English.

Return a valid JSON object matching:
{
  "doctorInfo": "Doctor Name, Specialty, Chamber (if found)",
  "date": "Prescription date if visible",
  "diagnosedConditions": ["Condition 1", "Condition 2"],
  "medications": [
    {
      "name": "Napa Extra 500mg",
      "schedule": "1+0+1 (সকাল ও রাত)",
      "timing": "After meal / খাবারের পর",
      "duration": "3 days",
      "purpose": "জ্বর ও মাথাব্যথা নিরাময় (Fever & Pain relief)",
      "precautions": "Do not exceed 8 tablets daily. Avoid alcohol."
    }
  ],
  "suggestedTests": ["CBC with Platelets", "Fasting Blood Sugar"],
  "dietaryAdvice": ["Drink plenty of oral fluids and coconut water", "Avoid oily and spicy foods"],
  "importantNoteBn": "ঔষধ গ্রহণের পূর্বে অবশ্যই চিকিৎসকের পরামর্শ যাচাই করুন এবং মেয়াদোত্তীর্ণের তারিখ পরীক্ষা করুন।",
  "importantNoteEn": "Always follow your doctor's exact instructions. Set reminders to take medicines on time."
}`;

    if (model) {
      let contentParts = [];

      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contentParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      contentParts.push({
        text: `${analysisPrompt}\n\nAdditional Patient Notes/Text:\n${textContent || 'None provided'}`
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: contentParts }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({ success: true, data: parsed, source: 'gemini-multimodal' });
    }

    // Heuristic prescription response
    const mockPrescriptionAnalysis = {
      doctorInfo: "Dr. Farzana Yasmin, MBBS, DCH, MD (Child Health & Pediatrics)",
      date: new Date().toLocaleDateString('en-GB'),
      diagnosedConditions: ["Acute Upper Respiratory Tract Infection (সর্দি-কাশি ও জ্বর)", "Mild Dehydration"],
      medications: [
        {
          name: "Napa Syrup (Paracetamol 120mg/5ml)",
          schedule: "১ চা চামচ করে দিনে ৩ বার (1 tsp x 3 times)",
          timing: "খাবারের পর (After food)",
          duration: "৩ দিন (3 days)",
          purpose: "জ্বর ও গা ব্যথা কমানোর জন্য",
          precautions: "জ্বর ১০০°F এর নিচে নামলে বন্ধ করা যেতে পারে।"
        },
        {
          name: "Monas 4mg Chewable (Montelukast)",
          schedule: "১ টি করে রাতে (1 tab nightly)",
          timing: "ঘুমানোর পূর্বে (Before bed)",
          duration: "১৪ দিন (14 days)",
          purpose: "কাশি ও শ্বাসকষ্ট প্রতিরোধে",
          precautions: "চিবিয়ে খেতে হবে।"
        },
        {
          name: "ORSaline-N",
          schedule: "প্রয়োজনমতো (As needed)",
          timing: "দিনে ২-৩ প্যাকেট আধা লিটার পানিতে গুলিয়ে",
          duration: "২ দিন",
          purpose: "শরীরের পানিশূন্যতা ও লবণ পূরণ",
          precautions: "ঠান্ডা পরিষ্কার পানিতে গুলাতে হবে, গরম পানিতে নয়।"
        }
      ],
      suggestedTests: ["Complete Blood Count (CBC) with ESR", "Urine R/M/E"],
      dietaryAdvice: [
        "প্রচুর কুসুম গরম পানি, আদা চা ও তুলসী পাতার রস পান করুন।",
        "সহজপাচ্য পুষ্টিকর খাবার যেমন পাতলা খিচুড়ি, সুপ এবং ডিম খেতে দিন।",
        "ধূমপান ও অতিরিক্ত ধুলোবালি এড়িয়ে চলুন।"
      ],
      importantNoteBn: "এটি একটি নমুনা ডিজিটাল প্রেসক্রিপশন বিশ্লেষণ। নতুন ঔষধ শুরু করার আগে আপনার রেজিস্টার্ড চিকিৎসকের সাথে পরামর্শ নিশ্চিত করুন।",
      importantNoteEn: "AI Prescription interpretation is for informational assistance. Always verify with your dispensing pharmacist or treating doctor."
    };

    return res.json({ success: true, data: mockPrescriptionAnalysis, source: 'clinical-heuristics' });

  } catch (err) {
    console.error('Prescription Analysis Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// CLINICAL HEURISTIC FALLBACKS (Ensure 100% Reliability)
// ----------------------------------------------------
function generateSmartHealthFallback(query, language) {
  const q = query.toLowerCase();

  if (q.includes('fever') || q.includes('জ্বর') || q.includes('gaye jor')) {
    return `### 🌡️ জ্বর ও শরীরের তাপমাত্রা নিয়ন্ত্রণ নির্দেশিকা (Fever Care Guide)

**সাধারণ পর্যবেক্ষণ:**
- থার্মোমিটার দিয়ে নিয়মিত তাপমাত্রা পরিমাপ করুন (যদি ১০২°F এর বেশি হয়, সতর্কতা প্রয়োজন)।
- সাধারণ জ্বরে প্যারাসিটামল (যেমন: Napa বা Ace ৫০০mg) চিকিৎসকের নির্দেশিত ডোজে খাবারের পর গ্রহণ করা যেতে পারে।
- পুরো শরীর স্বাভাবিক তাপমাত্রার পানি দিয়ে স্পঞ্জ বা মুছে দিন (কখনোই বরফ পানি ব্যবহার করবেন না)।

**করণীয়:**
1. প্রচুর তরল খাবার (ওরস্যালাইন, ডাবের পানি, লেবুর শরবত ও স্যুপ) পান করুন।
2. বিশ্রাম নিন ও আরামদায়ক সুতি পোশাক পরুন।
3. যদি ৩ দিনের বেশি জ্বর স্থায়ী হয় বা সাথে তীব্র মাথাব্যথা, বমি, অথবা শরীরে লাল র‍্যাশ দেখা দেয়, তবে অবিলম্বে ডেঙ্গু/সিবিসি টেস্ট ও মেডিসিন বিশেষজ্ঞের পরামর্শ নিন।

📞 **জরুরি হেল্পলাইন:** জাতীয় স্বাস্থ্য বাতায়ন **16263** বা জরুরি সেবা **999**`;
  }

  if (q.includes('gastric') || q.includes('গ্যাস') || q.includes('acidity') || q.includes('বুক জ্বালা') || q.includes('পেট ব্যথা')) {
    return `### 🩺 গ্যাস্ট্রিক, অ্যাসিডিটি ও পেট ফাঁপার সমাধান (Acidity Management)

**তাত্ক্ষণিক পরামর্শ:**
- সকালে খালি পেটে এক গ্লাস কুসুম গরম পানি পান করুন।
- খাবারের ৩০ মিনিট আগে নির্দেশিত অ্যান্টাসিড বা প্রোটন পাম্প ইনহিবিটর (যেমন: Esomeprazole 20mg / Omeprazole) চিকিৎসকের পরামর্শ অনুযায়ী গ্রহণ করতে পারেন।

**খাদ্যাভ্যাস পরিবর্তন:**
- অতিরিক্ত তৈলাক্ত, ভাজাপোড়া ও মসলাযুক্ত খাবার এড়িয়ে চলুন।
- একবারে বেশি না খেয়ে অল্প অল্প করে বারবার খান।
- খাওয়ার সাথে সাথে শুয়ে পড়বেন না; অন্তত ২ ঘণ্টা পর ঘুমাতে যান।
- ধূমপান, অতিরিক্ত চা/কফি এবং কোমল পানীয় বর্জন করুন।

⚠️ *যদি তীব্র পেট ব্যথা পিঠে ছড়িয়ে পড়ে বা রক্তবমি/কালো পায়খানা হয়, অবিলম্বে হাসপাতালের ইমার্জেন্সিতে যান।*`;
  }

  if (q.includes('diabetes') || q.includes('ডায়াবেটিস') || q.includes('sugar') || q.includes('রক্তে চিনি')) {
    return `### 🩸 ডায়াবেটিস নিয়ন্ত্রণ ও যত্ন (Diabetes Management)

**মূল তিনটি স্তম্ভ (3D):**
1. **Diet (খাদ্যাভ্যাস):** চিনি, মিষ্টি, কোমল পানীয় ও রিফাইন কার্বোহাইড্রেট পরিহার করুন। লাল চালের ভাত, শাকসবজি ও পর্যাপ্ত ফাইবারযুক্ত খাবার খান।
2. **Discipline (শৃঙ্খলা):** প্রতিদিন অন্তত ৩০-৪৫ মিনিট দ্রুত হাঁটা বা হালকা ব্যায়াম করুন। নির্দিষ্ট সময়ে খাবার গ্রহণ করুন।
3. **Dose (ঔষধ/ইনসুলিন):** চিকিৎসকের নির্ধারিত ওরাল ড্রাগ বা ইনসুলিনের ডোজ নিয়মিত সময়মতো নিন।

**জরুরি সতর্কবার্তা (হাইপোগ্লাইসেমিয়া):**
- হঠাৎ মাথা ঘোরা, শরীর ঘেমে যাওয়া বা বুক ধড়ফড় করলে দ্রুত এক চামচ চিনি বা গ্লুকোজ পানি খেয়ে নিন এবং সুগার মাপুন।`;
  }

  return `### 🏥 স্বাস্থ্যসেবা AI স্বাস্থ্য পরামর্শ (SwasthoSeba Clinical Guidance)

আপনার স্বাস্থ্য জিজ্ঞাসার জন্য ধন্যবাদ। আপনার সমস্যাটির ক্ষেত্রে নিম্নলিখিত বিষয়গুলো খেয়াল রাখা জরুরি:

1. **উপসর্গের স্থায়িত্ব ও তীব্রতা:** লক্ষণগুলো কতদিন ধরে চলছে এবং তা দৈনন্দিন কাজে কোনো বড় বাধা তৈরি করছে কিনা লক্ষ্য রাখুন।
2. **পর্যাপ্ত বিশ্রাম ও হাইড্রেশন:** প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার বিশুদ্ধ পানি পান করুন এবং ৭-৮ ঘণ্টা পর্যাপ্ত ঘুমান।
3. **সঠিক বিশেষজ্ঞ নির্বাচন:** সঠিক রোগ নির্ণয়ের জন্য স্বাস্হ্যসেবা প্ল্যাটফর্মের মাধ্যমে সংশ্লিষ্ট বিষয়ের বিশেষজ্ঞ ডাক্তারের পরামর্শ (Online Video বা In-Chamber) গ্রহণ করুন।
4. **প্রেসক্রিপশন ছাড়া অ্যান্টিবায়োটিক বর্জন:** চিকিৎসকের সুস্পষ্ট নির্দেশনা ছাড়া নিজে নিজে কোনো অ্যান্টিবায়োটিক বা ব্যথানাশক ঔষধ সেবন করবেন না।

🚑 *যেকোনো জরুরি পরিস্থিতিতে দ্রুত ৯৯৯ অথবা ১৬২৬৩ নম্বরে যোগাযোগ করুন।*`;
}

function generateHeuristicTriage(symptoms, age, severity, duration) {
  const s = symptoms.toLowerCase();
  let urgencyLevel = "Moderate";
  let urgencyColor = "amber";
  let specialist = "General Physician / মেডিসিন বিশেষজ্ঞ";

  if (s.includes('chest pain') || s.includes('বুকে ব্যথা') || s.includes('shortness of breath') || s.includes('শ্বাসকষ্ট') || s.includes('paralysis') || s.includes('unconscious')) {
    urgencyLevel = "Emergency";
    urgencyColor = "red";
    specialist = "Cardiologist / Emergency Medicine (হৃদরোগ ও জরুরি বিভাগ)";
  } else if (s.includes('child') || s.includes('baby') || s.includes('বাচ্চা') || Number(age) < 12) {
    specialist = "Pediatrician (শিশু বিশেষজ্ঞ)";
  } else if (s.includes('skin') || s.includes('itching') || s.includes('চুলকানি') || s.includes('rash') || s.includes('দাদ')) {
    specialist = "Dermatologist (চর্ম ও যৌনরোগ বিশেষজ্ঞ)";
    urgencyLevel = "Mild / Self-Care";
    urgencyColor = "emerald";
  } else if (s.includes('pregnancy') || s.includes('গর্ভবতী') || s.includes('period') || s.includes('gynae')) {
    specialist = "Gynecologist & Obstetrician (স্ত্রীরোগ ও প্রসূতি বিশেষজ্ঞ)";
  }

  return {
    urgencyLevel,
    urgencyColor,
    assessmentSummaryBn: `উপসর্গ("${symptoms}") পর্যালোচনায় দেখা গেছে যে প্রাথমিক স্বাস্থ্যবিধি মেনে চলা এবং প্রয়োজনে সংশ্লিষ্ট বিশেষজ্ঞের পরামর্শ গ্রহণ করা উচিত।`,
    assessmentSummaryEn: `Based on your reported symptoms ("${symptoms}"), structured triage recommends home supportive care along with consulting a qualified specialist if symptoms persist.`,
    possibleConditions: [
      {
        nameBn: "সাধারণ সংক্রমণ বা ফ্লু সিন্ড্রোম",
        nameEn: "Viral Syndrome / Upper Respiratory Track Response",
        probability: "Moderate",
        explanation: "Matches general malaise, body temperature fluctuations, or fatigue."
      },
      {
        nameBn: "অ্যাসিড পেপটিক ডিজঅর্ডার / প্রদাহ",
        nameEn: "Acid Peptic Disease / Gastrointestinal Inflammation",
        probability: "Possible",
        explanation: "Correlates with abdominal discomfort, bloating, or irregular eating schedule."
      }
    ],
    recommendedSpecialist: specialist,
    immediateActions: [
      "Keep yourself adequately hydrated with pure water, oral saline, and light homemade soup.",
      "Take adequate physical and mental rest; avoid strenuous physical exertion.",
      "Monitor body vitals (temperature, blood pressure, pulse) twice daily.",
      "Avoid self-medicating with antibiotics or heavy painkillers without a doctor's prescription."
    ],
    redFlagWarnings: [
      "Sudden high fever exceeding 103°F not responding to paracetamol.",
      "Difficulty breathing or respiratory distress.",
      "Severe persistent abdominal cramping or repeated vomiting.",
      "Extreme lethargy, confusion, or bluish discoloration of lips."
    ],
    dietAndLifestyle: [
      "Consume freshly prepared home cooked meals with minimal spices.",
      "Avoid cold refrigerated drinks, processed fast food, and street food.",
      "Ensure 7 to 8 hours of uninterrupted sleep."
    ],
    disclaimer: "SwasthoSeba AI assessment provides general triage guidance and is not a clinical replacement for direct examination by a BMDC registered physician."
  };
}

// ----------------------------------------------------
// CLIENT SERVING (Vite in Dev or Static in Production)
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      console.log('⚡ Vite dev middleware connected to Express server');
    } catch (e) {
      console.warn('Vite middleware not initialized directly; serving static if built:', e.message);
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🏥 SwasthoSeba Full-Stack Server Running!`);
    console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
    console.log(`🚀 Mode: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Active (Configured)' : 'Standby / Clinical Heuristics'}`);
    console.log(`====================================================`);
  });
}

startServer();
