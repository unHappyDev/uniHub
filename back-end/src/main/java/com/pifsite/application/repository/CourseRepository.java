package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Course;
import com.pifsite.application.dto.CourseDTO;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import java.util.Set;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    Optional<Course> findByCourseName(String courseName);

    @Query(nativeQuery = true, value = "SELECT course_id, course_name from courses")
    List<CourseDTO> getAllCourses();

    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN c.subjects")
    Set<Course> getAllCoursesWithSubjects();
}