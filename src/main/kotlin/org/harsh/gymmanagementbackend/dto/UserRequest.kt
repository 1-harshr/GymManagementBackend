package org.harsh.gymmanagementbackend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import org.harsh.gymmanagementbackend.entity.UserRole

data class CreateUserRequest(
    @field:NotBlank(message = "Name is required")
    val name: String,

    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid")
    val phoneNumber: String,

    @field:Email(message = "Email must be valid")
    val email: String? = null,

    @field:NotBlank(message = "Password is required")
    val password: String,

    val userRole: UserRole = UserRole.MEMBER
)

data class UpdateUserRequest(
    @field:NotBlank(message = "Name must not be blank")
    val name: String? = null,

    @field:Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid")
    val phoneNumber: String? = null,

    @field:Email(message = "Email must be valid")
    val email: String? = null,

    val userRole: UserRole? = null
)
