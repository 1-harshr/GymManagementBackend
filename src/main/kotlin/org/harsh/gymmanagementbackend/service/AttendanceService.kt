package org.harsh.gymmanagementbackend.service

import org.harsh.gymmanagementbackend.dto.AttendanceResponse
import org.harsh.gymmanagementbackend.entity.AttendanceEntity
import org.harsh.gymmanagementbackend.mapper.toResponse
import org.harsh.gymmanagementbackend.repository.AttendanceRepository
import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val userRepository: UserRepository
) {

    fun getAll(): List<AttendanceResponse> =
        attendanceRepository.findAll().map { it.toResponse() }

    fun mark(memberId: Long): AttendanceResponse {
        if (!userRepository.existsById(memberId)) throw NoSuchElementException("User $memberId not found")
        return attendanceRepository.save(AttendanceEntity(userId = memberId)).toResponse()
    }
}
