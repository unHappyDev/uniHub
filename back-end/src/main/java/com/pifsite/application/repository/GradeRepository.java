package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Grade;
// import com.pifsite.application.dto.GradeDTO;

// import java.util.List;
import java.util.UUID;

public interface GradeRepository extends JpaRepository<Grade, UUID> {

    // @Query("SELECT new com.pifsite.application.dto.GradeDTO(u.gradeId, u.student, u.classroom, u.activity, u.grade) FROM Grade u")
    // List<GradeDTO> getAllGrades();

}
