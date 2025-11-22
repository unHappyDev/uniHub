package com.pifsite.application.dto;

import java.util.UUID;

public record CreateStudentDTO(UUID userId, CreateUserDTO registerUser, UUID courseId) {}
