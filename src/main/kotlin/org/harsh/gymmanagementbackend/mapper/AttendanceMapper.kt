package org.harsh.gymmanagementbackend.mapper

import org.harsh.gymmanagementbackend.dto.AttendanceResponse
import org.harsh.gymmanagementbackend.entity.AttendanceEntity

fun AttendanceEntity.toResponse() = AttendanceResponse(
    attendanceId = attendanceId,
    userId = userId,
    createdAt = createdAt
)
