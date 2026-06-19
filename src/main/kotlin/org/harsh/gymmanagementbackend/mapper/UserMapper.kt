package org.harsh.gymmanagementbackend.mapper

import org.harsh.gymmanagementbackend.dto.CreateUserRequest
import org.harsh.gymmanagementbackend.dto.UserResponse
import org.harsh.gymmanagementbackend.entity.UserEntity

fun CreateUserRequest.toEntity(encodedPassword: String) = UserEntity(
    name = name,
    phoneNumber = phoneNumber,
    email = email,
    hashedPassword = encodedPassword,
    userRole = userRole
)

fun UserEntity.toResponse() = UserResponse(
    userId = userId,
    name = name,
    phoneNumber = phoneNumber,
    email = email,
    createdAt = createdAt,
    userRole = userRole
)
