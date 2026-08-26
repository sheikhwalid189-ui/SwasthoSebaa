package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CallEnd
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.EventAvailable
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material.icons.filled.VideocamOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.AppLanguage
import com.example.data.Appointment
import com.example.data.NavTab
import com.example.ui.theme.EmeraldContainer
import com.example.ui.theme.EmeraldSecondary
import com.example.ui.theme.RoseContainer
import com.example.ui.theme.RoseEmergency
import com.example.ui.theme.TealContainer
import com.example.ui.theme.TealPrimary

@Composable
fun AppointmentsScreen(
    appointments: List<Appointment>,
    onCancelAppointment: (String) -> Unit,
    onNavigateToDoctors: () -> Unit,
    onSimulate15Min: (String) -> Unit = {},
    onSimulate1Hour: (String) -> Unit = {},
    onSimulateDoctorWaiting: (String) -> Unit = {},
    onOpenNotificationCenter: () -> Unit = {},
    language: AppLanguage,
    modifier: Modifier = Modifier
) {
    var selectedFilter by remember { mutableStateOf("All") }
    var activeVideoCallAppointment by remember { mutableStateOf<Appointment?>(null) }

    val filteredAppointments = when (selectedFilter) {
        "Upcoming" -> appointments.filter { it.status == "Confirmed" }
        "Cancelled" -> appointments.filter { it.status == "Cancelled" }
        else -> appointments
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .testTag("appointments_screen")
    ) {
        // Notification Reminder Service Status Header Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .testTag("notification_reminder_status_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
            )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.NotificationsActive,
                            contentDescription = "Notification Service",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = if (language == AppLanguage.BN) "পুশ নোটিফিকেশন রিমাইন্ডার সক্রিয়" else "Push Reminder Service Active",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = if (language == AppLanguage.BN) "১৫-মিনিট, ১-ঘণ্টা ও ডাক্তার রুম প্রস্তুত রিমাইন্ডার" else "15m, 1h & Doctor Ready push alerts scheduled",
                            style = MaterialTheme.typography.bodySmall,
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Button(
                    onClick = onOpenNotificationCenter,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    ),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier
                        .height(32.dp)
                        .testTag("open_notification_center_btn")
                ) {
                    Text(
                        text = if (language == AppLanguage.BN) "সেন্টার" else "Center",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Filter Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("All", "Upcoming", "Cancelled").forEach { filter ->
                val isSelected = selectedFilter == filter
                val label = when (filter) {
                    "All" -> if (language == AppLanguage.BN) "সব সিরিয়াল" else "All Bookings"
                    "Upcoming" -> if (language == AppLanguage.BN) "আসন্ন" else "Upcoming"
                    "Cancelled" -> if (language == AppLanguage.BN) "বাতিলকৃত" else "Cancelled"
                    else -> filter
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { selectedFilter = filter }
                        .padding(horizontal = 14.dp, vertical = 7.dp)
                ) {
                    Text(
                        text = label,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }


        if (filteredAppointments.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(TealContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.EventAvailable,
                            contentDescription = "No Appointments",
                            tint = TealPrimary,
                            modifier = Modifier.size(36.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = if (language == AppLanguage.BN) "কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি" else "No Appointments Found",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = if (language == AppLanguage.BN) "বিশেষজ্ঞ ডাক্তারদের সাথে আজই সিরিয়াল বুক করুন।" else "Book a consultation with verified specialists in seconds.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 12.sp
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    Button(
                        onClick = onNavigateToDoctors,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = TealPrimary,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.testTag("book_doctor_empty_cta")
                    ) {
                        Text(
                            text = if (language == AppLanguage.BN) "ডাক্তার তালিকা দেখুন" else "Find a Doctor"
                        )
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredAppointments, key = { it.id }) { appointment ->
                    AppointmentCard(
                        appointment = appointment,
                        language = language,
                        onJoinVideo = { activeVideoCallAppointment = appointment },
                        onCancel = { onCancelAppointment(appointment.id) },
                        onSimulate15Min = { onSimulate15Min(appointment.id) },
                        onSimulate1Hour = { onSimulate1Hour(appointment.id) },
                        onSimulateDoctorWaiting = { onSimulateDoctorWaiting(appointment.id) }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }

    // Interactive Video Call Simulator Dialog
    if (activeVideoCallAppointment != null) {
        VideoConsultationRoomDialog(
            appointment = activeVideoCallAppointment!!,
            language = language,
            onClose = { activeVideoCallAppointment = null }
        )
    }
}

@Composable
fun AppointmentCard(
    appointment: Appointment,
    language: AppLanguage,
    onJoinVideo: () -> Unit,
    onCancel: () -> Unit,
    onSimulate15Min: () -> Unit = {},
    onSimulate1Hour: () -> Unit = {},
    onSimulateDoctorWaiting: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val isConfirmed = appointment.status == "Confirmed"
    val isVideo = appointment.type.contains("Video", ignoreCase = true)
    var showPushMenu by remember { mutableStateOf(false) }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("appointment_card_${appointment.id}"),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header Row: Status badge & Mode badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isConfirmed) EmeraldContainer else MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (isConfirmed) Icons.Default.CheckCircle else Icons.Default.Cancel,
                            contentDescription = "Status",
                            tint = if (isConfirmed) EmeraldSecondary else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isConfirmed) (if (language == AppLanguage.BN) "নিশ্চিত সিরিয়াল" else "Confirmed") else (if (language == AppLanguage.BN) "বাতিলকৃত" else "Cancelled"),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isConfirmed) EmeraldSecondary else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isVideo) TealContainer else MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (isVideo) (if (language == AppLanguage.BN) "ভিডিও কনসালটেশন" else "Video Telemedicine") else (if (language == AppLanguage.BN) "চেম্বার ভিজিট" else "In-Clinic Visit"),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isVideo) TealPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Doctor & Hospital Info
            Text(
                text = appointment.doctorName,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = appointment.specialty,
                style = MaterialTheme.typography.bodySmall,
                color = TealPrimary,
                fontWeight = FontWeight.SemiBold
            )

            Text(
                text = appointment.hospital,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Schedule info box
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = "Date",
                        tint = TealPrimary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = appointment.date,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Schedule,
                        contentDescription = "Time",
                        tint = TealPrimary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = appointment.timeSlot,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Patient Name & Phone
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "Patient",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${if (language == AppLanguage.BN) "রোগী:" else "Patient:"} ${appointment.patientName} (${appointment.patientPhone})",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (isConfirmed) {
                Spacer(modifier = Modifier.height(8.dp))

                // Reminder notification active badge & Test Push Button Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Alarm,
                            contentDescription = "Scheduled Reminder",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = if (language == AppLanguage.BN) "রিমাইন্ডার সক্রিয় (১৫মি, ১ঘ)" else "Reminders Scheduled (15m, 1h)",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Box {
                        Button(
                            onClick = { showPushMenu = true },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = MaterialTheme.colorScheme.onPrimary
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                            modifier = Modifier
                                .height(26.dp)
                                .testTag("simulate_push_menu_btn_${appointment.id}")
                        ) {
                            Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(11.dp))
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(if (language == AppLanguage.BN) "টেস্ট পুশ" else "Test Push", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }

                        DropdownMenu(
                            expanded = showPushMenu,
                            onDismissRequest = { showPushMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text(if (language == AppLanguage.BN) "⏰ ১৫-মিনিট কাউন্টডাউন পুশ" else "⏰ 15-Minute Alert Push", fontSize = 12.sp) },
                                onClick = {
                                    showPushMenu = false
                                    onSimulate15Min()
                                },
                                leadingIcon = { Icon(Icons.Default.Alarm, contentDescription = null, modifier = Modifier.size(16.dp)) }
                            )

                            if (isVideo) {
                                DropdownMenuItem(
                                    text = { Text(if (language == AppLanguage.BN) "🟢 ডাক্তার প্রস্তুত (ভিডিও রুম) পুশ" else "🟢 Doctor Waiting in Room Push", fontSize = 12.sp) },
                                    onClick = {
                                        showPushMenu = false
                                        onSimulateDoctorWaiting()
                                    },
                                    leadingIcon = { Icon(Icons.Default.Videocam, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                )
                            }

                            DropdownMenuItem(
                                text = { Text(if (language == AppLanguage.BN) "🗓️ ১-ঘণ্টা পূর্বের নোটিফিকেশন" else "🗓️ 1-Hour Prior Reminder Push", fontSize = 12.sp) },
                                onClick = {
                                    showPushMenu = false
                                    onSimulate1Hour()
                                },
                                leadingIcon = { Icon(Icons.Default.CalendarMonth, contentDescription = null, modifier = Modifier.size(16.dp)) }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (isVideo) {
                        Button(
                            onClick = onJoinVideo,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = TealPrimary,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp)
                                .testTag("join_video_${appointment.id}")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Videocam,
                                contentDescription = "Video Call",
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (language == AppLanguage.BN) "ভিডিও কলে যুক্ত হোন" else "Join Video Call",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    OutlinedButton(
                        onClick = onCancel,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .height(38.dp)
                            .testTag("cancel_appointment_${appointment.id}")
                    ) {
                        Text(
                            text = if (language == AppLanguage.BN) "বাতিল" else "Cancel",
                            fontSize = 11.sp,
                            color = RoseEmergency
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun VideoConsultationRoomDialog(
    appointment: Appointment,
    language: AppLanguage,
    onClose: () -> Unit
) {
    var isMuted by remember { mutableStateOf(false) }
    var isVideoOff by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onClose,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0F172A)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Header in Video Room
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = appointment.doctorName,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "${appointment.specialty} • ${if (language == AppLanguage.BN) "সরাসরি টেলিমেডিসিন" else "Live Telemedicine"}",
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 11.sp
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(EmeraldSecondary)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "04:12 HD",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Doctor Video Feed Simulation Box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(340.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(Color(0xFF1E293B)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(88.dp)
                                .clip(CircleShape)
                                .background(TealPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = appointment.doctorName.take(2).uppercase(),
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 28.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = appointment.doctorName,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                        Text(
                            text = if (language == AppLanguage.BN) "ডাক্তার কথা বলছেন..." else "Doctor is speaking with clear audio...",
                            color = EmeraldSecondary,
                            fontSize = 12.sp
                        )
                    }

                    // Self Video Preview Overlay (Bottom Right)
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(14.dp)
                            .size(width = 90.dp, height = 120.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isVideoOff) Color.Black else Color(0xFF334155)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isVideoOff) {
                            Icon(
                                imageVector = Icons.Default.VideocamOff,
                                contentDescription = "Cam Off",
                                tint = Color.White.copy(alpha = 0.6f)
                            )
                        } else {
                            Text(
                                text = if (language == AppLanguage.BN) "আপনার ক্যামেরা" else "Your Video",
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                // Live Prescription & Consultation Notes Box
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF1E293B)
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = if (language == AppLanguage.BN) "লাইভ প্রেসক্রিপশন নোট:" else "Live Digital Prescription Notes:",
                            color = TealContainer,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                        Spacer(modifier = Modifier.height(3.dp))
                        Text(
                            text = "Tab. Napa Extra 565mg (1+0+1) for 3 days. Drink 3L warm water and monitor body temp.",
                            color = Color.White,
                            fontSize = 11.sp
                        )
                    }
                }

                // Bottom Video Call Action Controls (Mute, Video, End Call)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Mute Toggle
                    IconButton(
                        onClick = { isMuted = !isMuted },
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(if (isMuted) Color.White else Color(0xFF334155))
                    ) {
                        Icon(
                            imageVector = if (isMuted) Icons.Default.MicOff else Icons.Default.Mic,
                            contentDescription = "Mute Toggle",
                            tint = if (isMuted) Color.Black else Color.White
                        )
                    }

                    // End Call Button
                    IconButton(
                        onClick = onClose,
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(RoseEmergency)
                            .testTag("end_video_call")
                    ) {
                        Icon(
                            imageVector = Icons.Default.CallEnd,
                            contentDescription = "End Call",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }

                    // Video Toggle
                    IconButton(
                        onClick = { isVideoOff = !isVideoOff },
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(if (isVideoOff) Color.White else Color(0xFF334155))
                    ) {
                        Icon(
                            imageVector = if (isVideoOff) Icons.Default.VideocamOff else Icons.Default.Videocam,
                            contentDescription = "Video Toggle",
                            tint = if (isVideoOff) Color.Black else Color.White
                        )
                    }
                }
            }
        }
    }
}
