package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import android.content.Context
import com.example.data.Ambulance
import com.example.data.AppLanguage
import com.example.data.AppNotification
import com.example.data.Appointment
import com.example.data.BloodDonor
import com.example.data.ChatMessage
import com.example.data.Doctor
import com.example.data.EmergencyContact
import com.example.data.HealthTip
import com.example.data.Medicine
import com.example.data.NavTab
import com.example.data.NotificationManagementService
import com.example.data.NotificationType
import com.example.data.Prescription
import com.example.data.ReminderSettings
import com.example.data.SampleData
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class MainViewModel : ViewModel() {

    private var notificationService: NotificationManagementService = NotificationManagementService()

    private val _currentTab = MutableStateFlow(NavTab.HOME)
    val currentTab: StateFlow<NavTab> = _currentTab.asStateFlow()

    private val _language = MutableStateFlow(AppLanguage.EN)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _isDarkMode = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _doctors = MutableStateFlow(SampleData.doctors)
    val doctors: StateFlow<List<Doctor>> = _doctors.asStateFlow()

    private val _doctorSearchQuery = MutableStateFlow("")
    val doctorSearchQuery: StateFlow<String> = _doctorSearchQuery.asStateFlow()

    private val _selectedSpecialty = MutableStateFlow("All")
    val selectedSpecialty: StateFlow<String> = _selectedSpecialty.asStateFlow()

    private val _healthTips = MutableStateFlow(SampleData.healthDailyTips)
    val healthTips: StateFlow<List<HealthTip>> = _healthTips.asStateFlow()

    private val _selectedTipCategory = MutableStateFlow("All")
    val selectedTipCategory: StateFlow<String> = _selectedTipCategory.asStateFlow()

    private val _appointments = MutableStateFlow(SampleData.initialAppointments)
    val appointments: StateFlow<List<Appointment>> = _appointments.asStateFlow()

    // Notification State & Management
    private val _notifications = MutableStateFlow(SampleData.initialSampleNotifications)
    val notifications: StateFlow<List<AppNotification>> = _notifications.asStateFlow()

    private val _activeHeadsUpPush = MutableStateFlow<AppNotification?>(null)
    val activeHeadsUpPush: StateFlow<AppNotification?> = _activeHeadsUpPush.asStateFlow()

    private val _showNotificationCenter = MutableStateFlow(false)
    val showNotificationCenter: StateFlow<Boolean> = _showNotificationCenter.asStateFlow()

    private val _reminderSettings = MutableStateFlow(ReminderSettings())
    val reminderSettings: StateFlow<ReminderSettings> = _reminderSettings.asStateFlow()

    private val _activeVideoCallAppointment = MutableStateFlow<Appointment?>(null)
    val activeVideoCallAppointment: StateFlow<Appointment?> = _activeVideoCallAppointment.asStateFlow()

    private var pushDismissJob: Job? = null

    val unreadNotificationsCount: StateFlow<Int> = _notifications.map { list ->
        list.count { !it.isRead }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 1)

    private val _bloodDonors = MutableStateFlow(SampleData.bloodDonors)
    val bloodDonors: StateFlow<List<BloodDonor>> = _bloodDonors.asStateFlow()


    private val _selectedBloodGroup = MutableStateFlow("All")
    val selectedBloodGroup: StateFlow<String> = _selectedBloodGroup.asStateFlow()

    private val _ambulances = MutableStateFlow(SampleData.ambulances)
    val ambulances: StateFlow<List<Ambulance>> = _ambulances.asStateFlow()

    private val _medicines = MutableStateFlow(SampleData.medicines)
    val medicines: StateFlow<List<Medicine>> = _medicines.asStateFlow()

    private val _prescriptions = MutableStateFlow(SampleData.samplePrescriptions)
    val prescriptions: StateFlow<List<Prescription>> = _prescriptions.asStateFlow()

    private val _emergencyContacts = MutableStateFlow(SampleData.emergencyContacts)
    val emergencyContacts: StateFlow<List<EmergencyContact>> = _emergencyContacts.asStateFlow()

    private val _bookingDoctor = MutableStateFlow<Doctor?>(null)
    val bookingDoctor: StateFlow<Doctor?> = _bookingDoctor.asStateFlow()

    private val _showEmergencySheet = MutableStateFlow(false)
    val showEmergencySheet: StateFlow<Boolean> = _showEmergencySheet.asStateFlow()

    private val _toastMessage = MutableStateFlow<String?>(null)
    val toastMessage: StateFlow<String?> = _toastMessage.asStateFlow()

    private val _isAiThinking = MutableStateFlow(false)
    val isAiThinking: StateFlow<Boolean> = _isAiThinking.asStateFlow()

    private val _chatMessages = MutableStateFlow(
        listOf(
            ChatMessage(
                id = "welcome-1",
                text = "Hello! I am your SwasthoSeba AI Clinical Assistant 🩺. Tell me your symptoms, health concerns, or ask for guidance on medications, appointments, or preventive habits.\n\n(স্বাগতম! আপনার শারীরিক লক্ষণ বা স্বাস্থ্য জিজ্ঞাসা জানাতে পারেন।)",
                isUser = false,
                timestamp = "Just now",
                suggestedActions = listOf(
                    "High Fever & Body Ache",
                    "Dengue Warning Signs",
                    "Stomach Acidity & Reflux",
                    "Blood Pressure Guidelines",
                    "Doctor Recommendation"
                )
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    fun selectTab(tab: NavTab) {
        _currentTab.value = tab
    }

    fun toggleLanguage() {
        _language.value = if (_language.value == AppLanguage.EN) AppLanguage.BN else AppLanguage.EN
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    fun setDarkMode(enabled: Boolean) {
        _isDarkMode.value = enabled
    }

    fun setDoctorSearchQuery(query: String) {
        _doctorSearchQuery.value = query
    }

    fun setSelectedSpecialty(specialty: String) {
        _selectedSpecialty.value = specialty
    }

    fun setTipCategory(category: String) {
        _selectedTipCategory.value = category
    }

    fun toggleTipBookmark(tipId: String) {
        _healthTips.value = _healthTips.value.map {
            if (it.id == tipId) it.copy(isBookmarked = !it.isBookmarked) else it
        }
        val tip = _healthTips.value.find { it.id == tipId }
        val msg = if (tip?.isBookmarked == true) "Tip saved to bookmarks" else "Removed from bookmarks"
        showToast(msg)
    }

    fun clapTip(tipId: String) {
        _healthTips.value = _healthTips.value.map {
            if (it.id == tipId) it.copy(claps = it.claps + 1) else it
        }
    }

    fun openBooking(doctor: Doctor) {
        _bookingDoctor.value = doctor
    }

    fun closeBooking() {
        _bookingDoctor.value = null
    }

    fun setContext(context: Context) {
        notificationService = NotificationManagementService(context.applicationContext)
    }

    fun toggleNotificationCenter(show: Boolean) {
        _showNotificationCenter.value = show
    }

    fun openVideoCallForAppointment(appointment: Appointment) {
        _activeVideoCallAppointment.value = appointment
    }

    fun closeVideoCall() {
        _activeVideoCallAppointment.value = null
    }

    fun dismissHeadsUpPush() {
        pushDismissJob?.cancel()
        _activeHeadsUpPush.value = null
    }

    fun sendSimulatedPush(notification: AppNotification) {
        // Add to active notifications list at top (or replace existing with same ID)
        val existingIndex = _notifications.value.indexOfFirst { it.id == notification.id }
        if (existingIndex >= 0) {
            val updated = _notifications.value.toMutableList()
            updated[existingIndex] = notification
            _notifications.value = updated
        } else {
            _notifications.value = listOf(notification) + _notifications.value
        }

        // Trigger active visual heads-up push banner
        pushDismissJob?.cancel()
        _activeHeadsUpPush.value = notification

        // Attempt system notification
        notificationService.postSystemNotification(notification)

        // Auto dismiss banner after 7.5 seconds
        pushDismissJob = viewModelScope.launch {
            delay(7500)
            if (_activeHeadsUpPush.value?.id == notification.id) {
                _activeHeadsUpPush.value = null
            }
        }
    }

    fun simulate15MinReminder(appointmentId: String) {
        val apt = _appointments.value.find { it.id == appointmentId } ?: return
        val notif = notificationService.create15MinReminder(apt)
        sendSimulatedPush(notif)
        showToast(if (_language.value == AppLanguage.BN) "১৫-মিনিট রিমাইন্ডার পুশ পাঠানো হয়েছে" else "Sent 15-minute simulated reminder push")
    }

    fun simulate1HourReminder(appointmentId: String) {
        val apt = _appointments.value.find { it.id == appointmentId } ?: return
        val notif = notificationService.create1HourReminder(apt)
        sendSimulatedPush(notif)
        showToast(if (_language.value == AppLanguage.BN) "১-ঘণ্টা রিমাইন্ডার পুশ পাঠানো হয়েছে" else "Sent 1-hour simulated reminder push")
    }

    fun simulate24HourReminder(appointmentId: String) {
        val apt = _appointments.value.find { it.id == appointmentId } ?: return
        val notif = notificationService.create24HourReminder(apt)
        sendSimulatedPush(notif)
        showToast(if (_language.value == AppLanguage.BN) "২৪-ঘণ্টা রিমাইন্ডার পুশ পাঠানো হয়েছে" else "Sent 24-hour reminder push")
    }

    fun simulateDoctorWaitingInRoom(appointmentId: String) {
        val apt = _appointments.value.find { it.id == appointmentId } ?: return
        val notif = notificationService.createDoctorWaitingAlert(apt)
        sendSimulatedPush(notif)
        showToast(if (_language.value == AppLanguage.BN) "ডাক্তার প্রস্তুত পুশ অ্যালার্ট পাঠানো হয়েছে" else "Sent 'Doctor is Ready' push alert")
    }

    fun markNotificationAsRead(id: String) {
        _notifications.value = _notifications.value.map {
            if (it.id == id) it.copy(isRead = true) else it
        }
    }

    fun markAllNotificationsAsRead() {
        _notifications.value = _notifications.value.map { it.copy(isRead = true) }
        showToast(if (_language.value == AppLanguage.BN) "সব নোটিফিকেশন পড়া হয়েছে" else "All notifications marked as read")
    }

    fun clearAllNotifications() {
        _notifications.value = emptyList()
        _activeHeadsUpPush.value = null
        showToast(if (_language.value == AppLanguage.BN) "সব নোটিফিকেশন মুছে ফেলা হয়েছে" else "All notifications cleared")
    }

    fun deleteNotification(id: String) {
        _notifications.value = _notifications.value.filter { it.id != id }
        if (_activeHeadsUpPush.value?.id == id) {
            _activeHeadsUpPush.value = null
        }
    }

    fun updateReminderSettings(settings: ReminderSettings) {
        _reminderSettings.value = settings
        showToast(if (_language.value == AppLanguage.BN) "রিমাইন্ডার সেটিংস সংরক্ষিত হয়েছে" else "Reminder preferences saved")
    }

    fun confirmBooking(
        doctor: Doctor,
        patientName: String,
        patientPhone: String,
        date: String,
        timeSlot: String,
        type: String
    ) {
        val newAppointment = Appointment(
            id = "apt-${UUID.randomUUID().toString().take(6)}",
            doctorId = doctor.id,
            doctorName = if (_language.value == AppLanguage.BN) doctor.nameBn else doctor.name,
            specialty = if (_language.value == AppLanguage.BN) doctor.specialtyBn else doctor.specialty,
            hospital = if (_language.value == AppLanguage.BN) doctor.hospitalBn else doctor.hospital,
            patientName = patientName.ifBlank { "Patient" },
            patientPhone = patientPhone.ifBlank { "+8801712345678" },
            date = date,
            timeSlot = timeSlot,
            type = type,
            feeBdt = doctor.feeBdt,
            status = "Confirmed"
        )
        _appointments.value = listOf(newAppointment) + _appointments.value
        _bookingDoctor.value = null

        // Trigger instant booking confirmation push notification
        val confirmationNotif = notificationService.createBookingConfirmation(newAppointment)
        sendSimulatedPush(confirmationNotif)

        showToast("Appointment successfully booked with ${doctor.name}!")
    }

    fun cancelAppointment(appointmentId: String) {
        _appointments.value = _appointments.value.map {
            if (it.id == appointmentId) it.copy(status = "Cancelled") else it
        }
        showToast("Appointment cancelled.")
    }

    fun toggleEmergencySheet(show: Boolean) {
        _showEmergencySheet.value = show
    }

    fun setBloodGroupFilter(group: String) {
        _selectedBloodGroup.value = group
    }

    fun showToast(message: String) {
        _toastMessage.value = message
        viewModelScope.launch {
            delay(3000)
            if (_toastMessage.value == message) {
                _toastMessage.value = null
            }
        }
    }

    fun clearToast() {
        _toastMessage.value = null
    }

    fun addPrescription(doctor: String, hospital: String, diagnosis: String, meds: List<String>, notes: String) {
        val newPrescription = Prescription(
            id = "rx-${UUID.randomUUID().toString().take(6)}",
            doctorName = doctor,
            hospital = hospital,
            date = "Today",
            diagnosis = diagnosis,
            medicines = meds,
            notes = notes
        )
        _prescriptions.value = listOf(newPrescription) + _prescriptions.value
        showToast("Prescription recorded in Vault.")
    }

    fun sendAiMessage(userText: String) {
        if (userText.isBlank()) return
        val userMsg = ChatMessage(
            id = UUID.randomUUID().toString(),
            text = userText,
            isUser = true,
            timestamp = "Just now"
        )
        _chatMessages.value = _chatMessages.value + userMsg
        _isAiThinking.value = true

        viewModelScope.launch {
            delay(1200) // realistic typing delay
            val responseText = generateClinicalResponse(userText, _language.value)
            val botMsg = ChatMessage(
                id = UUID.randomUUID().toString(),
                text = responseText,
                isUser = false,
                timestamp = "Just now",
                suggestedActions = getSuggestedActionsForQuery(userText)
            )
            _chatMessages.value = _chatMessages.value + botMsg
            _isAiThinking.value = false
        }
    }

    private fun generateClinicalResponse(query: String, lang: AppLanguage): String {
        val q = query.lowercase()
        val isBn = lang == AppLanguage.BN || q.contains("জ্বর") || q.contains("মাথা") || q.contains("ব্যথা") || q.contains("পেট")

        return when {
            q.contains("fever") || q.contains("temp") || q.contains("জ্বর") -> {
                if (isBn) {
                    "🌡️ **জ্বর ও শরীর ব্যথার ক্লিনিক্যাল পরামর্শ:**\n\n1. **প্রাথমিক পরিচর্যা:** পর্যাপ্ত বিশ্রাম নিন এবং প্রতি ৬-৮ ঘণ্টা পর প্যারাসিটামল ৫০০ মিগ্রা (Tab. Napa Extra/Ace) সেবন করতে পারেন (প্রাপ্তবয়স্কদের জন্য)।\n2. **তরল গ্রহণ:** প্রচুর পানি, খাবার স্যালাইন (ORS), ডাবের পানি ও লেবুর শরবত পান করুন।\n3. **সতর্কতা:** জ্বর ৩ দিনের বেশি স্থায়ী হলে বা ১০৩°F এর বেশি হলে অবিলম্বে ডেঙ্গু NS1 অ্যান্টিজেন ও CBC রক্ত পরীক্ষা করান।\n\n⚠️ *জরুরি স্বাস্থ্য বাতায়ন ১৬২৬৩ তে যেকোনো সময় ফ্রি কল করতে পারেন।*"
                } else {
                    "🌡️ **Clinical Triage for Fever & Myalgia:**\n\n1. **First-Line Care:** Maintain bed rest and administer Paracetamol 500mg (e.g. Napa Extra) every 6-8 hours as needed for temperature > 100°F.\n2. **Hydration:** Ensure minimum 2.5L to 3L fluid intake (ORS, tender coconut water, broth).\n3. **Red Flags:** If fever exceeds 3 days or is accompanied by retro-orbital pain or petechial spots, do an immediate NS1 Antigen & CBC test.\n\n⚠️ *Disclaimer: Always consult a registered physician (BMDC) for persistent symptoms.*"
                }
            }
            q.contains("dengue") || q.contains("ডেঙ্গু") -> {
                if (isBn) {
                    "🦟 **ডেঙ্গু সচেতনতা ও সতর্কতা:**\n\n• **প্রধান লক্ষণ:** তীব্র জ্বর, চোখের পেছনের ব্যথা, তীব্র জয়েন্ট ও মাংসপেশিতে ব্যথা।\n• **করণীয়:** প্রচুর তরল খাবার (দিনে ৩-৪ লিটার) গ্রহণ করুন। ব্যথানাশক হিসেবে অ্যাসপিরিন বা আইবুপ্রোফেন একদম বর্জনীয়।\n• **বিপজ্জনক লক্ষণ:** অবিরাম পেটে ব্যথা, তীব্র বমি, মাড়ি বা নাক দিয়ে রক্তপাত হলে তাৎক্ষণিক হাসপাতালে ভর্তি হতে হবে।"
                } else {
                    "🦟 **Dengue Clinical Management & Protocol:**\n\n• **Core Focus:** Adequate fluid resuscitation (3-4L daily with ORS, fresh soups) to prevent vascular leak syndrome.\n• **Warning Signs:** Persistent abdominal tenderness, repeated vomiting, mucosal bleeding, or sudden drop in body temperature.\n• **Contraindication:** Strict avoidance of NSAIDs (Ibuprofen, Aspirin). Only Paracetamol is permitted."
                }
            }
            q.contains("stomach") || q.contains("acidity") || q.contains("gastric") || q.contains("পেট") || q.contains("গ্যাস") -> {
                if (isBn) {
                    "🧪 **গ্যাস্ট্রিক ও পেটের অস্বস্তির নির্দেশিকা:**\n\n1. **খাদ্যাভ্যাস:** অতিরিক্ত তৈলাক্ত ও মসলাযুক্ত খাবার এড়িয়ে চলুন। সময়মতো খাবার খান।\n2. **ওষুধ:** অ্যান্টাসিড অথবা ওমিপ্রাজল ২০ মিগ্রা (Seclo 20) খালি পেটে সেবন করতে পারেন।\n3. **জীবনযাত্রা:** খাওয়ার সাথে সাথে শুয়ে পড়বেন না; অন্তত ২ ঘণ্টা পর ঘুমাতে যান।"
                } else {
                    "🧪 **Gastrointestinal Acidity & Reflux Care:**\n\n1. **Lifestyle:** Avoid oily/spicy foods and late-night heavy meals. Elevate head of bed by 15 degrees if experiencing nocturnal GERD.\n2. **Medication:** Proton Pump Inhibitors (e.g., Omeprazole 20mg / Seclo) taken 30 minutes before breakfast.\n3. **Alert:** If severe right-lower quadrant pain or vomiting blood occurs, seek immediate emergency care."
                }
            }
            q.contains("pressure") || q.contains("bp") || q.contains("রক্তচাপ") || q.contains("হাইপারটেনশন") -> {
                if (isBn) {
                    "❤️ **উচ্চ রক্তচাপ নিয়ন্ত্রণ নির্দেশিকা:**\n\n• **স্বাভাবিক মাত্রা:** ১২০/৮০ mmHg এর নিচে।\n• **নিয়ন্ত্রণ পদ্ধতি:** খাবারে অতিরিক্ত কাঁচা লবণ সম্পূর্ণ বর্জন করুন। দিনে ৩০ মিনিট দ্রুত হাঁটুন।\n• **নিয়মিত চেকআপ:** কার্ডিওলজিস্টের পরামর্শ নিয়ে নিয়মিত প্রেসার মাপুন ও ডাক্তারের নির্দেশিত ওষুধ নিয়মিত সেবন করুন।"
                } else {
                    "❤️ **Hypertension Management Protocol:**\n\n• **Target BP:** < 120/80 mmHg (Normal), 130-139/80-89 mmHg (Stage 1 Hypertension).\n• **Action Plan:** Dietary Sodium restriction (<4g/day), 150 mins weekly aerobic exercise, and stress management.\n• **Adherence:** Never discontinue antihypertensive medication without your cardiologist's advice."
                }
            }
            else -> {
                if (isBn) {
                    "🩺 **স্বাস্থ্যসেবা অ্যাসিস্ট্যান্ট উত্তর:**\n\nআপনার স্বাস্থ্য বিষয়ক তথ্যের জন্য ধন্যবাদ। আপনি চাইলে আমাদের স্পেশালিস্ট ডাক্তারদের সাথে অনলাইন ভিডিও কনসালটেশন বা সরাসরি চেম্বারের অ্যাপয়েন্টমেন্ট বুক করতে পারেন।\n\nজরুরি সহায়তার জন্য আমাদের জাতীয় হটলাইন **১৬২৬৩** বা **৯৯৯** এ ডায়াল করুন।"
                } else {
                    "🩺 **SwasthoSeba Clinical Response:**\n\nThank you for providing your symptoms. Based on evidence-based triage, we recommend monitoring your resting vitals and consulting a verified specialist in our Doctor Directory.\n\nFor 24/7 immediate free doctor advice, you can also dial **16263** (DGHS Shastho Batayon)."
                }
            }
        }
    }

    private fun getSuggestedActionsForQuery(query: String): List<String> {
        val q = query.lowercase()
        return when {
            q.contains("fever") || q.contains("জ্বর") -> listOf("Book Medicine Specialist", "Nearby Diagnostic Center", "Check Dengue Protocol")
            q.contains("pressure") || q.contains("রক্তচাপ") -> listOf("Book Cardiologist", "Dietary Low-Sodium Guide", "Log BP Reading")
            q.contains("stomach") || q.contains("পেট") -> listOf("Order Seclo 20", "Consult Gastroenterologist", "Hydration Tips")
            else -> listOf("Find Nearby Doctors", "Call 16263 Hotline", "Emergency Ambulance")
        }
    }
}
