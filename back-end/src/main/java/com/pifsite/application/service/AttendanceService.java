package com.pifsite.application.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.AttendanceRepository;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.ClassroomScheduleRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.dto.CreateAttendanceDTO;
import com.pifsite.application.dto.StudentsAttendanceDTO;
import com.pifsite.application.entities.Attendance;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.ClassroomSchedule;
import com.pifsite.application.dto.AttendanceDTO;
import com.pifsite.application.entities.Student;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final ClassroomScheduleRepository scheduleRepository;
    private final AttendanceRepository attendanceRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;

    public List<AttendanceDTO> getAll() {

        List<AttendanceDTO> Attendances = this.attendanceRepository.getAll();

        if (Attendances.isEmpty()) {
            throw new ResourceNotFoundException("there is no Attendances in the database");
        }

        return Attendances;
    }
    
    public List<StudentsAttendanceDTO> getStudentsAttendancesNumber() {

        List<StudentsAttendanceDTO> Attendances = this.attendanceRepository.getStudentsAttendancesNumber();

        if (Attendances.isEmpty()) {
            throw new ResourceNotFoundException("there is no Attendances in the database");
        }

        return Attendances;
    }
    
    public List<AttendanceDTO> getAttendancesByClassroomId(UUID id) {

        List<AttendanceDTO> Attendances = this.attendanceRepository.getByClassroomId(id);

        if (Attendances.isEmpty()) {
            throw new ResourceNotFoundException("there is no Attendances in the database");
        }

        return Attendances;
    }

    public void crateAttendance(CreateAttendanceDTO AttendanceDTO) {

        Student student = this.studentRepository.findById(AttendanceDTO.studentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student with ID " + AttendanceDTO.studentId() + " not found"));

        Classroom classroom = this.classroomRepository.findById(AttendanceDTO.classroomId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Classroom with ID " + AttendanceDTO.classroomId() + " not found"));

        ClassroomSchedule schedule = this.scheduleRepository.findById(AttendanceDTO.scheduleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Classroom with ID " + AttendanceDTO.classroomId() + " not found"));


        Attendance newAttendance = new Attendance();

        newAttendance.setAttendanceDate(AttendanceDTO.attendanceDate());
        newAttendance.setPresence(AttendanceDTO.presence());
        newAttendance.setSchedule(schedule);
        newAttendance.setStudent(student);
        newAttendance.setClassroom(classroom);

        this.attendanceRepository.save(newAttendance);
    }

    public void deleteOneAttendance(UUID AttendanceId) {

        this.attendanceRepository.findById(AttendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance with ID " + AttendanceId + " not found"));

        try {
            this.attendanceRepository.deleteById(AttendanceId);

        } catch (DataIntegrityViolationException err) {

            throw new EntityInUseException("what?");

        } catch (Exception err) {

            System.out.println("This error was not treated yet: " + err.getClass());
        }

    }

    public void updateAttendance(CreateAttendanceDTO attendanceDTO, UUID id) {

        Attendance attendance = this.attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));

        if (attendanceDTO.attendanceDate() != null) {

            attendance.setAttendanceDate(attendanceDTO.attendanceDate());
        }

        if (attendanceDTO.presence() != null) {

            attendance.setPresence(attendanceDTO.presence());
        }

        if (attendanceDTO.studentId() != null) {

            Student student = this.studentRepository.findById(attendanceDTO.studentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + id + " not found"));

            attendance.setStudent(student);
        }

        if (attendanceDTO.classroomId() != null) {

            Classroom classroom = this.classroomRepository.findById(attendanceDTO.classroomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + id + " not found"));

            attendance.setClassroom(classroom);
        }

        this.attendanceRepository.save(attendance);
    }
}
