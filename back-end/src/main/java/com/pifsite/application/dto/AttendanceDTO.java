package com.pifsite.application.dto;

import java.time.OffsetDateTime;

public record AttendanceDTO(String username, String subjectName, OffsetDateTime attendanceDate, boolean presence) {
    
}
