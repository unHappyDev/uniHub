package com.pifsite.application.controllers;

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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/course")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses(){

        List<CourseDTO> course = courseService.getAllCourses();
        return ResponseEntity.ok(course);

    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CreateCourseDTO courseDTO){

        courseService.crateCourse(courseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course created");
         
    }

    @PostMapping("/withSubjects")
    public ResponseEntity<?> createCourseWithSubjects(@RequestBody CourseSubjectsDTO courseSubjectsDTO){

        courseService.createCourseWithSubjects(courseSubjectsDTO);
        return ResponseEntity.ok("Course created");
         
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> addSubjects(@PathVariable UUID id, @RequestBody List<UUID> subjectIds) {
        
        courseService.addSubjectToCourse(id, subjectIds);
        return ResponseEntity.ok("Course successfully updated.");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        
        try{

            courseService.deleteOneCourse(id);
            return ResponseEntity.ok("Course successfully deleted.");

        }catch(Exception err) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course not deleted");
        }
    }
}
