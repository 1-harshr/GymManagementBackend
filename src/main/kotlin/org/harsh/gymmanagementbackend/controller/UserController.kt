package org.harsh.gymmanagementbackend.controller

import org.harsh.gymmanagementbackend.dto.CreateUserRequest
import org.harsh.gymmanagementbackend.dto.UpdateUserRequest
import org.harsh.gymmanagementbackend.dto.UserResponse
import org.harsh.gymmanagementbackend.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun getAll(): List<UserResponse> = userService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): UserResponse = userService.getById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: CreateUserRequest): UserResponse = userService.create(request)

    @PatchMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdateUserRequest): UserResponse =
        userService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = userService.delete(id)
}
