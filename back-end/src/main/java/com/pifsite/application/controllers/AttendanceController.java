package com.pifsite.application.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.AttendanceService;
import com.pifsite.application.dto.CreateAttendanceDTO;
import com.pifsite.application.dto.AttendanceDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/attendance")
@Tag(name = "AttendanceController", description = "Endpoints to get, create, delete and update professors")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    @Operation(summary = "Get Attendance", description = "Get all Attendances from database")
    public ResponseEntity<?> getAllAttendances(){

        List<AttendanceDTO> attendances = attendanceService.getAll();
        return ResponseEntity.ok(attendances);
    }

    @PostMapping
    @Operation(summary = "Create Attendance", description = "Create a Attendance and save on the database")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString(), T(com.pifsite.application.security.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> createAttendance(@RequestBody CreateAttendanceDTO attendanceDTO){

        attendanceService.crateAttendance(attendanceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Attendance created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Attendance", description = "Update a Attendance on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString(), T(com.pifsite.application.security.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> updateAttendance(@RequestBody CreateAttendanceDTO attendanceDTO, @PathVariable UUID id){
        
        attendanceService.updateAttendance(attendanceDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Attendance Atualizada");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Attendance", description = "Delete a Attendance on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString(), T(com.pifsite.application.security.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<String> deleteAttendance(@PathVariable UUID id) {
        
        attendanceService.deleteOneAttendance(id);
        
        return ResponseEntity.ok("Attendance successfully deleted.");
    }
}
