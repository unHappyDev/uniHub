package com.pifsite.application.dto;

import java.util.List;
import java.util.UUID;

public record CourseSubjectsDTO(String courseName, List<UUID> subjects) {}
