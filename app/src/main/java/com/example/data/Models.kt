package com.example.data

enum class AppLanguage {
    EN, BN
}

enum class NavTab {
    HOME,
    DOCTORS,
    AI_ASSISTANT,
    APPOINTMENTS,
    SERVICES
}

data class Doctor(
    val id: String,
    val name: String,
    val nameBn: String,
    val specialty: String,
    val specialtyBn: String,
    val degree: String,
    val hospital: String,
    val hospitalBn: String,
    val experienceYears: Int,
    val feeBdt: Int,
    val rating: Double,
    val reviewCount: Int,
    val nextSlot: String,
    val isVerified: Boolean = true,
    val availableDays: List<String>,
    val bmdcRegNo: String,
    val consultationModes: List<String> = listOf("Video Consultation", "In-Clinic Visit")
)

data class Appointment(
    val id: String,
    val doctorId: String,
    val doctorName: String,
    val specialty: String,
    val hospital: String,
    val patientName: String,
    val patientPhone: String,
    val date: String,
    val timeSlot: String,
    val type: String, // "Video Consultation" or "In-Clinic Visit"
    val feeBdt: Int,
    val status: String = "Confirmed", // "Confirmed", "Completed", "Cancelled"
    val meetingLink: String = "https://meet.swasthoseba.com/room-"
)

data class HealthTip(
    val id: String,
    val titleEn: String,
    val titleBn: String,
    val summaryEn: String,
    val summaryBn: String,
    val fullContentEn: String,
    val fullContentBn: String,
    val category: String, // "Daily Habits", "Cardio", "Nutrition", "Prevention", "Mental Wellness"
    val readTime: String,
    val evidenceSource: String, // e.g. "World Health Organization (WHO) Guidelines"
    val isBookmarked: Boolean = false,
    val claps: Int = 142
)

data class EmergencyContact(
    val number: String,
    val nameEn: String,
    val nameBn: String,
    val descEn: String,
    val descBn: String,
    val isTollFree: Boolean = true
)

data class BloodDonor(
    val id: String,
    val name: String,
    val bloodGroup: String, // "A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"
    val location: String,
    val locationBn: String,
    val contactPhone: String,
    val lastDonation: String,
    val isAvailable: Boolean = true
)

data class Ambulance(
    val id: String,
    val providerName: String,
    val type: String, // "ICU Ambulance", "AC Ambulance", "Non-AC Standard", "Freezer Ambulance"
    val coverageArea: String,
    val phone: String,
    val startingFeeBdt: Int,
    val is24x7: Boolean = true
)

data class Medicine(
    val id: String,
    val brandName: String,
    val genericName: String,
    val manufacturer: String,
    val dosageForm: String, // "Tablet", "Capsule", "Syrup", "Suspension"
    val strength: String,
    val priceBdt: Double,
    val requiresPrescription: Boolean = false,
    val indication: String
)

data class ChatMessage(
    val id: String,
    val text: String,
    val isUser: Boolean,
    val timestamp: String,
    val suggestedActions: List<String> = emptyList()
)

data class Prescription(
    val id: String,
    val doctorName: String,
    val hospital: String,
    val date: String,
    val diagnosis: String,
    val medicines: List<String>,
    val notes: String
)

enum class NotificationType {
    REMINDER_15MIN,
    REMINDER_1HOUR,
    REMINDER_24HOUR,
    BOOKING_CONFIRMATION,
    DOCTOR_WAITING_CALL,
    MEDICATION_SCHEDULE,
    GENERAL_ALERT
}

data class AppNotification(
    val id: String,
    val appointmentId: String? = null,
    val titleEn: String,
    val titleBn: String,
    val messageEn: String,
    val messageBn: String,
    val timeAgo: String = "Just now",
    val timestampMillis: Long = System.currentTimeMillis(),
    val type: NotificationType = NotificationType.REMINDER_15MIN,
    val doctorName: String? = null,
    val specialty: String? = null,
    val appointmentDate: String? = null,
    val appointmentTime: String? = null,
    val isVideoConsultation: Boolean = false,
    val isRead: Boolean = false,
    val isHighPriority: Boolean = true
)

data class ReminderSettings(
    val reminder15MinEnabled: Boolean = true,
    val reminder1HourEnabled: Boolean = true,
    val reminder24HourEnabled: Boolean = true,
    val doctorJoinedCallAlert: Boolean = true,
    val soundAndVibrationEnabled: Boolean = true
)

