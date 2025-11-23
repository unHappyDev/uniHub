package com.pifsite.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AttendanceDTO(UUID id, UUID studentId, String username, UUID classroomId, String subjectName, ClassroomScheduleDTO schedule, OffsetDateTime attendanceDate, boolean presence) {}
