package com.pifsite.application.dto;

import com.pifsite.application.enums.ActivityType;

import java.math.BigDecimal;

import java.util.UUID;

public record GradeDTO(UUID id, UUID studentId, String student, String subject, ActivityType activity, BigDecimal grade) {}