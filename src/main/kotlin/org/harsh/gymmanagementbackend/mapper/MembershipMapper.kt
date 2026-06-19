package org.harsh.gymmanagementbackend.mapper

import org.harsh.gymmanagementbackend.dto.UserMemberShipDto
import org.harsh.gymmanagementbackend.entity.MembershipEntity

fun MembershipEntity.toResponse(daysAlloted: Long) = UserMemberShipDto(
    subscriptionId = subscriptionId,
    memberId = memberId,
    planId = planId,
    startDate = startDate,
    endDate = startDate.plusDays(daysAlloted),
    createdBy = createdBy,
    createdAt = createdAt
)
