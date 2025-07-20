package com.pifsite.application.dto;

import java.util.UUID;
import java.util.Set;
import java.time.OffsetDateTime;

public record CreateClassroomDTO(UUID professorId, UUID subjectId, String semester, OffsetDateTime startAt, OffsetDateTime endAt, Set<UUID> studentsIds) {

}
