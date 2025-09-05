package com.pifsite.application.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.AttendanceRepository;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.dto.CreateAttendanceDTO;
import com.pifsite.application.entities.Attendance;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.dto.AttendanceDTO;
import com.pifsite.application.entities.Student;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository AttendanceRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;

    public List<AttendanceDTO> getAll(){

        List<AttendanceDTO> Attendances = this.AttendanceRepository.getAll();

        if(Attendances.isEmpty()){
            throw new ResourceNotFoundException("there is no Attendances in the database"); // melhorar depois
        }

        return Attendances;
    }

    public void crateAttendance(CreateAttendanceDTO AttendanceDTO){

        Student student = this.studentRepository.findById(AttendanceDTO.studentId())
        .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + AttendanceDTO.studentId() + " not found"));

        Classroom classroom = this.classroomRepository.findById(AttendanceDTO.classroomId())
        .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + AttendanceDTO.classroomId() + " not found"));

        Attendance newAttendance = new Attendance();

        newAttendance.setAttendanceDate(AttendanceDTO.attendanceDate());
        newAttendance.setPresence(AttendanceDTO.presence());
        newAttendance.setStudent(student);
        newAttendance.setClassroom(classroom);

        this.AttendanceRepository.save(newAttendance);
    }

    public void deleteOneAttendance(UUID AttendanceId){
        
        this.AttendanceRepository.findById(AttendanceId).orElseThrow(() -> new ResourceNotFoundException("Attendance with ID " + AttendanceId + " not found"));;

        try{
            this.AttendanceRepository.deleteById(AttendanceId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("what?");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }

    }
}
