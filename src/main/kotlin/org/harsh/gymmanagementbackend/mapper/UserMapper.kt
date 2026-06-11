package org.harsh.gymmanagementbackend.mapper

import org.harsh.gymmanagementbackend.dto.CreateUserRequest
import org.harsh.gymmanagementbackend.dto.UserResponse
import org.harsh.gymmanagementbackend.entity.UserEntity

fun CreateUserRequest.toEntity(encodedPassword: String) = UserEntity(
    name = name,
    email = email,
    phoneNumber = phoneNumber,
    password = encodedPassword,
    bloodGroup = bloodGroup,
    role = role
)

fun UserEntity.toResponse() = UserResponse(
    id = id,
    name = name,
    email = email,
    phoneNumber = phoneNumber,
    bloodGroup = bloodGroup,
    joinedDate = joinedDate,
    role = role
)
