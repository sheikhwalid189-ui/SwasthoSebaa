package com.example.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.EventAvailable
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.outlined.AutoAwesome
import androidx.compose.material.icons.outlined.EventAvailable
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LocalHospital
import androidx.compose.material.icons.outlined.MedicalServices
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppLanguage
import com.example.data.NavTab
import com.example.ui.theme.TealContainer
import com.example.ui.theme.TealPrimary

@Composable
fun BottomNavBar(
    currentTab: NavTab,
    onTabSelected: (NavTab) -> Unit,
    activeAppointmentsCount: Int,
    language: AppLanguage,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .testTag("bottom_navigation_bar"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        val navItemColors = NavigationBarItemDefaults.colors(
            selectedIconColor = MaterialTheme.colorScheme.primary,
            selectedTextColor = MaterialTheme.colorScheme.primary,
            indicatorColor = MaterialTheme.colorScheme.primaryContainer,
            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
        )

        // Tab 1: Home
        val homeSelected = currentTab == NavTab.HOME
        NavigationBarItem(
            selected = homeSelected,
            onClick = { onTabSelected(NavTab.HOME) },
            icon = {
                Icon(
                    imageVector = if (homeSelected) Icons.Filled.Home else Icons.Outlined.Home,
                    contentDescription = "Home Tab",
                    modifier = Modifier.size(22.dp)
                )
            },
            label = {
                Text(
                    text = if (language == AppLanguage.BN) "হোম" else "Home",
                    fontSize = 11.sp,
                    fontWeight = if (homeSelected) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = navItemColors,
            modifier = Modifier.testTag("bottom_nav_home")
        )

        // Tab 2: Doctors
        val doctorsSelected = currentTab == NavTab.DOCTORS
        NavigationBarItem(
            selected = doctorsSelected,
            onClick = { onTabSelected(NavTab.DOCTORS) },
            icon = {
                Icon(
                    imageVector = if (doctorsSelected) Icons.Filled.MedicalServices else Icons.Outlined.MedicalServices,
                    contentDescription = "Doctors Tab",
                    modifier = Modifier.size(22.dp)
                )
            },
            label = {
                Text(
                    text = if (language == AppLanguage.BN) "ডাক্তার" else "Doctors",
                    fontSize = 11.sp,
                    fontWeight = if (doctorsSelected) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = navItemColors,
            modifier = Modifier.testTag("bottom_nav_doctors")
        )

        // Tab 3: AI Assistant (Prominent single-hand reach center item)
        val aiSelected = currentTab == NavTab.AI_ASSISTANT
        NavigationBarItem(
            selected = aiSelected,
            onClick = { onTabSelected(NavTab.AI_ASSISTANT) },
            icon = {
                Icon(
                    imageVector = if (aiSelected) Icons.Filled.AutoAwesome else Icons.Outlined.AutoAwesome,
                    contentDescription = "AI Assistant Tab",
                    modifier = Modifier.size(23.dp)
                )
            },
            label = {
                Text(
                    text = if (language == AppLanguage.BN) "এআই সাহায্য" else "AI Health",
                    fontSize = 11.sp,
                    fontWeight = if (aiSelected) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = navItemColors,
            modifier = Modifier.testTag("bottom_nav_ai_assistant")
        )

        // Tab 4: Appointments (With badge for active bookings)
        val appointmentsSelected = currentTab == NavTab.APPOINTMENTS
        NavigationBarItem(
            selected = appointmentsSelected,
            onClick = { onTabSelected(NavTab.APPOINTMENTS) },
            icon = {
                if (activeAppointmentsCount > 0) {
                    BadgedBox(
                        badge = {
                            Badge(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = MaterialTheme.colorScheme.onPrimary
                            ) {
                                Text(text = "$activeAppointmentsCount", fontSize = 10.sp)
                            }
                        }
                    ) {
                        Icon(
                            imageVector = if (appointmentsSelected) Icons.Filled.EventAvailable else Icons.Outlined.EventAvailable,
                            contentDescription = "Appointments Tab",
                            modifier = Modifier.size(22.dp)
                        )
                    }
                } else {
                    Icon(
                        imageVector = if (appointmentsSelected) Icons.Filled.EventAvailable else Icons.Outlined.EventAvailable,
                        contentDescription = "Appointments Tab",
                        modifier = Modifier.size(22.dp)
                    )
                }
            },
            label = {
                Text(
                    text = if (language == AppLanguage.BN) "সিরিয়াল" else "Bookings",
                    fontSize = 11.sp,
                    fontWeight = if (appointmentsSelected) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = navItemColors,
            modifier = Modifier.testTag("bottom_nav_appointments")
        )

        // Tab 5: Services & More
        val servicesSelected = currentTab == NavTab.SERVICES
        NavigationBarItem(
            selected = servicesSelected,
            onClick = { onTabSelected(NavTab.SERVICES) },
            icon = {
                Icon(
                    imageVector = if (servicesSelected) Icons.Filled.LocalHospital else Icons.Outlined.LocalHospital,
                    contentDescription = "Services Tab",
                    modifier = Modifier.size(22.dp)
                )
            },
            label = {
                Text(
                    text = if (language == AppLanguage.BN) "সেবাসমূহ" else "Services",
                    fontSize = 11.sp,
                    fontWeight = if (servicesSelected) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = navItemColors,
            modifier = Modifier.testTag("bottom_nav_services")
        )
    }
}
