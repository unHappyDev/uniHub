package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.Professor;

import java.util.UUID;

public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    long count();

}
