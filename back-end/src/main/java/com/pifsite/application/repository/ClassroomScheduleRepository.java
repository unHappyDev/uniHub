package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.ClassroomSchedule;
import com.pifsite.application.dto.ClassroomScheduleDTO;

import java.util.List;
import java.util.UUID;

public interface ClassroomScheduleRepository extends JpaRepository<ClassroomSchedule, UUID> {

    @Query("SELECT new com.pifsite.application.dto.ClassroomScheduleDTO(" +
            "c.scheduleId, " +
            "c.dayOfWeek, " +
            "c.startAt, " +
            "c.endAt) " +
            "FROM ClassroomSchedule c")
    List<ClassroomScheduleDTO> getAll();

}
