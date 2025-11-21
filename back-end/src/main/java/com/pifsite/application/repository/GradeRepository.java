package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pifsite.application.entities.Grade;
import com.pifsite.application.dto.GradeDTO;

import java.util.List;
import java.util.UUID;

public interface GradeRepository extends JpaRepository<Grade, UUID> {

    @Query("SELECT new com.pifsite.application.dto.GradeDTO(g.gradeId, u.id, u.username, c.classroomId, sub.subjectName, g.activity, g.grade) " +
            "FROM Grade g " +
            "JOIN g.student s JOIN s.user u " +
            "JOIN g.classroom c JOIN c.subject sub")
    List<GradeDTO> getAll();

    @Query("SELECT new com.pifsite.application.dto.GradeDTO(g.gradeId, u.id, u.username, c.classroomId, sub.subjectName, g.activity, g.grade) " +
            "FROM Grade g " +
            "JOIN g.student s " +
            "JOIN s.user u " +
            "JOIN g.classroom c " +
            "JOIN c.subject sub " +
            "WHERE c.id=:classroomId")
    List<GradeDTO> getByClassroomId(@Param("classroomId") UUID classroomId);

}
