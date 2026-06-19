package org.harsh.gymmanagementbackend.security

import org.harsh.gymmanagementbackend.repository.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(private val userRepository: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(phoneNumber: String): UserDetails {
        val user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow { UsernameNotFoundException("User not found: $phoneNumber") }
        return User(
            user.phoneNumber,
            user.hashedPassword,
            listOf(SimpleGrantedAuthority("ROLE_${user.userRole.name}"))
        )
    }
}
