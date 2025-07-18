package com.pifsite.application.service;

import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.CourseRepository;
import com.pifsite.application.dto.CreateStudentDTO;
import com.pifsite.application.dto.CreateUserDTO;
import com.pifsite.application.entities.Student;
import com.pifsite.application.enums.UserRoles;
import com.pifsite.application.entities.Course;
import com.pifsite.application.entities.User;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public List<Student> getAllStudents(){ // trocar para retornar um DTO depois

        List<Student> students = this.studentRepository.findAll();

        if(students.isEmpty()){
            throw new ResourceNotFoundException("there is no Students in the database"); // melhorar depois
        }

        return students;
    }

    @Transactional
    public void createStudent(CreateStudentDTO registerStudentDTO){

        CreateUserDTO registerUser = registerStudentDTO.registerUser();

        Course course = courseRepository.findById(registerStudentDTO.courseId()).orElseThrow(() -> new ResourceNotFoundException("Course with ID" + registerStudentDTO.courseId() + " not found"));

        User user = new User( null,
            registerUser.name(),
            registerUser.email(),
            passwordEncoder.encode(registerUser.password()),
            UserRoles.fromString(registerUser.role())
        );

        Student student = new Student();

        student.setUser(user);
        student.setCourse(course);
        
        studentRepository.save(student);
    }

    public void deleteOneStudent(UUID studentId){

        this.studentRepository.findById(studentId) .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + studentId + " not found"));

        try{
            this.studentRepository.deleteById(studentId);
            
        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("This student is still linked to other entities in the application, like classrooms, courses, attendances or grades");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }

        this.userService.deleteOneUser(studentId);
    }
}
