package com.pifsite.application.dto;

import java.util.UUID;
import java.util.Set;

public record CreateClassroomDTO(UUID professorId, UUID subjectId, String semester, Set<ClassroomScheduleDTO> schedules,
        Set<UUID> studentsIds) {

}
