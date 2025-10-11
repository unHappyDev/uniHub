package com.pifsite.application.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.repository.CourseRepository;
import com.pifsite.application.dto.CourseSubjectsDTO;
import com.pifsite.application.dto.CreateCourseDTO;
import com.pifsite.application.entities.Subject;
import com.pifsite.application.entities.Course;
import com.pifsite.application.dto.CourseDTO;

import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;
import java.util.Collections;
import java.util.UUID;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public Set<CourseDTO> getAllCourses(){

        Set<Course> courses = courseRepository.getAllCoursesWithSubjects();

        System.out.println(courses);

        Set<CourseDTO> setCourses = courses.stream()
            .map(course -> new CourseDTO(course.getCourseName(), course.getSubjects() != null ? course.getSubjects() : Collections.emptySet()))
            .collect(Collectors.toSet());

        if(courses.isEmpty()){
            throw new ResourceNotFoundException("there is no courses in the database");
        }

        return setCourses;
    }

    public Course crateCourse(CreateCourseDTO courseDTO){
        
        Course newCourse = new Course();
        newCourse.setCourseName(courseDTO.courseName());

        return this.courseRepository.save(newCourse);
    }

    public void createCourseWithSubjects(CourseSubjectsDTO courseSubjectsDTO){

        CreateCourseDTO newCourseDTO = new CreateCourseDTO(courseSubjectsDTO.courseName());
        UUID courseId = crateCourse(newCourseDTO).getCourseId();
        
        System.out.println(courseSubjectsDTO.subjects());

        addSubjectToCourse(courseId, courseSubjectsDTO.subjects());

    }

    public void updateCourse(CourseSubjectsDTO courseSubjectsDTO, UUID id) {

        Course course = this.courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course with ID " + id + " not found"));
        
        if(courseSubjectsDTO.courseName() != null && !courseSubjectsDTO.courseName().isBlank()){
            course.setCourseName(courseSubjectsDTO.courseName());
        }

        courseRepository.save(course);
    }

    public void addSubjectToCourse(UUID courseId, List<UUID> subjectIds){
        
        Course course = this.courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course with ID " + courseId + " not found"));

        List<Subject> subjects = subjectRepository.findAllById(subjectIds);

        course.getSubjects().addAll(subjects);

        courseRepository.save(course);
    }

    public void removeSubjectToCourse(UUID courseId, List<UUID> subjectIds){
        
        Course course = this.courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course with ID " + courseId + " not found"));

        List<Subject> subjects = subjectRepository.findAllById(subjectIds);

        course.getSubjects().removeAll(subjects);

        courseRepository.save(course);
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
