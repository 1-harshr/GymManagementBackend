package org.harsh.gymmanagementbackend.controller

import org.harsh.gymmanagementbackend.dto.AttendanceResponse
import org.harsh.gymmanagementbackend.service.AttendanceService
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/attendance")
class AttendanceController(private val attendanceService: AttendanceService) {

    @GetMapping
    fun getAttendance(): List<AttendanceResponse> = attendanceService.getAll()

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'GOD')")
    fun markAttendance(@PathVariable userId: Long): AttendanceResponse =
        attendanceService.mark(userId)
}
