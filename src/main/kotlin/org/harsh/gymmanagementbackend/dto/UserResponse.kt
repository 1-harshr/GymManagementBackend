package org.harsh.gymmanagementbackend.dto

import org.harsh.gymmanagementbackend.entity.UserRole
import java.time.OffsetDateTime

data class UserResponse(
    val userId: Long,
    val name: String,
    val phoneNumber: String,
    val email: String?,
    val createdAt: OffsetDateTime,
    val userRole: UserRole
)
