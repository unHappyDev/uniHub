package com.pifsite.application.dto;

import java.util.UUID;

public record StudentsAttendanceDTO(UUID studentId, String username, UUID classroomId, String subjectName, long numAbsences) {}
