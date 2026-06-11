package org.harsh.gymmanagementbackend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.harsh.gymmanagementbackend.entity.BloodGroup
import org.harsh.gymmanagementbackend.entity.UserRole
import java.time.LocalDate
import java.util.UUID

data class CreateUserRequest(
    @field:NotBlank(message = "Name is required")
    val name: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Email must be valid")
    val email: String,

    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid")
    val phoneNumber: String,

    @field:NotBlank(message = "Password is required")
    val password: String,

    @field:NotNull(message = "Blood group is required")
    val bloodGroup: BloodGroup,

    val role: UserRole = UserRole.USER
)

data class UpdateUserRequest(
    @field:NotBlank(message = "Name must not be blank")
    val name: String?,

    @field:Email(message = "Email must be valid")
    @field:NotBlank(message = "Email must not be blank")
    val email: String?,

    @field:Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid")
    @field:NotBlank(message = "Phone number must not be blank")
    val phoneNumber: String?,

    val bloodGroup: BloodGroup?,

    val role: UserRole?
)

data class UserResponse(
    val id: UUID,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val bloodGroup: BloodGroup,
    val joinedDate: LocalDate,
    val role: UserRole
)
