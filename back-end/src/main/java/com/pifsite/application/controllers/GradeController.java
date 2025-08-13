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

import com.pifsite.application.service.GradeService;
import com.pifsite.application.dto.CreateGradeDTO;
import com.pifsite.application.entities.Grade;

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
    public ResponseEntity<?> getAllGrades(){

        List<Grade> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades); // não está muito bom ainda tem que arrumar dps

    }

    @PostMapping
    @Operation(summary = "Create Grade", description = "Create a Grade and save on the database")
    public ResponseEntity<?> createGrade(@RequestBody CreateGradeDTO gradeDTO){

        gradeService.crateGrade(gradeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Grade created");
         
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Grade", description = "Delete a Grade on database by its ID")
    public ResponseEntity<String> deleteGrade(@PathVariable UUID id) {

        gradeService.deleteOneGrade(id);
        return ResponseEntity.ok("Grade successfully deleted.");

    }
}
