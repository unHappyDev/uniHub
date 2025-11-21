package com.pifsite.application.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateGradeDTO(UUID studentId, UUID classroomId, String activity, BigDecimal grade, int bimester) {}
