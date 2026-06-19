package org.harsh.gymmanagementbackend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class LoginRequest(
    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid")
    val phoneNumber: String,

    @field:NotBlank(message = "Password is required")
    val password: String
)

data class AuthResponse(
    val token: String
)
