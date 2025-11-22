package com.pifsite.application.dto;

import java.time.LocalTime;
import java.util.UUID;

import com.pifsite.application.enums.WeekDay;

public record ClassroomScheduleDTO(UUID scheduleId, WeekDay dayOfWeek, LocalTime startAt, LocalTime endAt){}
