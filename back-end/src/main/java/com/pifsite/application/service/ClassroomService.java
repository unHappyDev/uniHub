package com.pifsite.application.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.dto.ClassroomStudentDTO;
import com.pifsite.application.dto.CreateClassroomDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.Professor;
import com.pifsite.application.dto.ClassroomDTO;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Subject;

import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;
import java.util.List;
import java.util.UUID;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClassroomService {
    
    private final ClassroomRepository classroomRepository;
    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public Set<ClassroomDTO> getAll(){

        Set<Classroom> classrooms = this.classroomRepository.getAll();

        if(classrooms.isEmpty()){
            throw new ResourceNotFoundException("there is no Classrooms in the database");
        }

        return classrooms.stream().map(c -> {
            Set<ClassroomStudentDTO> studentDTOs = c.getStudents().stream()
                .map(s -> new ClassroomStudentDTO(s.getUser().getUsername(), s.getCourse().getCourseName()))
                .collect(Collectors.toSet());

                return new ClassroomDTO(
                    c.getClassroomId(),
                    c.getProfessor().getUser().getUsername(),
                    c.getSubject().getSubjectName(),
                    c.getSemester(),
                    c.getStartAt(),
                    c.getEndAt(),
                    studentDTOs
                );
            }
        ).collect(Collectors.toSet());

    }

    public void createClassroom(CreateClassroomDTO registerClassroomDTO){


        Professor professor = this.professorRepository.findById(registerClassroomDTO.professorId())
        .orElseThrow(() -> new ResourceNotFoundException("Professor with ID " + registerClassroomDTO.professorId() + " not found"));

        Subject subject = this.subjectRepository.findById(registerClassroomDTO.subjectId())
        .orElseThrow(() -> new ResourceNotFoundException("Subject with ID " + registerClassroomDTO.subjectId() + " not found"));;
        
        List<Student> students = this.studentRepository.findAllById(registerClassroomDTO.studentsIds());

        Classroom newClassroom = new Classroom();

        newClassroom.setSubject(subject);
        newClassroom.setProfessor(professor);
        newClassroom.setSemester(registerClassroomDTO.semester());
        newClassroom.setStartAt(registerClassroomDTO.startAt());
        newClassroom.setEndAt(registerClassroomDTO.endAt());

        newClassroom.getStudents().addAll(students);

        this.classroomRepository.save(newClassroom);
    }

    public void deleteOneClassroom(UUID ClassroomId){

        this.classroomRepository.findById(ClassroomId).orElseThrow(() -> new ResourceNotFoundException("classroom with ID " + ClassroomId + " not found"));;

        try{
            this.classroomRepository.deleteById(ClassroomId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("what?");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }
    }
}
