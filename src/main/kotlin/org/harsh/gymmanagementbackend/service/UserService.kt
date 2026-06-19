package org.harsh.gymmanagementbackend.service

import org.harsh.gymmanagementbackend.dto.CreateUserRequest
import org.harsh.gymmanagementbackend.dto.UpdateUserRequest
import org.harsh.gymmanagementbackend.dto.UserResponse
import org.harsh.gymmanagementbackend.mapper.toEntity
import org.harsh.gymmanagementbackend.mapper.toResponse
import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun create(request: CreateUserRequest): UserResponse =
        userRepository.save(request.toEntity(passwordEncoder.encode(request.password)!!)).toResponse()

    @Transactional
    fun update(id: Long, request: UpdateUserRequest): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { NoSuchElementException("User $id not found") }
        request.name?.let { user.name = it }
        request.phoneNumber?.let { user.phoneNumber = it }
        request.email?.let { user.email = it }
        request.userRole?.let { user.userRole = it }
        return user.toResponse()
    }

    fun delete(id: Long) {
        if (!userRepository.existsById(id)) throw NoSuchElementException("User $id not found")
        userRepository.deleteById(id)
    }

    fun getAll(): List<UserResponse> = userRepository.findAll().map { it.toResponse() }

    fun getById(id: Long): UserResponse = userRepository.findById(id)
        .orElseThrow { NoSuchElementException("User $id not found") }
        .toResponse()
}
