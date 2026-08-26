package com.example.data

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import java.util.UUID

/**
 * Production-ready Notification Management Service for SwasthoSeba.
 * Handles simulated push notifications, in-app heads-up banners,
 * scheduled appointment countdown alerts, and optional system status bar notifications.
 */
class NotificationManagementService(
    private val context: Context? = null
) {
    companion object {
        const val CHANNEL_ID = "swastho_appointments"
        const val CHANNEL_NAME = "Doctor Appointment Reminders"
        const val CHANNEL_DESC = "Notifications for upcoming doctor appointments, reminders, and video room updates"
    }

    init {
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && context != null) {
            try {
                val importance = NotificationManager.IMPORTANCE_HIGH
                val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                    description = CHANNEL_DESC
                    enableVibration(true)
                    enableLights(true)
                }
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
                notificationManager?.createNotificationChannel(channel)
            } catch (e: Exception) {
                // Graceful fallback for environments without system notification privileges
            }
        }
    }

    /**
     * Creates a 15-Minute upcoming appointment reminder notification.
     */
    fun create15MinReminder(appointment: Appointment): AppNotification {
        val isVideo = appointment.type.contains("Video", ignoreCase = true)
        return AppNotification(
            id = "notif-${UUID.randomUUID().toString().take(8)}",
            appointmentId = appointment.id,
            titleEn = if (isVideo) "⏰ Video Call Starting in 15 Mins" else "⏰ Clinic Visit in 15 Mins",
            titleBn = if (isVideo) "⏰ ১৫ মিনিটে ভিডিও কনসালটেশন শুরু" else "⏰ ১৫ মিনিটে চেম্বার সিরিয়াল শুরু",
            messageEn = "Your appointment with ${appointment.doctorName} (${appointment.specialty}) is scheduled for ${appointment.timeSlot} today. Please be prepared.",
            messageBn = "${appointment.doctorName}-এর সাথে আপনার সিরিয়াল আজ ${appointment.timeSlot}-এ অনুষ্ঠিত হবে। প্রস্তুত থাকুন।",
            timeAgo = "Just now",
            type = NotificationType.REMINDER_15MIN,
            doctorName = appointment.doctorName,
            specialty = appointment.specialty,
            appointmentDate = appointment.date,
            appointmentTime = appointment.timeSlot,
            isVideoConsultation = isVideo,
            isRead = false,
            isHighPriority = true
        )
    }

    /**
     * Creates a 1-Hour upcoming appointment reminder notification.
     */
    fun create1HourReminder(appointment: Appointment): AppNotification {
        val isVideo = appointment.type.contains("Video", ignoreCase = true)
        return AppNotification(
            id = "notif-${UUID.randomUUID().toString().take(8)}",
            appointmentId = appointment.id,
            titleEn = "🗓️ Reminder: Consultation in 1 Hour",
            titleBn = "🗓️ স্মরণিকা: ১ ঘণ্টা পর আপনার ডাক্তারের সিরিয়াল",
            messageEn = "Consultation with ${appointment.doctorName} at ${appointment.hospital} is in 1 hour (${appointment.timeSlot}). Have your past prescriptions ready.",
            messageBn = "${appointment.doctorName}-এর সাথে ১ ঘণ্টা পর (${appointment.timeSlot}) কনসালটেশন শুরু হবে। পূর্বের টেস্ট রিপোর্ট বা প্রেসক্রিপশন কাছে রাখুন।",
            timeAgo = "Just now",
            type = NotificationType.REMINDER_1HOUR,
            doctorName = appointment.doctorName,
            specialty = appointment.specialty,
            appointmentDate = appointment.date,
            appointmentTime = appointment.timeSlot,
            isVideoConsultation = isVideo,
            isRead = false,
            isHighPriority = false
        )
    }

    /**
     * Creates a 24-Hour prior appointment reminder notification.
     */
    fun create24HourReminder(appointment: Appointment): AppNotification {
        val isVideo = appointment.type.contains("Video", ignoreCase = true)
        return AppNotification(
            id = "notif-${UUID.randomUUID().toString().take(8)}",
            appointmentId = appointment.id,
            titleEn = "📅 Upcoming Appointment Tomorrow",
            titleBn = "📅 আগামীকাল আপনার নির্ধারিত সিরিয়াল",
            messageEn = "You have an appointment scheduled for tomorrow (${appointment.date}) at ${appointment.timeSlot} with ${appointment.doctorName}.",
            messageBn = "আগামীকাল (${appointment.date}) ${appointment.timeSlot}-এ ${appointment.doctorName}-এর সাথে আপনার সিরিয়াল রয়েছে।",
            timeAgo = "Just now",
            type = NotificationType.REMINDER_24HOUR,
            doctorName = appointment.doctorName,
            specialty = appointment.specialty,
            appointmentDate = appointment.date,
            appointmentTime = appointment.timeSlot,
            isVideoConsultation = isVideo,
            isRead = false,
            isHighPriority = false
        )
    }

    /**
     * Creates an instant alert when doctor joins the video room or chamber is ready.
     */
    fun createDoctorWaitingAlert(appointment: Appointment): AppNotification {
        val isVideo = appointment.type.contains("Video", ignoreCase = true)
        return AppNotification(
            id = "notif-${UUID.randomUUID().toString().take(8)}",
            appointmentId = appointment.id,
            titleEn = if (isVideo) "🟢 Doctor Has Joined Video Room!" else "🟢 Your Serial is Next at Chamber",
            titleBn = if (isVideo) "🟢 ডাক্তার ভিডিও রুমে যুক্ত হয়েছেন!" else "🟢 চেম্বারে আপনার সিরিয়াল এখন প্রস্তুত",
            messageEn = "${appointment.doctorName} is waiting for you in the consultation room. Tap to join the live session now.",
            messageBn = "${appointment.doctorName} কনসালটেশন রুমে আপনার জন্য অপেক্ষা করছেন। এখনই যুক্ত হতে ট্যাপ করুন।",
            timeAgo = "Just now",
            type = NotificationType.DOCTOR_WAITING_CALL,
            doctorName = appointment.doctorName,
            specialty = appointment.specialty,
            appointmentDate = appointment.date,
            appointmentTime = appointment.timeSlot,
            isVideoConsultation = isVideo,
            isRead = false,
            isHighPriority = true
        )
    }

    /**
     * Creates an instant booking confirmation notification.
     */
    fun createBookingConfirmation(appointment: Appointment): AppNotification {
        val isVideo = appointment.type.contains("Video", ignoreCase = true)
        return AppNotification(
            id = "notif-${UUID.randomUUID().toString().take(8)}",
            appointmentId = appointment.id,
            titleEn = "✅ Serial Confirmed: ${appointment.doctorName}",
            titleBn = "✅ সিরিয়াল সফলভাবে নিশ্চিত হয়েছে",
            messageEn = "Serial booked for ${appointment.patientName} on ${appointment.date} at ${appointment.timeSlot} (${appointment.type}). Reminders are scheduled.",
            messageBn = "${appointment.patientName}-এর জন্য ${appointment.date} ${appointment.timeSlot}-এ সিরিয়াল নিশ্চিত করা হয়েছে। পুশ রিমাইন্ডার সক্রিয় আছে।",
            timeAgo = "Just now",
            type = NotificationType.BOOKING_CONFIRMATION,
            doctorName = appointment.doctorName,
            specialty = appointment.specialty,
            appointmentDate = appointment.date,
            appointmentTime = appointment.timeSlot,
            isVideoConsultation = isVideo,
            isRead = false,
            isHighPriority = true
        )
    }

    /**
     * Dispatches notification to Android OS system notification tray if possible.
     */
    fun postSystemNotification(notification: AppNotification) {
        if (context == null) return
        try {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return
            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(notification.titleEn)
                .setContentText(notification.messageEn)
                .setStyle(NotificationCompat.BigTextStyle().bigText(notification.messageEn))
                .setPriority(
                    if (notification.isHighPriority) NotificationCompat.PRIORITY_HIGH
                    else NotificationCompat.PRIORITY_DEFAULT
                )
                .setAutoCancel(true)

            val notificationId = notification.id.hashCode()
            notificationManager.notify(notificationId, builder.build())
        } catch (e: Exception) {
            // Silently handled in sandboxed container
        }
    }
}
