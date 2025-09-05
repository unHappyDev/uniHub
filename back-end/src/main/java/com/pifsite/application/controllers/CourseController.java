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

import com.pifsite.application.service.CourseService;
import com.pifsite.application.dto.CourseSubjectsDTO;
import com.pifsite.application.dto.CreateCourseDTO;
import com.pifsite.application.dto.CourseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;
import java.util.Set;

@RestController
@RequestMapping("/course")
@Tag(name = "CourseController", description = "Endpoints to get, create, delete and update professors")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "Get Course", description = "Get all Courses from database")
    public ResponseEntity<?> getAllCourses(){

        Set<CourseDTO> course = courseService.getAllCourses();
        return ResponseEntity.ok(course);

    }

    @PostMapping
    @Operation(summary = "Create Course without subjects", description = "Create a Course without subjects and save on the database")
    @PreAuthorize("hasRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString())")
    public ResponseEntity<?> createCourse(@RequestBody CreateCourseDTO courseDTO){

        courseService.crateCourse(courseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course created");
         
    }

    @PostMapping("/withSubjects")
    @Operation(summary = "Create Course with subjects", description = "Create a Course with subjects and save on the database")
    @PreAuthorize("hasRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString())")
    public ResponseEntity<?> createCourseWithSubjects(@RequestBody CourseSubjectsDTO courseSubjectsDTO){

        courseService.createCourseWithSubjects(courseSubjectsDTO);
        return ResponseEntity.ok("Course created");
         
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Course", description = "Update a Course by its ID on the database")
    @PreAuthorize("hasRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString())")
    public ResponseEntity<String> addSubjects(@PathVariable UUID id, @RequestBody List<UUID> subjectIds) {
        
        courseService.addSubjectToCourse(id, subjectIds);
        return ResponseEntity.ok("Course successfully updated.");

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Course", description = "Delete a Course on database by its ID")
    @PreAuthorize("hasRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString())")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        courseService.deleteOneCourse(id);
        return ResponseEntity.ok("Course successfully deleted.");

    }
}
