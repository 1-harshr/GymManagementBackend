package org.harsh.gymmanagementbackend.repository

import org.harsh.gymmanagementbackend.entity.AttendanceEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AttendanceRepository : JpaRepository<AttendanceEntity, Long> {
    fun findByUserId(userId: Long): List<AttendanceEntity>
}
