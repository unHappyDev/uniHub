package com.pifsite.application.dto;

import java.util.UUID;
import java.util.Set;
import java.sql.Time;

public record CreateClassroomDTO(UUID professorId, UUID subjectId, String semester, Time startAt, Time endAt, Set<UUID> studentsIds) {

}
