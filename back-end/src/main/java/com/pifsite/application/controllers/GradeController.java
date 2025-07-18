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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/grade")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    public ResponseEntity<?> getAllGrades(){

        List<Grade> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades); // não está muito bom ainda tem que arrumar dps

    }

    @PostMapping
    public ResponseEntity<?> createGrade(@RequestBody CreateGradeDTO gradeDTO){

        gradeService.crateGrade(gradeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Grade created");
         
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrade(@PathVariable UUID id) {

        gradeService.deleteOneGrade(id);
        return ResponseEntity.ok("Grade successfully deleted.");

    }
}
