package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.Classroom;

import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

}
