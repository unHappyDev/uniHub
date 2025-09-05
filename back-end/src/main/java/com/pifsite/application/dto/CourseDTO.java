package com.pifsite.application.dto;

import java.util.Set;

import com.pifsite.application.entities.Subject;

public record CourseDTO(String courseName, Set<Subject> subjects) {}
