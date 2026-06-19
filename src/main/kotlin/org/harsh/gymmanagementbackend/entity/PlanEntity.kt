package org.harsh.gymmanagementbackend.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.OffsetDateTime

@Entity
@Table(name = "plans")
class PlanEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "plan_name", nullable = false)
    var planName: String,

    @Column(nullable = false)
    var price: Long,

    @Column(name = "days_alloted", nullable = false)
    var daysAlloted: Long,

    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true,

    @Column(name = "created_by", nullable = false)
    val createdBy: Long,

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now()
)
