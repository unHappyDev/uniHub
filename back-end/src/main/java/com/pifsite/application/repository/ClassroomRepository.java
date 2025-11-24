package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import com.pifsite.application.entities.Classroom;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

    @EntityGraph(attributePaths = {
            "professor.user",
            "subject",
            "students.user",
            "students.course",
            "schedules"
    })
    List<Classroom> findAll();

    @EntityGraph(attributePaths = {
            "professor.user",
            "subject",
            "students.user",
            "students.course",
            "schedules"
    })
    Set<Classroom> findByProfessor_User_Id(UUID professorId);

    @EntityGraph(attributePaths = {
            "professor.user",
            "subject",
            "students.user",
            "students.course",
            "schedules"
    })
    Set<Classroom> findByStudents_User_Id(UUID studentId);
}
