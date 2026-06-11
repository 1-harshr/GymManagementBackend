package org.harsh.gymmanagementbackend.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Base64
import java.util.Date

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {

    private val signingKey by lazy {
        Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret))
    }

    fun generateToken(userDetails: UserDetails): String = Jwts.builder()
        .subject(userDetails.username)
        .issuedAt(Date())
        .expiration(Date(System.currentTimeMillis() + expiration))
        .signWith(signingKey)
        .compact()

    fun extractUsername(token: String): String = Jwts.parser()
        .verifyWith(signingKey)
        .build()
        .parseSignedClaims(token)
        .payload
        .subject

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean = runCatching {
        extractUsername(token) == userDetails.username &&
            !Jwts.parser().verifyWith(signingKey).build()
                .parseSignedClaims(token).payload.expiration.before(Date())
    }.getOrDefault(false)
}
