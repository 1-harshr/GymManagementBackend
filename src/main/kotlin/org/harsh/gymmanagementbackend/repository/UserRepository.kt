package org.harsh.gymmanagementbackend.repository

import org.harsh.gymmanagementbackend.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface UserRepository : JpaRepository<UserEntity, Long> {
    fun findByPhoneNumber(phoneNumber: String): Optional<UserEntity>
    fun findByName(name: String): Optional<UserEntity>
}
