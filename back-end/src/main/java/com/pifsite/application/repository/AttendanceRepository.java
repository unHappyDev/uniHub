package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Attendance;
import com.pifsite.application.dto.AttendanceDTO;

import java.util.List;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    @Query("SELECT new com.pifsite.application.dto.AttendanceDTO(a.attendanceId, s.user.username, c.subject.subjectName, a.attendanceDate, a.presence) "+
           "FROM Attendance a " +
           "JOIN a.student s JOIN s.user " +
           "JOIN a.classroom c JOIN c.subject")
    List<AttendanceDTO> getAll();
}
