package com.pifsite.application.dto;

import java.util.UUID;
import java.util.Set;

public record ClassroomDTO(UUID classroomId, UUID professorId, String professor, String subject, String semester,
        Set<ClassroomScheduleDTO> schedules,
        Set<ClassroomStudentDTO> students) {
}
