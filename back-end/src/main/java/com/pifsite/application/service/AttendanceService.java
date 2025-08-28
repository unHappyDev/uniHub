package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.AttendanceRepository;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.dto.CreateAttendanceDTO;
import com.pifsite.application.entities.Attendance;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.User;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository AttendanceRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;

    public List<Attendance> getAllAttendances(){

        List<Attendance> Attendances = this.AttendanceRepository.findAll();

        if(Attendances.isEmpty()){
            throw new ResourceNotFoundException("there is no Attendances in the database"); // melhorar depois
        }

        return Attendances;
    }

    public void crateAttendance(CreateAttendanceDTO AttendanceDTO){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN || user.getRole() != UserRoles.PROFESSOR){

            throw new UnauthorizedActionException("You can't create courses");
        }

        Student newStudent = this.studentRepository.findById(AttendanceDTO.studentId())
        .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + AttendanceDTO.studentId() + " not found"));

        Classroom newClassroom = this.classroomRepository.findById(AttendanceDTO.classroomId())
        .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + AttendanceDTO.classroomId() + " not found"));

        Attendance newAttendance = new Attendance();

        newAttendance.setAttendanceDate(AttendanceDTO.attendanceDate());
        newAttendance.setPresence(AttendanceDTO.presence());
        newAttendance.setStudent(newStudent);
        newAttendance.setClassroom(newClassroom);

        this.AttendanceRepository.save(newAttendance);
    }

    public void deleteOneAttendance(UUID AttendanceId){
        
        this.AttendanceRepository.findById(AttendanceId).orElseThrow(() -> new ResourceNotFoundException("Attendance with ID " + AttendanceId + " not found"));;

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN || user.getRole() != UserRoles.PROFESSOR){
            throw new UnauthorizedActionException("You can't create courses");
        }

        try{
            this.AttendanceRepository.deleteById(AttendanceId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("what?");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }

    }
}
