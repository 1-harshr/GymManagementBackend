package org.harsh.gymmanagementbackend.controller

import jakarta.validation.Valid
import org.harsh.gymmanagementbackend.dto.MembershipRequestDto
import org.harsh.gymmanagementbackend.dto.UserMemberShipDto
import org.harsh.gymmanagementbackend.service.MembershipService
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/memberships")
@PreAuthorize("hasAnyRole('ADMIN', 'GOD')")
class MembershipController(private val membershipService: MembershipService) {

    @GetMapping
    fun getAllMemberships(): List<UserMemberShipDto> = membershipService.getAll()

    @GetMapping("/{id}")
    fun getUserMembership(@PathVariable id: Long): UserMemberShipDto = membershipService.getById(id)

    @PostMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    fun createUserMembership(
        @PathVariable id: Long,
        @Valid @RequestBody request: MembershipRequestDto,
        authentication: Authentication
    ): UserMemberShipDto = membershipService.create(id, request, authentication.name)
}
