package org.harsh.gymmanagementbackend.repository

import org.harsh.gymmanagementbackend.entity.PlanEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PlanRepository : JpaRepository<PlanEntity, Long> {
    fun findByIsActive(isActive: Boolean): List<PlanEntity>
    fun findByPlanNameContainingIgnoreCaseAndIsActive(planName: String, isActive: Boolean): List<PlanEntity>
    fun findByPlanNameContainingIgnoreCase(planName: String): List<PlanEntity>
}
