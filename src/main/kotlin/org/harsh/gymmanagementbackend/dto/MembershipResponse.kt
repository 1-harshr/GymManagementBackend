package org.harsh.gymmanagementbackend.dto

import java.time.OffsetDateTime

data class UserMemberShipDto(
    val subscriptionId: Long,
    val memberId: Long,
    val planId: Long,
    val startDate: OffsetDateTime,
    val endDate: OffsetDateTime,
    val createdBy: Long,
    val createdAt: OffsetDateTime
)
