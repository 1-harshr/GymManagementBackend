package org.harsh.gymmanagementbackend.repository

import org.harsh.gymmanagementbackend.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository : JpaRepository<UserEntity, UUID>
