package org.harsh.gymmanagementbackend.dto

import jakarta.validation.constraints.NotNull
import java.time.OffsetDateTime

data class MembershipRequestDto(
    @field:NotNull(message = "Plan ID is required")
    val planId: Long,

    @field:NotNull(message = "Start date is required")
    val startDate: OffsetDateTime
)
