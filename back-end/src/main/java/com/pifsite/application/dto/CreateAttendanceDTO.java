package com.pifsite.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CreateAttendanceDTO(UUID studentId, UUID classroomId, OffsetDateTime attendanceDate, boolean presence) {}
