package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.StudentService;
import com.pifsite.application.dto.CreateStudentDTO;
import com.pifsite.application.dto.StudentDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/student")
@Tag(name = "StudentController", description = "Endpoints to get, create, delete and update professors")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "Get Student", description = "Get all Students from database")
    public ResponseEntity<?> getAllStudents(){

        List<StudentDTO> Students = studentService.getAllStudents();
        return ResponseEntity.ok(Students);

    }

    @PostMapping
    @Operation(summary = "Create Student", description = "Create a Student and save on the database")
    public ResponseEntity<?> createStudent(@RequestBody CreateStudentDTO registerStudentDTO){

        studentService.createStudent(registerStudentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Student Created");

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Student", description = "Delete a Student on database by its ID")
    public ResponseEntity<String> deleteStudent(@PathVariable UUID id) {

        studentService.deleteOneStudent(id);
        return ResponseEntity.ok("Student successfully deleted.");

    }
}
