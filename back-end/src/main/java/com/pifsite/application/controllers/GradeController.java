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

import com.pifsite.application.service.GradeService;
import com.pifsite.application.dto.CreateGradeDTO;
import com.pifsite.application.dto.GradeDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/grade")
@Tag(name = "GradeController", description = "Endpoints to get, create, delete and update professors")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    @Operation(summary = "Get Grade", description = "Get all Grades from database")
    public ResponseEntity<?> getAllGrades() {

        List<GradeDTO> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Grade", description = "Get all Grades from database")
    public ResponseEntity<?> getGradesByClassroom(@PathVariable UUID id) {

        List<GradeDTO> grades = gradeService.getClassroomGrades(id);
        return ResponseEntity.ok(grades);
    }

    @PostMapping
    @Operation(summary = "Create Grade", description = "Create a Grade and save on the database")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> createGrade(@RequestBody CreateGradeDTO gradeDTO) {

        gradeService.crateGrade(gradeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Grade created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Grade", description = "Update a Grade on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> updateGrade(@RequestBody CreateGradeDTO gradeDTO, @PathVariable UUID id) {

        gradeService.updateGrade(gradeDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Grade Atualizada");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Grade", description = "Delete a Grade on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<String> deleteGrade(@PathVariable UUID id) {

        gradeService.deleteOneGrade(id);
        return ResponseEntity.ok("Grade successfully deleted.");
    }
}
