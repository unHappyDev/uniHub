package com.pifsite.application.dto;

import java.util.UUID;

import com.pifsite.application.enums.UserRoles;

public record UserDTO(UUID id, String username, String email, UserRoles role) {
}
