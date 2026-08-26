package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.NavTab
import com.example.ui.components.BookAppointmentDialog
import com.example.ui.components.BottomNavBar
import com.example.ui.components.EmergencyHotlineSheet
import com.example.ui.components.NotificationCenterSheet
import com.example.ui.components.SimulatedPushBanner
import com.example.ui.components.SwasthoTopBar
import com.example.ui.screens.AiAssistantScreen
import com.example.ui.screens.AppointmentsScreen
import com.example.ui.screens.DoctorsScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.ServicesScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.TealPrimary
import com.example.ui.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()
            MyApplicationTheme(darkTheme = isDarkMode, dynamicColor = false) {
                SwasthoSebaApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun SwasthoSebaApp(viewModel: MainViewModel) {
    val currentTab by viewModel.currentTab.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val doctors by viewModel.doctors.collectAsStateWithLifecycle()
    val doctorSearchQuery by viewModel.doctorSearchQuery.collectAsStateWithLifecycle()
    val selectedSpecialty by viewModel.selectedSpecialty.collectAsStateWithLifecycle()
    val healthTips by viewModel.healthTips.collectAsStateWithLifecycle()
    val selectedTipCategory by viewModel.selectedTipCategory.collectAsStateWithLifecycle()
    val appointments by viewModel.appointments.collectAsStateWithLifecycle()
    val bloodDonors by viewModel.bloodDonors.collectAsStateWithLifecycle()
    val selectedBloodGroup by viewModel.selectedBloodGroup.collectAsStateWithLifecycle()
    val ambulances by viewModel.ambulances.collectAsStateWithLifecycle()
    val medicines by viewModel.medicines.collectAsStateWithLifecycle()
    val prescriptions by viewModel.prescriptions.collectAsStateWithLifecycle()
    val emergencyContacts by viewModel.emergencyContacts.collectAsStateWithLifecycle()
    val bookingDoctor by viewModel.bookingDoctor.collectAsStateWithLifecycle()
    val showEmergencySheet by viewModel.showEmergencySheet.collectAsStateWithLifecycle()
    val toastMessage by viewModel.toastMessage.collectAsStateWithLifecycle()
    val chatMessages by viewModel.chatMessages.collectAsStateWithLifecycle()
    val isAiThinking by viewModel.isAiThinking.collectAsStateWithLifecycle()

    val notifications by viewModel.notifications.collectAsStateWithLifecycle()
    val activeHeadsUpPush by viewModel.activeHeadsUpPush.collectAsStateWithLifecycle()
    val unreadNotificationsCount by viewModel.unreadNotificationsCount.collectAsStateWithLifecycle()
    val reminderSettings by viewModel.reminderSettings.collectAsStateWithLifecycle()

    var showNotificationCenterSheet by remember { mutableStateOf(false) }

    val activeAppointmentsCount = appointments.count { it.status == "Confirmed" }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .testTag("app_root_layout"),
        topBar = {
            SwasthoTopBar(
                language = language,
                onToggleLanguage = { viewModel.toggleLanguage() },
                isDarkMode = isDarkMode,
                onToggleTheme = { viewModel.toggleDarkMode() },
                unreadNotificationsCount = unreadNotificationsCount,
                onNotificationClick = { showNotificationCenterSheet = true },
                onEmergencyClick = { viewModel.toggleEmergencySheet(true) }
            )
        },
        bottomBar = {
            BottomNavBar(
                currentTab = currentTab,
                onTabSelected = { viewModel.selectTab(it) },
                activeAppointmentsCount = activeAppointmentsCount,
                language = language
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Main Screen Content
            when (currentTab) {
                NavTab.HOME -> {
                    HomeScreen(
                        doctors = doctors,
                        healthTips = healthTips,
                        selectedTipCategory = selectedTipCategory,
                        onTipCategorySelected = { viewModel.setTipCategory(it) },
                        onToggleBookmark = { viewModel.toggleTipBookmark(it) },
                        onClapTip = { viewModel.clapTip(it) },
                        onSelectDoctorForBooking = {
                            viewModel.openBooking(it)
                        },
                        onNavigateTab = { viewModel.selectTab(it) },
                        onSearchSubmit = { query ->
                            viewModel.setDoctorSearchQuery(query)
                            if (query.isNotBlank()) {
                                viewModel.selectTab(NavTab.DOCTORS)
                            }
                        },
                        onEmergencyClick = { viewModel.toggleEmergencySheet(true) },
                        language = language
                    )
                }

                NavTab.DOCTORS -> {
                    DoctorsScreen(
                        doctors = doctors,
                        searchQuery = doctorSearchQuery,
                        onSearchChange = { viewModel.setDoctorSearchQuery(it) },
                        selectedSpecialty = selectedSpecialty,
                        onSpecialtySelected = { viewModel.setSelectedSpecialty(it) },
                        onBookDoctor = { viewModel.openBooking(it) },
                        language = language
                    )
                }

                NavTab.AI_ASSISTANT -> {
                    AiAssistantScreen(
                        messages = chatMessages,
                        isThinking = isAiThinking,
                        onSendMessage = { viewModel.sendAiMessage(it) },
                        language = language
                    )
                }

                NavTab.APPOINTMENTS -> {
                    AppointmentsScreen(
                        appointments = appointments,
                        onCancelAppointment = { viewModel.cancelAppointment(it) },
                        onNavigateToDoctors = { viewModel.selectTab(NavTab.DOCTORS) },
                        onSimulate15Min = { viewModel.simulate15MinuteReminder(it) },
                        onSimulate1Hour = { viewModel.simulate1HourReminder(it) },
                        onSimulateDoctorWaiting = { viewModel.simulateDoctorWaitingInRoom(it) },
                        onOpenNotificationCenter = { showNotificationCenterSheet = true },
                        language = language
                    )
                }

                NavTab.SERVICES -> {
                    ServicesScreen(
                        ambulances = ambulances,
                        bloodDonors = bloodDonors,
                        selectedBloodGroup = selectedBloodGroup,
                        onBloodGroupSelected = { viewModel.setBloodGroupFilter(it) },
                        medicines = medicines,
                        prescriptions = prescriptions,
                        onAddPrescription = { doc, hosp, diag, meds, notes ->
                            viewModel.addPrescription(doc, hosp, diag, meds, notes)
                        },
                        onOrderMedicine = { med ->
                            viewModel.showToast("Order placed for ${med.brandName} (৳${med.priceBdt})")
                        },
                        language = language
                    )
                }
            }

            // Simulated Heads-Up Push Notification Banner (Top Overlay)
            SimulatedPushBanner(
                notification = activeHeadsUpPush,
                language = language,
                onDismiss = { viewModel.dismissHeadsUpPush() },
                onOpenAppointment = { appointmentId ->
                    viewModel.dismissHeadsUpPush()
                    viewModel.selectTab(NavTab.APPOINTMENTS)
                },
                onJoinVideoCall = { appointmentId ->
                    viewModel.dismissHeadsUpPush()
                    viewModel.selectTab(NavTab.APPOINTMENTS)
                },
                modifier = Modifier.align(Alignment.TopCenter)
            )

            // In-App Toast Alert Popup
            AnimatedVisibility(
                visible = toastMessage != null,
                enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp, start = 16.dp, end = 16.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color(0xFF0F172A),
                    shadowElevation = 6.dp,
                    modifier = Modifier.clip(RoundedCornerShape(14.dp))
                ) {
                    Text(
                        text = toastMessage ?: "",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
                    )
                }
            }
        }
    }

    // Notification Center Bottom Sheet
    if (showNotificationCenterSheet) {
        NotificationCenterSheet(
            notifications = notifications,
            appointments = appointments,
            reminderSettings = reminderSettings,
            language = language,
            onDismiss = { showNotificationCenterSheet = false },
            onMarkRead = { viewModel.markNotificationRead(it) },
            onMarkAllRead = { viewModel.markAllNotificationsRead() },
            onClearAll = { viewModel.clearAllNotifications() },
            onDeleteNotification = { viewModel.deleteNotification(it) },
            onSimulate15Min = { viewModel.simulate15MinuteReminder(it) },
            onSimulate1Hour = { viewModel.simulate1HourReminder(it) },
            onSimulateDoctorWaiting = { viewModel.simulateDoctorWaitingInRoom(it) },
            onSimulate24Hour = { viewModel.simulate24HourReminder(it) },
            onUpdateSettings = { viewModel.updateReminderSettings(it) },
            onOpenAppointment = { appointmentId ->
                showNotificationCenterSheet = false
                viewModel.selectTab(NavTab.APPOINTMENTS)
            },
            onJoinVideoCall = { appointmentId ->
                showNotificationCenterSheet = false
                viewModel.selectTab(NavTab.APPOINTMENTS)
            }
        )
    }

    // Emergency Hotlines Sheet
    if (showEmergencySheet) {
        EmergencyHotlineSheet(
            contacts = emergencyContacts,
            language = language,
            onDismiss = { viewModel.toggleEmergencySheet(false) }
        )
    }

    // Doctor Consultation Booking Dialog
    if (bookingDoctor != null) {
        BookAppointmentDialog(
            doctor = bookingDoctor!!,
            language = language,
            onDismiss = { viewModel.closeBooking() },
            onConfirm = { name, phone, date, slot, type ->
                viewModel.confirmBooking(bookingDoctor!!, name, phone, date, slot, type)
            }
        )
    }
}
