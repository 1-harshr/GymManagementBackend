package org.harsh.gymmanagementbackend.repository

import org.harsh.gymmanagementbackend.entity.MembershipEntity
import org.springframework.data.jpa.repository.JpaRepository

interface MembershipRepository : JpaRepository<MembershipEntity, Long> {
    fun findByMemberId(memberId: Long): List<MembershipEntity>
}
