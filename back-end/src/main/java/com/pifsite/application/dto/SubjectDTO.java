package com.pifsite.application.dto;

import java.util.UUID;

public record SubjectDTO(UUID subjectId, String subjectName, int workloadHours) {}
