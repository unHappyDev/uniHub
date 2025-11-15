package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.ClassroomSchedule;

import java.util.UUID;

public interface ClassroomScheduleRepository extends JpaRepository<ClassroomSchedule, UUID> {
    
}
