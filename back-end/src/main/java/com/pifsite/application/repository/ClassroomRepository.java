package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Classroom;
import com.pifsite.application.dto.ClassroomDTO;

import java.util.List;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    
    @Query("SELECT new com.pifsite.application.dto.ClassroomDTO(c.classroomId, p.user.username, s.subjectName, c.semester, c.startAt, c.endAt) "+
           "FROM Classroom c " +
           "JOIN c.subject s " + 
           "JOIN c.professor p JOIN p.user u") 
    List<ClassroomDTO> getAll();
}
