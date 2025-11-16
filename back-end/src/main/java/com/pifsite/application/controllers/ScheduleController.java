package com.pifsite.application.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.dto.ClassroomScheduleDTO;
import com.pifsite.application.service.ScheduleService;
import com.pifsite.application.dto.CreateScheduleDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.stream.Collectors;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@Tag(name = "ScheduleController", description = "Endpoints to get, create, delete and update professors")
public class ScheduleController {
    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    @Operation(summary = "Get Schedule", description = "Get all Schedules from database")
    public ResponseEntity<?> getAllSchedules() {

        List<ClassroomScheduleDTO> attendances = scheduleService.getAll();
        return ResponseEntity.ok(attendances);
    }

    @PostMapping
    @Operation(summary = "Create Schedule", description = "Create a Schedule and save on the database")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> createSchedule(@RequestBody CreateScheduleDTO scheduleDTO) {

        scheduleService.createClassroomSchedules(scheduleDTO.classroomId(), scheduleDTO.schedules().stream().collect(Collectors.toSet()));
        return ResponseEntity.status(HttpStatus.CREATED).body("Schedule created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Schedule", description = "Update a Schedule on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> updateSchedule(@RequestBody ClassroomScheduleDTO attendanceDTO, @PathVariable UUID id) {

        scheduleService.updateSchedule(id, attendanceDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Schedule Atualizada");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Schedule", description = "Delete a Schedule on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<String> deleteSchedule(@PathVariable UUID id) {

        scheduleService.deleteSchedule(id);

        return ResponseEntity.ok("Schedule successfully deleted.");
    }
}
