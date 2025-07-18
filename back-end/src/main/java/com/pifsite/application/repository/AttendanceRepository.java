package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.Attendance;

import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

}
