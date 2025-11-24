package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pifsite.application.entities.Attendance;
import com.pifsite.application.dto.AttendanceDTO;
import com.pifsite.application.dto.StudentsAttendanceDTO;

import java.util.List;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    @Query("SELECT new com.pifsite.application.dto.AttendanceDTO(" +
                "a.attendanceId, " +
                "s.user.id, " +
                "s.user.username, " +
                "c.classroomId, " +
                "c.subject.subjectName, " +
                "new com.pifsite.application.dto.ClassroomScheduleDTO(" +
                    "cs.scheduleId, " +
                    "cs.dayOfWeek, " +
                    "cs.startAt, " +
                    "cs.endAt), " +
                "a.attendanceDate, " +
                "a.presence) " +
                "FROM Attendance a " +
                "JOIN a.student s JOIN s.user " +
                "JOIN a.classroom c JOIN c.subject " +
                "JOIN a.schedule cs")
    List<AttendanceDTO> getAll();

    @Query("SELECT new com.pifsite.application.dto.AttendanceDTO(" +
                "a.attendanceId, " +
                "s.user.id, " +
                "s.user.username, " +
                "c.classroomId, " +
                "c.subject.subjectName, " +
                "new com.pifsite.application.dto.ClassroomScheduleDTO(" +
                    "cs.scheduleId, " +
                    "cs.dayOfWeek, " +
                    "cs.startAt, " +
                    "cs.endAt), " +
                    "a.attendanceDate, " +
                    "a.presence) " +
                "FROM Attendance a " +
                "JOIN a.student s JOIN s.user " +
                "JOIN a.classroom c JOIN c.subject " +
                "JOIN a.schedule cs " +
                "WHERE c.id=:classroomId")
    List<AttendanceDTO> getByClassroomId(@Param("classroomId") UUID classroomId);

    @Query("SELECT new com.pifsite.application.dto.AttendanceDTO(" +
                "a.attendanceId, " +
                "s.user.id, " +
                "s.user.username, " +
                "c.classroomId, " +
                "c.subject.subjectName, " +
                "new com.pifsite.application.dto.ClassroomScheduleDTO(" +
                    "cs.scheduleId, " +
                    "cs.dayOfWeek, " +
                    "cs.startAt, " +
                    "cs.endAt), " +
                    "a.attendanceDate, " +
                    "a.presence) " +
                "FROM Attendance a " +
                "JOIN a.student s JOIN s.user " +
                "JOIN a.classroom c JOIN c.subject " +
                "JOIN a.schedule cs " +
                "WHERE s.user.id=:studentId")
    List<AttendanceDTO> getByStudentId(@Param("studentId") UUID studentId);

    @Query("SELECT new com.pifsite.application.dto.StudentsAttendanceDTO(" +
                    "s.user.id, " +
                    "s.user.username, " +
                    "c.classroomId, " +
                    "c.subject.subjectName, " +
                    "COUNT(a)) " +
                "FROM Attendance a " +
                "JOIN a.student s " +
                "JOIN s.user " +
                "JOIN a.classroom c " +
                "JOIN c.subject " +
                "WHERE a.presence = false " +
                "GROUP BY " +
                    "s.user.id, " +
                    "c.classroomId, " +
                    "c.subject.subjectName")
    List<StudentsAttendanceDTO> getStudentsAttendancesNumber();
}
