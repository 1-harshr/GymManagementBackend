package org.harsh.gymmanagementbackend.controller

import jakarta.validation.Valid
import org.harsh.gymmanagementbackend.dto.CreatePlanRequest
import org.harsh.gymmanagementbackend.dto.PlanResponse
import org.harsh.gymmanagementbackend.dto.UpdatePlanRequest
import org.harsh.gymmanagementbackend.service.PlanService
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/plans")
class PlansController(private val planService: PlanService) {

    @GetMapping
    fun getAll(
        @RequestParam name: String? = null,
        @RequestParam isActive: Boolean? = null
    ): List<PlanResponse> = planService.getAll(name, isActive)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody request: CreatePlanRequest,
        authentication: Authentication
    ): PlanResponse = planService.create(request, authentication.name)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdatePlanRequest
    ): PlanResponse = planService.update(id, request)
}
