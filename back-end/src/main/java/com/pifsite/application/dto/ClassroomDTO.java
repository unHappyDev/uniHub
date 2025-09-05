package com.pifsite.application.dto;


import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.Set;

public record ClassroomDTO(UUID classroomId, String professor, String subject, String semester, OffsetDateTime startAt, OffsetDateTime endAt, Set<ClassroomStudentDTO> students) {}
