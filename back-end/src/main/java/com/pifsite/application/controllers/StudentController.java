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
// import com.pifsite.application.dto.StudentDTO;
import com.pifsite.application.entities.Student;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllStudents(){

        List<Student> Students = studentService.getAllStudents();
        return ResponseEntity.ok(Students); // não está muito bom ainda tem que arrumar dps

    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody CreateStudentDTO registerStudentDTO){

        studentService.createStudent(registerStudentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Estudante created");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable UUID id) {

        studentService.deleteOneStudent(id);
        return ResponseEntity.ok("Student successfully deleted.");

    }
}
