package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.dto.CreateClassroomDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.Professor;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Subject;
import com.pifsite.application.entities.User;
import com.pifsite.application.enums.UserRoles;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassroomService {
    
    private final ClassroomRepository classroomRepository;
    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public List<Classroom> getAllClassrooms(){ // trocar para retornar um DTO depois

        List<Classroom> Classrooms = this.classroomRepository.findAll();

        if(Classrooms.isEmpty()){
            throw new ResourceNotFoundException("there is no Classrooms in the database"); // melhorar depois
        }

        return Classrooms;
    }

    public void createClassroom(CreateClassroomDTO registerClassroomDTO){


        Professor professor = this.professorRepository.findById(registerClassroomDTO.professorId())
        .orElseThrow(() -> new ResourceNotFoundException("Professor with ID " + registerClassroomDTO.professorId() + " not found"));

        Subject subject = this.subjectRepository.findById(registerClassroomDTO.subjectId())
        .orElseThrow(() -> new ResourceNotFoundException("Subject with ID " + registerClassroomDTO.subjectId() + " not found"));;
        
        List<Student> students = this.studentRepository.findAllById(registerClassroomDTO.studentsIds());

        Classroom newClassroom = new Classroom();

        newClassroom.setProfessor(professor);
        newClassroom.setSubject(subject);
        newClassroom.setSemester(registerClassroomDTO.semester());
        newClassroom.setStartAt(registerClassroomDTO.startAt());
        newClassroom.setEndAt(registerClassroomDTO.endAt());

        newClassroom.getStudents().addAll(students);

        this.classroomRepository.save(newClassroom);
    }

    public void deleteOneClassroom(UUID ClassroomId){

        this.classroomRepository.findById(ClassroomId).orElseThrow(() -> new ResourceNotFoundException("classroom with ID " + ClassroomId + " not found"));;

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User reqUser = (User)userData.getPrincipal();

        if(reqUser.getRole() != UserRoles.ADMIN){
            throw new UnauthorizedActionException("you can't delete this classroom");
        }

        try{
            this.classroomRepository.deleteById(ClassroomId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("what?");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }

    }
}
