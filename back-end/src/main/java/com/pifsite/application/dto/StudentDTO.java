package com.pifsite.application.dto;

import com.pifsite.application.security.UserRoles;

public record StudentDTO(String username, String email, UserRoles role, String courseName) {
    
}
