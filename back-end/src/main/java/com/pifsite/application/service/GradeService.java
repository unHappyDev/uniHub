package com.pifsite.application.service;

import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.GradeRepository;
import com.pifsite.application.dto.CreateGradeDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Grade;
import com.pifsite.application.dto.GradeDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public List<GradeDTO> getAllGrades() {

        List<GradeDTO> grades = this.gradeRepository.getAll();

        if (grades.isEmpty()) {
            throw new ResourceNotFoundException("No Grades found");
        }

        return grades;
    }

    public void crateGrade(CreateGradeDTO gradeDTO) {

        Student newStudent = this.studentRepository.findById(gradeDTO.studentId()).orElseThrow(
                () -> new ResourceNotFoundException("User with ID " + gradeDTO.studentId() + " not found"));

        Classroom newClassroom = this.classroomRepository.findById(gradeDTO.classroomId()).orElseThrow(
                () -> new ResourceNotFoundException("Classroom with ID " + gradeDTO.classroomId() + " not found"));

        Grade newGrade = new Grade();

        newGrade.setActivity(gradeDTO.activity());
        newGrade.setGrade(gradeDTO.grade());
        newGrade.setStudent(newStudent);
        newGrade.setClassroom(newClassroom);

        this.gradeRepository.save(newGrade);
    }

    public void updateGrade(CreateGradeDTO gradeDTO, UUID id) {

        Grade grade = this.gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        if (gradeDTO.activity() != null && !gradeDTO.activity().isBlank()) {

            grade.setActivity(gradeDTO.activity());
        }
        if (gradeDTO.grade() != null) {

            grade.setGrade(gradeDTO.grade());
        }
        if (gradeDTO.studentId() != null) {

            Student student = this.studentRepository.findById(gradeDTO.studentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + id + " not found"));

            grade.setStudent(student);
        }
        if (gradeDTO.classroomId() != null) {

            Classroom classroom = this.classroomRepository.findById(gradeDTO.classroomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + id + " not found"));

            grade.setClassroom(classroom);
        }

        this.gradeRepository.save(grade);
    }

    public void deleteOneGrade(UUID gradeId) {
        this.gradeRepository.findById(gradeId).orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        try {
            this.gradeRepository.deleteById(gradeId);

        } catch (Exception err) {

            System.out.println(err.getClass());
        }
    }
}
