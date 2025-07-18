package com.pifsite.application.dto;

import com.pifsite.application.entities.Course;

import java.util.UUID;

public record StudentDTO(UUID studentId, Course course) {
    
}
