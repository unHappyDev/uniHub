package com.pifsite.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AttendanceDTO(UUID id, String username, String subjectName, OffsetDateTime attendanceDate, boolean presence) {
    
}
