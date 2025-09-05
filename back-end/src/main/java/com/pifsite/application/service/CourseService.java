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

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public Set<CourseDTO> getAllCourses(){

        Set<Course> courses = courseRepository.getAllCoursesWithSubjects();

        Set<CourseDTO> setCourses = courses.stream()
            .map(course -> new CourseDTO(course.getCourseName(), course.getSubjects()))
            .collect(Collectors.toSet());

        if(courses.isEmpty()){
            throw new ResourceNotFoundException("there is no posts in the database");
        }

        return setCourses;
    }

    public Course crateCourse(CreateCourseDTO courseDTO){
        
        Course newCourse = new Course();
        newCourse.setCourseName(courseDTO.courseName());

        return this.courseRepository.save(newCourse);
    }

    public void addSubjectToCourse(UUID courseId, List<UUID> subjectIds){
        
        Course course = this.courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course with ID " + courseId + " not found"));

        List<Subject> subjects = subjectRepository.findAllById(subjectIds);

        course.getSubjects().addAll(subjects);

        courseRepository.save(course);
    }

    public void createCourseWithSubjects(CourseSubjectsDTO courseSubjectsDTO){

        CreateCourseDTO newCourseDTO = new CreateCourseDTO(courseSubjectsDTO.courseName());
        UUID courseId = crateCourse(newCourseDTO).getCourseId();

        System.out.println(courseSubjectsDTO.subjects());

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
