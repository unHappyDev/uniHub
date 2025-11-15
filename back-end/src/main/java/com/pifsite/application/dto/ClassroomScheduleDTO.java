package com.pifsite.application.dto;

import java.time.LocalTime;
import java.util.UUID;

public record ClassroomScheduleDTO(UUID scheduleId, String dayOfWeek, LocalTime startAt, LocalTime endAt){}
