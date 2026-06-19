package org.harsh.gymmanagementbackend.dto

import java.time.OffsetDateTime

data class AttendanceResponse(
    val attendanceId: Long,
    val userId: Long,
    val createdAt: OffsetDateTime
)
