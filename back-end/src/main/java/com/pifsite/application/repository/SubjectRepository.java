package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Subject;
import com.pifsite.application.dto.SubjectDTO;

import java.util.List;
import java.util.UUID;

public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    @Query(nativeQuery = true, value = "SELECT subject_id, subject_name, workload_hours from subjects")
    List<SubjectDTO> getAllSubjects();

}
