package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.repository.GradeRepository;
import com.pifsite.application.dto.CreateGradeDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Grade;
import com.pifsite.application.entities.User;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public List<Grade> getAllGrades(){

        List<Grade> grades = this.gradeRepository.findAll();

        if(grades.isEmpty()){
            throw new ResourceNotFoundException("No Grades found"); // melhorar depois
        }

        return grades;
    }

    public void crateGrade(CreateGradeDTO gradeDTO){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN || user.getRole() != UserRoles.PROFESSOR){
            throw new UnauthorizedActionException("You can't create grades");
        }

        Student newStudent = this.studentRepository.findById(gradeDTO.studentId()).orElseThrow(() -> new ResourceNotFoundException("User with ID " + gradeDTO.studentId() + " not found"));

        Classroom newClassroom = this.classroomRepository.findById(gradeDTO.classroomId()).orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + gradeDTO.classroomId() + " not found"));

        Grade newGrade = new Grade();

        newGrade.setActivity(gradeDTO.activity());
        newGrade.setGrade(gradeDTO.grade());
        newGrade.setStudent(newStudent);
        newGrade.setClassroom(newClassroom);

        this.gradeRepository.save(newGrade);
    }

    public void deleteOneGrade(UUID gradeId){
        this.gradeRepository.findById(gradeId).orElseThrow(() -> new ResourceNotFoundException("Grade not found"));
        
        try{
            this.gradeRepository.deleteById(gradeId);

        }catch(Exception err){

            System.out.println(err.getClass());
        }
    }
}
