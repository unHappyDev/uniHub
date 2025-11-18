package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Classroom;

import java.util.Set;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

    @Query("SELECT DISTINCT c FROM Classroom c " +
       "JOIN FETCH c.students s " +
       "JOIN FETCH c.professor p " +
       "JOIN FETCH p.user u " +
       "JOIN FETCH c.subject s2")
    Set<Classroom> getAll();
}
