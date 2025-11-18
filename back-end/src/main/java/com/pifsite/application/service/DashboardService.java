package com.pifsite.application.service;

import org.springframework.stereotype.Service;

import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.CourseRepository;
import com.pifsite.application.dto.DashboardDataDTO;

@Service
public class DashboardService {

    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public DashboardService(ProfessorRepository professorRepository, StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.professorRepository = professorRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public DashboardDataDTO getData() {

        long countProfessors = professorRepository.count();
        long countStudents = studentRepository.count();
        long countCourses = courseRepository.count();

        return new DashboardDataDTO(countStudents, countProfessors, countCourses);
    }
}
