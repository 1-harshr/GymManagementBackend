package org.harsh.gymmanagementbackend.dto

import java.time.OffsetDateTime

data class PlanResponse(
    val id: Long,
    val planName: String,
    val price: Long,
    val daysAlloted: Long,
    val isActive: Boolean,
    val createdBy: Long,
    val createdAt: OffsetDateTime
)
