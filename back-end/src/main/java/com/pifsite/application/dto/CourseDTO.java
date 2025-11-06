package com.pifsite.application.dto;

import java.util.Set;
import java.util.UUID;

import com.pifsite.application.entities.Subject;

public record CourseDTO(UUID id, long countStudents, String courseName, Set<Subject> subjects) {}