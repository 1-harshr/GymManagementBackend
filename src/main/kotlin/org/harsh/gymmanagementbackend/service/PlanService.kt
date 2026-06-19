package org.harsh.gymmanagementbackend.service

import org.harsh.gymmanagementbackend.dto.CreatePlanRequest
import org.harsh.gymmanagementbackend.dto.PlanResponse
import org.harsh.gymmanagementbackend.dto.UpdatePlanRequest
import org.harsh.gymmanagementbackend.entity.PlanEntity
import org.harsh.gymmanagementbackend.mapper.toResponse
import org.harsh.gymmanagementbackend.repository.PlanRepository
import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlanService(
    private val planRepository: PlanRepository,
    private val userRepository: UserRepository
) {

    fun getAll(name: String?, isActive: Boolean?): List<PlanResponse> {
        return when {
            name != null && isActive != null ->
                planRepository.findByPlanNameContainingIgnoreCaseAndIsActive(name, isActive)
            name != null ->
                planRepository.findByPlanNameContainingIgnoreCase(name)
            isActive != null ->
                planRepository.findByIsActive(isActive)
            else ->
                planRepository.findAll()
        }.map { it.toResponse() }
    }

    fun create(request: CreatePlanRequest, callerPhoneNumber: String): PlanResponse {
        val caller = userRepository.findByPhoneNumber(callerPhoneNumber)
            .orElseThrow { UsernameNotFoundException("User not found") }
        return planRepository.save(
            PlanEntity(
                planName = request.planName,
                price = request.price,
                daysAlloted = request.daysAlloted,
                createdBy = caller.userId
            )
        ).toResponse()
    }

    @Transactional
    fun update(id: Long, request: UpdatePlanRequest): PlanResponse {
        val plan = planRepository.findById(id)
            .orElseThrow { NoSuchElementException("Plan $id not found") }
        request.planName?.let { plan.planName = it }
        request.price?.let { plan.price = it }
        request.daysAlloted?.let { plan.daysAlloted = it }
        request.isActive?.let { plan.isActive = it }
        return plan.toResponse()
    }
}
