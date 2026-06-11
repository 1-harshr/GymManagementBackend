package org.harsh.gymmanagementbackend.controller

import jakarta.validation.Valid
import org.harsh.gymmanagementbackend.dto.AuthResponse
import org.harsh.gymmanagementbackend.dto.LoginRequest
import org.harsh.gymmanagementbackend.security.JwtService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val jwtService: JwtService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val userDetails = userDetailsService.loadUserByUsername(request.email)
        return AuthResponse(token = jwtService.generateToken(userDetails))
    }
}
