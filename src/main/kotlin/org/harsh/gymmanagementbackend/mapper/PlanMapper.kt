package org.harsh.gymmanagementbackend.mapper

import org.harsh.gymmanagementbackend.dto.PlanResponse
import org.harsh.gymmanagementbackend.entity.PlanEntity

fun PlanEntity.toResponse() = PlanResponse(
    id = id,
    planName = planName,
    price = price,
    daysAlloted = daysAlloted,
    isActive = isActive,
    createdBy = createdBy,
    createdAt = createdAt
)
