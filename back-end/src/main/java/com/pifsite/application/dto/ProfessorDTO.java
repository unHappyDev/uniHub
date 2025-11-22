package com.pifsite.application.dto;

import java.util.Set;
import java.util.UUID;

import com.pifsite.application.enums.UserRoles;

public record ProfessorDTO(UUID id, String username, String email, UserRoles role, Set<SmallClassroomDTO> classrooms) {

}
