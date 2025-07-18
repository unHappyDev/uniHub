package com.pifsite.application.dto;

import com.pifsite.application.enums.UserRoles;

import java.util.UUID;

public record UserDTO(UUID userId, String name, String email, UserRoles role) {}
