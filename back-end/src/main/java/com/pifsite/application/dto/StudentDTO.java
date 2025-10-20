package com.pifsite.application.dto;

import java.util.UUID;

import com.pifsite.application.security.UserRoles;

public record StudentDTO(UUID id, String username, String email, UserRoles role, String courseName) {
    
}
