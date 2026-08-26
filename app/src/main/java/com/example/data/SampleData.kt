package com.example.data

object SampleData {
    val emergencyContacts = listOf(
        EmergencyContact(
            number = "16263",
            nameEn = "National Health Window (স্বাস্থ্য বাতায়ন)",
            nameBn = "জাতীয় স্বাস্থ্য বাতায়ন (১৬২৬৩)",
            descEn = "24/7 Free Doctor Telemedicine & Medical Advice by DGHS",
            descBn = "২৪/৭ সরকারি সার্বক্ষণিক ফ্রি ডাক্তার পরামর্শ ও স্বাস্থ্য সেবা"
        ),
        EmergencyContact(
            number = "999",
            nameEn = "National Emergency Service (Police, Fire, Ambulance)",
            nameBn = "জাতীয় জরুরি সেবা (৯৯৯)",
            descEn = "Immediate Police, Fire Fighter & Govt Ambulance Dispatch",
            descBn = "তাৎক্ষণিক পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স"
        ),
        EmergencyContact(
            number = "333",
            nameEn = "National Citizen Services & Doctor Aid",
            nameBn = "জাতীয় তথ্য ও জরুরি সেবা (৩৩৩)",
            descEn = "Public Health Consultation & Relief Services",
            descBn = "সরকারি চিকিৎসাসেবা ও নাগরিক তথ্য সহায়তা"
        ),
        EmergencyContact(
            number = "106",
            nameEn = "Emergency Medical Complaints & Malpractice Redressal",
            nameBn = "জরুরি চিকিৎসা অভিযোগ ও প্রতিকার (১০৬)",
            descEn = "Hospital Malpractice, Emergency Denial & Redressal",
            descBn = "হাসপাতাল অনিয়ম ও জরুরি সেবা অস্বীকৃতি অভিযোগ"
        ),
        EmergencyContact(
            number = "01779554391",
            nameEn = "Kaan Pete Roi (Mental Health & Suicide Hotline)",
            nameBn = "কান পেতে রই (মানসিক স্বাস্থ্য হেল্পলাইন)",
            descEn = "Emotional Support, Panic Relief & Suicide Prevention",
            descBn = "মানসিক সমর্থন, হতাশা ও সংকটকালীন মনস্তাত্ত্বিক সহায়তা"
        )
    )

    val healthDailyTips = listOf(
        HealthTip(
            id = "tip-1",
            titleEn = "The 20-20-20 Rule for Digital Eye Strain & Headaches",
            titleBn = "ডিজিটাল স্ক্রিনের চোখের চাপ ও মাথাব্যথা প্রতিরোধে ২০-২০-২০ নিয়ম",
            summaryEn = "Every 20 minutes look at an object 20 feet away for 20 seconds to prevent ocular fatigue.",
            summaryBn = "প্রতি ২০ মিনিট পর ২০ ফুট দূরবর্তী কোনো বস্তুর দিকে ২০ সেকেন্ড তাকিয়ে চোখের পেশিকে বিশ্রাম দিন।",
            fullContentEn = "Prolonged screen exposure reduces your natural blink rate by up to 50%, causing dry eyes and tension headaches. Applying the 20-20-20 rule helps your ciliary muscles relax, stimulates tear distribution, and reduces cervical spine tension.",
            fullContentBn = "টানা স্ক্রিন ব্যবহারে চোখের পলক ফেলার হার ৫০% কমে যায়। ২০-২০-২০ নিয়ম চর্চা করলে সিলিয়ারি পেশি শিথিল হয়, প্রাকৃতিক লুব্রিকেশন বজায় থাকে এবং মাথাব্যথা কমে।",
            category = "Daily Habits",
            readTime = "1 min read",
            evidenceSource = "American Academy of Ophthalmology & WHO Workplace Health",
            claps = 215
        ),
        HealthTip(
            id = "tip-2",
            titleEn = "Target Daily Hydration: 2.5L to 3L for Tropical Climates",
            titleBn = "দৈনিক সঠিক পানি পানের পরিমাণ: ২.৫ থেকে ৩ লিটার",
            summaryEn = "Optimal hydration boosts renal filtration, maintains electrolyte balance, and prevents urinary tract infections.",
            summaryBn = "পর্যাপ্ত পানি পান কিডনির ফিল্ট্রেশন ভালো রাখে, শক্তি বৃদ্ধি করে এবং প্রস্রাবের ইনফেকশন প্রতিরোধ করে।",
            fullContentEn = "In humid and warm weather, baseline insensible perspiration increases by 400-600ml. Aim for 8-10 glasses of clean water daily. If experiencing fatigue or dark-colored urine, supplement with coconut water or oral rehydration solution (ORS).",
            fullContentBn = "উষ্ণ আবহাওয়ায় শরীর থেকে প্রচুর আর্দ্রতা নির্গত হয়। দিনে অন্তত ৮-১০ গ্লাস বিশুদ্ধ পানি পান করুন। প্রস্রাবের রঙ গাঢ় হলে তৎক্ষণাৎ পানি বা ডাবের পানি গ্রহণ করুন।",
            category = "Nutrition",
            readTime = "2 min read",
            evidenceSource = "European Hydration Institute & DGHS Bangladesh",
            claps = 340
        ),
        HealthTip(
            id = "tip-3",
            titleEn = "Early Dengue Warning Signs: Hydration vs Platelet Myth",
            titleBn = "ডেঙ্গুর প্রাথমিক লক্ষণ ও করণীয়: প্লাটিলেট ও তরলের গুরুত্ব",
            summaryEn = "High sudden fever, retro-orbital pain, and severe body aches require immediate fluid management and NS1 testing.",
            summaryBn = "তীব্র জ্বর, চোখের পেছনে ব্যথা ও শরীর ব্যথায় প্রথম দিনেই NS1 অ্যান্টিজেন টেস্ট ও প্রচুর তরল খাবার গ্রহণ করুন।",
            fullContentEn = "In Dengue infection, maintaining adequate capillary volume with ORS, fresh fruit juices, and soups is far more critical in the early phase than panic over platelet counts. Never take Aspirin or Ibuprofen without physician consultation.",
            fullContentBn = "ডেঙ্গুতে রক্তনালির তরল রক্ষা করাই মূল চিকিৎসা। ওরস্যালাইন, ডাবের পানি, স্যুপ বেশি খান। চিকিৎসকের পরামর্শ ব্যতীত প্যারাসিটামল ছাড়া অন্য ব্যথানাশক ওষুধ খাবেন না।",
            category = "Prevention",
            readTime = "2 min read",
            evidenceSource = "DGHS Dengue Clinical Protocol & WHO SEARO Guidelines",
            claps = 512
        ),
        HealthTip(
            id = "tip-4",
            titleEn = "30-Minute Brisk Walking Lowers Systolic Blood Pressure by 5-8 mmHg",
            titleBn = "প্রতিদিন ৩০ মিনিট দ্রুত হাঁটা রক্তচাপ ৫-৮ mmHg কমায়",
            summaryEn = "Regular aerobic activity strengthens myocardial walls and increases nitric oxide bioavailability in arterial linings.",
            summaryBn = "নিয়মিত অ্যারোবিক হাঁটা হৃদযন্ত্রের কার্যক্ষমতা বাড়ায় এবং উচ্চ রক্তচাপের ঝুঁকি উল্লেখযোগ্যভাবে কমায়।",
            fullContentEn = "Moderate-intensity brisk walking for 150 minutes weekly has clinical efficacy comparable to first-line antihypertensive monotherapy for prehypertensive individuals. Pair with reduced dietary sodium intake (<5g daily).",
            fullContentBn = "সপ্তাহে ১৫০ মিনিট বা দিনে ৩০ মিনিট মাঝারি গতিতে হাঁটা উচ্চ রক্তচাপের ওষুধ শুরু করার প্রাথমিক পর্যায়ের মতোই কার্যকর। খাবারে অতিরিক্ত কাঁচা লবণ বর্জন করুন।",
            category = "Cardio",
            readTime = "1 min read",
            evidenceSource = "American Heart Association (AHA) Guidelines 2024",
            claps = 289
        ),
        HealthTip(
            id = "tip-5",
            titleEn = "Pre-Bedtime Sleep Hygiene: Melatonin Spike Optimization",
            titleBn = "সুনিদ্রার সহজ কৌশল: মেলাটোনিন হরমোনের স্বাভাবিক নিঃসরণ",
            summaryEn = "Avoid bright blue light 45 minutes before sleep to support deep REM cycles and cognitive cellular repair.",
            summaryBn = "ঘুমানোর ৪৫ মিনিট আগে মোবাইল বা ল্যাপটপের পর্দা থেকে দূরে থাকুন গভীর ও শান্তির ঘুমের জন্য।",
            fullContentEn = "Blue wavelengths (450-480nm) suppress pineal melatonin synthesis. Keeping your sleeping environment dim, cool (around 22-24°C), and noise-controlled promotes deep restorative sleep and strengthens the immune response.",
            fullContentBn = "নীল আলোর কারণে ঘুমের হরমোন মেলাটোনিনের উৎপাদন ব্যাহত হয়। শোয়ার ঘর অন্ধকার ও শান্ত রাখুন যাতে রোগ প্রতিরোধ ক্ষমতা বাড়ে এবং স্মৃতিশক্তি সতেজ থাকে।",
            category = "Mental Wellness",
            readTime = "2 min read",
            evidenceSource = "National Sleep Foundation & Harvard Health Publishing",
            claps = 198
        )
    )

    val doctors = listOf(
        Doctor(
            id = "doc-1",
            name = "Prof. Dr. Mohammad Rafiqul Islam",
            nameBn = "অধ্যাপক ডাঃ মোঃ রফিকুল ইসলাম",
            specialty = "Cardiology & Interventional Specialist",
            specialtyBn = "হৃদরোগ ও ইন্টারভেনশনাল মেডিসিন বিশেষজ্ঞ",
            degree = "MBBS, FCPS (Medicine), MD (Cardiology), FACC (USA)",
            hospital = "National Institute of Cardiovascular Diseases (NICVD) & Square Hospital",
            hospitalBn = "জাতীয় হৃদরোগ ইনস্টিটিউট ও স্কয়ার হাসপাতাল",
            experienceYears = 22,
            feeBdt = 1200,
            rating = 4.9,
            reviewCount = 524,
            nextSlot = "Today, 06:30 PM",
            availableDays = listOf("Sun", "Mon", "Tue", "Wed", "Thu"),
            bmdcRegNo = "A-24891"
        ),
        Doctor(
            id = "doc-2",
            name = "Dr. Nusrat Jahan Chowdhury",
            nameBn = "ডাঃ নুসরাত জাহান চৌধুরী",
            specialty = "Gynecology & High-Risk Pregnancy",
            specialtyBn = "স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ এবং ল্যাপারোস্কপিক সার্জন",
            degree = "MBBS, DGO, MCPS, FCPS (Obs & Gynae), MS (Gynae)",
            hospital = "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
            hospitalBn = "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (বিএসএমএমইউ)",
            experienceYears = 16,
            feeBdt = 1000,
            rating = 4.8,
            reviewCount = 412,
            nextSlot = "Tomorrow, 04:00 PM",
            availableDays = listOf("Sat", "Sun", "Tue", "Wed"),
            bmdcRegNo = "A-31204"
        ),
        Doctor(
            id = "doc-3",
            name = "Dr. Tanvir Ahmed Siddique",
            nameBn = "ডাঃ তানভীর আহমেদ সিদ্দিক",
            specialty = "Internal Medicine & Diabetology",
            specialtyBn = "মেডিসিন, ডায়াবেটিস ও বাতজ্বর বিশেষজ্ঞ",
            degree = "MBBS, FCPS (Medicine), MRCP (UK), FACP (USA)",
            hospital = "Dhaka Medical College & Hospital (DMCH) & Evercare Hospital",
            hospitalBn = "ঢাকা মেডিকেল কলেজ হাসপাতাল ও এভারকেয়ার হাসপাতাল",
            experienceYears = 14,
            feeBdt = 1000,
            rating = 4.9,
            reviewCount = 678,
            nextSlot = "Today, 07:45 PM",
            availableDays = listOf("Sat", "Sun", "Mon", "Tue", "Thu"),
            bmdcRegNo = "A-38742"
        ),
        Doctor(
            id = "doc-4",
            name = "Dr. Farzana Rahman",
            nameBn = "ডাঃ ফারজানা রহমান",
            specialty = "Child & Pediatric Specialist",
            specialtyBn = "শিশু ও কিশোর রোগ বিশেষজ্ঞ",
            degree = "MBBS, DCH, FCPS (Pediatrics)",
            hospital = "Bangladesh Shishu Hospital & Institute (Dhaka)",
            hospitalBn = "বাংলাদেশ শিশু হাসপাতাল ও ইনস্টিটিউট",
            experienceYears = 12,
            feeBdt = 800,
            rating = 4.9,
            reviewCount = 380,
            nextSlot = "Today, 05:00 PM",
            availableDays = listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri"),
            bmdcRegNo = "A-44129"
        ),
        Doctor(
            id = "doc-5",
            name = "Dr. Shakil Mahmud",
            nameBn = "ডাঃ শাকিল মাহমুদ",
            specialty = "Neurology & Brain Stroke Specialist",
            specialtyBn = "নিউরোলজি ও ব্রেন স্ট্রোক বিশেষজ্ঞ",
            degree = "MBBS, MD (Neurology), Fellow Clinical Neurophysiology",
            hospital = "National Institute of Neurosciences & United Hospital",
            hospitalBn = "জাতীয় নিউরোসায়েন্স ইনস্টিটিউট ও ইউনাইটেড হাসপাতাল",
            experienceYears = 18,
            feeBdt = 1500,
            rating = 4.8,
            reviewCount = 295,
            nextSlot = "Tomorrow, 07:00 PM",
            availableDays = listOf("Mon", "Wed", "Thu"),
            bmdcRegNo = "A-29011"
        ),
        Doctor(
            id = "doc-6",
            name = "Dr. Sadia Afroze",
            nameBn = "ডাঃ সাদিয়া আফরোজ",
            specialty = "Dermatology & Aesthetic Laser",
            specialtyBn = "চর্ম, অ্যালার্জি, যৌন ও লেজার স্পেশালিস্ট",
            degree = "MBBS, DDV, FCPS (Dermatology)",
            hospital = "Popular Diagnostic Centre (Dhanmondi) & Labaid Hospital",
            hospitalBn = "পপুলার ডায়াগনস্টিক সেন্টার ও ল্যাবএইড হাসপাতাল",
            experienceYears = 11,
            feeBdt = 900,
            rating = 4.7,
            reviewCount = 310,
            nextSlot = "Today, 08:15 PM",
            availableDays = listOf("Sat", "Mon", "Tue", "Wed"),
            bmdcRegNo = "A-49802"
        ),
        Doctor(
            id = "doc-7",
            name = "Dr. Mahbub Alam",
            nameBn = "ডাঃ মাহবুব আলম",
            specialty = "Orthopedics & Joint Replacement",
            specialtyBn = "হাড়-জোড় ও অর্থোপেডিক ট্রমা সার্জন",
            degree = "MBBS, MS (Orthopedics), AO Trauma Fellow (Switzerland)",
            hospital = "National Institute of Traumatology and Orthopaedic Rehabilitation (NITOR)",
            hospitalBn = "জাতীয় অর্থোপেডিক হাসপাতাল ও পুনর্বাসন প্রতিষ্ঠান (পঙ্গু হাসপাতাল)",
            experienceYears = 17,
            feeBdt = 1100,
            rating = 4.8,
            reviewCount = 265,
            nextSlot = "Wed, 06:00 PM",
            availableDays = listOf("Sun", "Tue", "Wed"),
            bmdcRegNo = "A-33510"
        )
    )

    val bloodDonors = listOf(
        BloodDonor("bd-1", "Sabbir Hossain", "O+", "Dhanmondi, Dhaka", "ধানমন্ডি, ঢাকা", "+8801711223344", "4 months ago", true),
        BloodDonor("bd-2", "Tasnim Ahmed", "A+", "Mirpur 10, Dhaka", "মিরপুর ১০, ঢাকা", "+8801822334455", "5 months ago", true),
        BloodDonor("bd-3", "Anika Tabassum", "B+", "Uttara Sector 7, Dhaka", "উত্তরা সেক্টর ৭, ঢাকা", "+8801933445566", "3 months ago", true),
        BloodDonor("bd-4", "Kazi Rashed", "O-", "Agrabad, Chattogram", "আগ্রাবাদ, চট্টগ্রাম", "+8801644556677", "6 months ago", true),
        BloodDonor("bd-5", "Rifat Hasan", "AB+", "Zindabazar, Sylhet", "জিন্দাবাজার, সিলেট", "+8801755667788", "2 months ago", true),
        BloodDonor("bd-6", "Nahid Karim", "A-", "Rajshahi Sadar", "রাজশাহী সদর", "+8801866778899", "4 months ago", true),
        BloodDonor("bd-7", "Sultana Yasmin", "B-", "Mohakhali, Dhaka", "মহাখালী, ঢাকা", "+8801977889900", "5 months ago", true),
        BloodDonor("bd-8", "Farhan Tanveer", "AB-", "Khulna City", "খুলনা শহর", "+8801588990011", "7 months ago", true)
    )

    val ambulances = listOf(
        Ambulance("amb-1", "Alif 24/7 ICU & Cardiac Ambulance", "ICU Ambulance", "All Bangladesh (Dhaka Base)", "+8801713000999", 5000, true),
        Ambulance("amb-2", "Green Life Emergency AC Fleet", "AC Ambulance", "Greater Dhaka & Suburbs", "+8801819222333", 2500, true),
        Ambulance("amb-3", "Red Crescent Emergency Ambulance", "Non-AC Standard", "Nationwide Division Hubs", "+8801912444555", 1500, true),
        Ambulance("amb-4", "SkyCare Emergency Air Ambulance", "Air Ambulance (Helicopter)", "Nationwide Aeromedical Evacuation", "+8801777888999", 85000, true)
    )

    val medicines = listOf(
        Medicine("med-1", "Napa Extra", "Paracetamol 500mg + Caffeine 65mg", "Beximco Pharmaceuticals", "Tablet", "565mg", 3.0, false, "Fever, headache, body pain, toothache"),
        Medicine("med-2", "Seclo 20", "Omeprazole", "Square Pharmaceuticals", "Capsule", "20mg", 6.0, false, "Gastric hyperacidity, peptic ulcer, GERD"),
        Medicine("med-3", "Monas 10", "Montelukast Sodium", "Acme Laboratories", "Tablet", "10mg", 16.0, true, "Asthma, seasonal allergic rhinitis, bronchospasm"),
        Medicine("med-4", "Finix 20", "Rabeprazole Sodium", "Opsonin Pharma", "Tablet", "20mg", 7.0, false, "Acid reflux, gastritis, indigestion"),
        Medicine("med-5", "Ceevit 250", "Ascorbic Acid (Vitamin C)", "Square Pharmaceuticals", "Chewable Tablet", "250mg", 2.0, false, "Immunity boost, Vitamin C deficiency, cold recovery"),
        Medicine("med-6", "Fexo 120", "Fexofenadine Hydrochloride", "Square Pharmaceuticals", "Tablet", "120mg", 10.0, false, "Allergy, sneezing, watery eyes, hives"),
        Medicine("med-7", "Oral Rehydration Salt (ORS-Saline)", "Sodium Chloride + Potassium Chloride + Glucose", "SMC", "Powder Sachet", "Half Litre", 6.0, false, "Diarrhea, dehydration, heat exhaustion, dengue fever fluid replacement")
    )

    val samplePrescriptions = listOf(
        Prescription(
            id = "rx-101",
            doctorName = "Prof. Dr. Mohammad Rafiqul Islam",
            hospital = "NICVD & Square Hospital",
            date = "15 Aug 2026",
            diagnosis = "Primary Hypertension (Stage 1) & Mild Hyperlipidemia",
            medicines = listOf("Tab. Bizoran 5/20 (1+0+0) - 30 days", "Tab. Lipicon 10mg (0+0+1) - 30 days", "Tab. Anclog 75mg (0+1+0) - After lunch"),
            notes = "Daily 30 min brisk walk. Sodium restriction < 4g/day. Re-check BP in 4 weeks."
        ),
        Prescription(
            id = "rx-102",
            doctorName = "Dr. Tanvir Ahmed Siddique",
            hospital = "Dhaka Medical College & Hospital",
            date = "02 Aug 2026",
            diagnosis = "Viral Upper Respiratory Infection & Acute Bronchial Irritation",
            medicines = listOf("Tab. Napa Extra 565mg (1+1+1) - 5 days if fever", "Tab. Fexo 120mg (0+0+1) - 7 days", "Syp. Tusca 10ml (2 tsp tid) - 5 days"),
            notes = "Warm steam inhalation twice daily. Adequate fluid intake (3L/day)."
        )
    )

    val initialAppointments = listOf(
        Appointment(
            id = "apt-101",
            doctorId = "doc-1",
            doctorName = "Prof. Dr. Mohammad Rafiqul Islam",
            specialty = "Cardiology & Interventional Specialist",
            hospital = "NICVD & Square Hospital",
            patientName = "Sheikh Walid",
            patientPhone = "+8801712345678",
            date = "Tomorrow, 27 Aug 2026",
            timeSlot = "06:30 PM",
            type = "Video Consultation",
            feeBdt = 1200,
            status = "Confirmed"
        ),
        Appointment(
            id = "apt-102",
            doctorId = "doc-4",
            doctorName = "Dr. Farzana Rahman",
            specialty = "Child & Pediatric Specialist",
            hospital = "Bangladesh Shishu Hospital",
            patientName = "Ayman Walid (Child)",
            patientPhone = "+8801712345678",
            date = "Friday, 29 Aug 2026",
            timeSlot = "05:00 PM",
            type = "In-Clinic Visit",
            feeBdt = 800,
            status = "Confirmed"
        )
    )

    val initialSampleNotifications = listOf(
        AppNotification(
            id = "notif-1",
            appointmentId = "apt-101",
            titleEn = "⏰ Reminder: Video Consultation in 15 Minutes",
            titleBn = "⏰ স্মরণিকা: ১৫ মিনিট পর ভিডিও কনসালটেশন শুরু",
            messageEn = "Your video consultation with Prof. Dr. Mohammad Rafiqul Islam (Cardiology) starts at 06:30 PM. Please ensure steady internet.",
            messageBn = "অধ্যাপক ডাঃ মোঃ রফিকুল ইসলামের সাথে আপনার ভিডিও সিরিয়াল সন্ধ্যা ০৬:৩০ টায় শুরু হচ্ছে। প্রস্তুত থাকুন।",
            timeAgo = "15m ago",
            type = NotificationType.REMINDER_15MIN,
            doctorName = "Prof. Dr. Mohammad Rafiqul Islam",
            specialty = "Cardiology Specialist",
            appointmentDate = "Tomorrow, 27 Aug 2026",
            appointmentTime = "06:30 PM",
            isVideoConsultation = true,
            isRead = false,
            isHighPriority = true
        ),
        AppNotification(
            id = "notif-2",
            appointmentId = "apt-101",
            titleEn = "✅ Appointment Confirmed with NICVD & Square Specialist",
            titleBn = "✅ অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে",
            messageEn = "Serial #101 booked for Prof. Dr. Mohammad Rafiqul Islam on 27 Aug 2026 at 06:30 PM.",
            messageBn = "অধ্যাপক ডাঃ মোঃ রফিকুল ইসলামের সিরিয়াল নিশ্চিত হয়েছে। তারিখ: ২৭ আগস্ট ২০২৬, সন্ধ্যা ০৬:৩০ মিনিট।",
            timeAgo = "2h ago",
            type = NotificationType.BOOKING_CONFIRMATION,
            doctorName = "Prof. Dr. Mohammad Rafiqul Islam",
            specialty = "Cardiology Specialist",
            appointmentDate = "Tomorrow, 27 Aug 2026",
            appointmentTime = "06:30 PM",
            isVideoConsultation = true,
            isRead = true,
            isHighPriority = false
        ),
        AppNotification(
            id = "notif-3",
            appointmentId = "apt-102",
            titleEn = "📅 Upcoming Pediatric In-Clinic Visit",
            titleBn = "📅 আসন্ন শিশু রোগ বিশেষজ্ঞ চেম্বার সিরিয়াল",
            messageEn = "Appointment for Ayman Walid with Dr. Farzana Rahman at Bangladesh Shishu Hospital on Friday at 05:00 PM.",
            messageBn = "ডাঃ ফারজানা রহমানের চেম্বারে আয়মান ওয়ালিদের সিরিয়াল শুক্রবার বিকাল ০৫:০০ টায়।",
            timeAgo = "1d ago",
            type = NotificationType.REMINDER_24HOUR,
            doctorName = "Dr. Farzana Rahman",
            specialty = "Pediatric Specialist",
            appointmentDate = "Friday, 29 Aug 2026",
            appointmentTime = "05:00 PM",
            isVideoConsultation = false,
            isRead = true,
            isHighPriority = false
        )
    )
}

