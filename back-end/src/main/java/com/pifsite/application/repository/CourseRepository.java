package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.dto.CourseDTO;
import com.pifsite.application.entities.Course;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    @Query(nativeQuery = true, value = "SELECT course_id, course_name from courses")
    List<CourseDTO> getAllCourses();
    
}