package com.pifsite.application.dto;

import java.util.UUID;
import java.math.BigDecimal;

public record GradeDTO(UUID id, String student, String subject, BigDecimal grade) {}