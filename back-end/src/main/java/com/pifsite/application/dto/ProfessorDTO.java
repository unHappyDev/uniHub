package com.pifsite.application.dto;

import java.util.Set;

import com.pifsite.application.security.UserRoles;

public record ProfessorDTO(String username, String email, UserRoles role, Set<SmallClassroomDTO> classrooms) {
    
}
