package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.repository.CourseRepository;
import com.pifsite.application.dto.CourseSubjectsDTO;
import com.pifsite.application.dto.CreateCourseDTO;
import com.pifsite.application.entities.Subject;
import com.pifsite.application.enums.UserRoles;
import com.pifsite.application.entities.Course;
import com.pifsite.application.dto.CourseDTO;
import com.pifsite.application.entities.User;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public List<CourseDTO> getAllCourses(){ // trocar para retornar um DTO depois

        List<CourseDTO> courses = this.courseRepository.getAllCourses();

        if(courses.isEmpty()){
            throw new ResourceNotFoundException("there is no posts in the database"); // melhorar depois
        }

        return courses;
    }

    public Course crateCourse(CreateCourseDTO courseDTO){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN && user.getRole() != UserRoles.PROFESSOR){
            throw new UnauthorizedActionException("You can't create curses");
        }
        
        Course newCourse = new Course();
        newCourse.setCourseName(courseDTO.courseName());

        return this.courseRepository.save(newCourse);
    }

    public void addSubjectToCourse(UUID courseID, List<UUID> subjectIds){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN && user.getRole() != UserRoles.PROFESSOR){
            throw new UnauthorizedActionException("You can't create courses");
        }
        
        Course course = this.courseRepository.findById(courseID).orElseThrow(() -> new ResourceNotFoundException("Course with ID " + courseID + " not found"));

        List<Subject> subjects = subjectRepository.findAllById(subjectIds);

        course.getSubjects().addAll(subjects);

        courseRepository.save(course);
    }

    public void createCourseWithSubjects(CourseSubjectsDTO courseSubjectsDTO){

        CreateCourseDTO newCourseDTO = new CreateCourseDTO(courseSubjectsDTO.courseName());
        UUID courseId = crateCourse(newCourseDTO).getCourseId();

        addSubjectToCourse(courseId, courseSubjectsDTO.subjects());
    }

    public void deleteOneCourse(UUID courseId){

        this.courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("User with ID " + courseId + " not found"));

        try{
            this.courseRepository.deleteById(courseId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("This course has students, so it can't be deleted yet");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }

    }
}
