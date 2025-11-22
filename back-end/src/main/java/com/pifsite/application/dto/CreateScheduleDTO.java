package com.pifsite.application.dto;

import java.util.Set;
import java.util.UUID;

public record CreateScheduleDTO(Set<ClassroomScheduleDTO> schedules, UUID classroomId) {

}
