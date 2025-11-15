package com.pifsite.application.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.security.WeekDay;
import com.pifsite.application.entities.ClassroomSchedule;
import com.pifsite.application.dto.ClassroomScheduleDTO;
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

    public Set<ClassroomDTO> getAll() {

        Set<Classroom> classrooms = this.classroomRepository.getAll();

        if (classrooms.isEmpty()) {
            throw new ResourceNotFoundException("there is no Classrooms in the database");
        }

        return classrooms.stream().map(c -> {
            Set<ClassroomStudentDTO> studentDTOs = c.getStudents().stream()
                    .map(s -> new ClassroomStudentDTO(s.getUser().getUsername(), s.getCourse().getCourseName()))
                    .collect(Collectors.toSet());

            Set<ClassroomScheduleDTO> scheduleDTOs = c.getSchedules().stream()
                    .map(s -> new ClassroomScheduleDTO(
                            s.getScheduleId(),
                            s.getDayOfWeek().toString(),
                            s.getStartAt(),
                            s.getEndAt()))
                    .collect(Collectors.toSet());

            return new ClassroomDTO(
                    c.getClassroomId(),
                    c.getProfessor().getUser().getUsername(),
                    c.getSubject().getSubjectName(),
                    c.getSemester(),
                    scheduleDTOs,
                    studentDTOs);
        }).collect(Collectors.toSet());

    }

    public void createClassroom(CreateClassroomDTO registerClassroomDTO) {

        Professor professor = this.professorRepository.findById(registerClassroomDTO.professorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Professor with ID " + registerClassroomDTO.professorId() + " not found"));

        Subject subject = this.subjectRepository.findById(registerClassroomDTO.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject with ID " + registerClassroomDTO.subjectId() + " not found"));
        ;

        Classroom newClassroom = new Classroom();

        newClassroom.setSubject(subject);
        newClassroom.setProfessor(professor);
        newClassroom.setSemester(registerClassroomDTO.semester());

        Set<ClassroomSchedule> schedules = registerClassroomDTO.schedules().stream().map(s -> {
            ClassroomSchedule schedule = new ClassroomSchedule();
            schedule.setDayOfWeek(WeekDay.fromString(s.dayOfWeek()));
            schedule.setStartAt(s.startAt());
            schedule.setEndAt(s.endAt());
            schedule.setClassroom(newClassroom);
            return schedule;
        }).collect(Collectors.toSet());

        newClassroom.setSchedules(schedules);

        List<Student> students = this.studentRepository.findAllById(registerClassroomDTO.studentsIds());
        newClassroom.getStudents().addAll(students);

        this.classroomRepository.save(newClassroom);
    }

    public void updateClassroom(CreateClassroomDTO registerClassroomDTO, UUID id) {

        Classroom classroom = this.classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("classroom with ID " + id + " not found"));

        if (registerClassroomDTO.professorId() != null) {

            Professor professor = this.professorRepository.findById(registerClassroomDTO.professorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Professor with ID " + registerClassroomDTO.professorId() + " not found"));

            classroom.setProfessor(professor);
        }

        if (registerClassroomDTO.subjectId() != null) {

            Subject subject = this.subjectRepository.findById(registerClassroomDTO.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Subject with ID " + registerClassroomDTO.subjectId() + " not found"));

            classroom.setSubject(subject);
        }

        if (registerClassroomDTO.semester() != null && !registerClassroomDTO.semester().isBlank()) {

            classroom.setSemester(registerClassroomDTO.semester());
        }

        classroomRepository.save(classroom);
    }

    public void addStudent(UUID id, List<UUID> studentIds) {

        Classroom classroom = this.classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + id + " not found"));

        List<Student> students = studentRepository.findAllById(studentIds);

        classroom.getStudents().addAll(students);

        classroomRepository.save(classroom);
    }

    public void removeStudent(UUID id, List<UUID> studentIds) {

        Classroom classroom = this.classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + id + " not found"));

        List<Student> students = studentRepository.findAllById(studentIds);

        classroom.getStudents().removeAll(students);

        classroomRepository.save(classroom);
    }

    public void deleteOneClassroom(UUID classroomId) {

        this.classroomRepository.findById(classroomId)
                .orElseThrow(() -> new ResourceNotFoundException("classroom with ID " + classroomId + " not found"));

        try {
            this.classroomRepository.deleteById(classroomId);

        } catch (DataIntegrityViolationException err) {

            throw new EntityInUseException("what?");

        } catch (Exception err) {

            System.out.println("This error was not treated yet: " + err.getClass());
        }
    }
}
