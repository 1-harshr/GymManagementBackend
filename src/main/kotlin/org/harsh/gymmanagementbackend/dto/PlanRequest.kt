package org.harsh.gymmanagementbackend.dto

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreatePlanRequest(
    @field:NotBlank(message = "Plan name is required")
    val planName: String,

    @field:NotNull(message = "Price is required")
    @field:Min(value = 0, message = "Price must be non-negative")
    val price: Long,

    @field:NotNull(message = "Days alloted is required")
    @field:Min(value = 1, message = "Days alloted must be at least 1")
    val daysAlloted: Long
)

data class UpdatePlanRequest(
    @field:NotBlank(message = "Plan name must not be blank")
    val planName: String? = null,

    @field:Min(value = 0, message = "Price must be non-negative")
    val price: Long? = null,

    @field:Min(value = 1, message = "Days alloted must be at least 1")
    val daysAlloted: Long? = null,

    val isActive: Boolean? = null
)
