package com.pifsite.application.dto;

import com.pifsite.application.enums.UserRoles;

import java.util.UUID;

public record UserDTO(UUID id, String username, String email, UserRoles role) {}
