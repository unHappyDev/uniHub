package com.pifsite.application.dto;

import java.util.UUID;

public record CreateProfessorDTO(UUID userId, CreateUserDTO registerUser) {}
