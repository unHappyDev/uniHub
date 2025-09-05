package com.pifsite.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.Set;

public record CreateClassroomDTO(UUID professorId, UUID subjectId, String semester, OffsetDateTime startAt, OffsetDateTime endAt, Set<UUID> studentsIds) {

}
