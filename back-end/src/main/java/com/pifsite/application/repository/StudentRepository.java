package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Student;
import com.pifsite.application.dto.StudentDTO;

import java.util.List;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

    @Query("SELECT new com.pifsite.application.dto.StudentDTO(s.user.username, s.user.email, s.user.role, s.course.courseName) " +
            "FROM Student s")
    List<StudentDTO> getAllStudents();
}
