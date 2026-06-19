package org.harsh.gymmanagementbackend.service

import org.harsh.gymmanagementbackend.dto.MembershipRequestDto
import org.harsh.gymmanagementbackend.dto.UserMemberShipDto
import org.harsh.gymmanagementbackend.entity.MembershipEntity
import org.harsh.gymmanagementbackend.mapper.toResponse
import org.harsh.gymmanagementbackend.repository.MembershipRepository
import org.harsh.gymmanagementbackend.repository.PlanRepository
import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class MembershipService(
    private val membershipRepository: MembershipRepository,
    private val planRepository: PlanRepository,
    private val userRepository: UserRepository
) {

    fun getAll(): List<UserMemberShipDto> =
        membershipRepository.findAll().map { it.toResponse(daysAllotedFor(it.planId)) }

    fun getById(subscriptionId: Long): UserMemberShipDto {
        val membership = membershipRepository.findById(subscriptionId)
            .orElseThrow { NoSuchElementException("Membership $subscriptionId not found") }
        return membership.toResponse(daysAllotedFor(membership.planId))
    }

    fun create(memberId: Long, request: MembershipRequestDto, callerPhoneNumber: String): UserMemberShipDto {
        val caller = userRepository.findByPhoneNumber(callerPhoneNumber)
            .orElseThrow { UsernameNotFoundException("User not found") }
        val plan = planRepository.findById(request.planId)
            .orElseThrow { NoSuchElementException("Plan ${request.planId} not found") }
        val membership = membershipRepository.save(
            MembershipEntity(
                memberId = memberId,
                planId = plan.id,
                startDate = request.startDate,
                createdBy = caller.userId
            )
        )
        return membership.toResponse(plan.daysAlloted)
    }

    private fun daysAllotedFor(planId: Long): Long =
        planRepository.findById(planId)
            .orElseThrow { NoSuchElementException("Plan $planId not found") }
            .daysAlloted
}
