package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.Student;

import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

}
