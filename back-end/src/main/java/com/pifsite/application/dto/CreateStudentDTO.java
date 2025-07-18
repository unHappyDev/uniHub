package com.pifsite.application.dto;

import java.util.UUID;

public record CreateStudentDTO(CreateUserDTO registerUser, UUID courseId) {}
