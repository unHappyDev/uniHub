package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.pifsite.application.service.AttendanceService;
import com.pifsite.application.dto.CreateAttendanceDTO;
import com.pifsite.application.entities.Attendance;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<?> getAllAttendances(){

        List<Attendance> attendances = attendanceService.getAllAttendances();
        return ResponseEntity.ok(attendances); // não está muito bom ainda tem que arrumar dps
    }

    @PostMapping
    public ResponseEntity<?> createAttendance(@RequestBody CreateAttendanceDTO attendanceDTO){

        attendanceService.crateAttendance(attendanceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Attendance created");
         
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable UUID id) {
        
        attendanceService.deleteOneAttendance(id);
        
        return ResponseEntity.ok("Attendance successfully deleted.");


    }
}
