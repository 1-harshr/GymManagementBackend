package org.harsh.gymmanagementbackend.service

import org.harsh.gymmanagementbackend.dto.CreateUserRequest
import org.harsh.gymmanagementbackend.dto.UpdateUserRequest
import org.harsh.gymmanagementbackend.dto.UserResponse
import org.harsh.gymmanagementbackend.mapper.toEntity
import org.harsh.gymmanagementbackend.mapper.toResponse
import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserService(private val userRepository: UserRepository) {

    fun create(request: CreateUserRequest): UserResponse =
        userRepository.save(request.toEntity()).toResponse()

    @Transactional
    fun update(id: UUID, request: UpdateUserRequest): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { NoSuchElementException("User $id not found") }
        request.name?.let { user.name = it }
        request.email?.let { user.email = it }
        request.phoneNumber?.let { user.phoneNumber = it }
        request.bloodGroup?.let { user.bloodGroup = it }
        request.role?.let { user.role = it }
        return user.toResponse()
    }

    fun delete(id: UUID) {
        if (!userRepository.existsById(id)) throw NoSuchElementException("User $id not found")
        userRepository.deleteById(id)
    }

    fun getAll(): List<UserResponse> = userRepository.findAll().map { it.toResponse() }

    fun getById(id: UUID): UserResponse = userRepository.findById(id)
        .orElseThrow { NoSuchElementException("User $id not found") }
        .toResponse()
}
