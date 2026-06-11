package org.harsh.gymmanagementbackend.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "users")
class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var phoneNumber: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var bloodGroup: BloodGroup,

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    var joinedDate: LocalDate = LocalDate.now(),

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole = UserRole.USER
)
