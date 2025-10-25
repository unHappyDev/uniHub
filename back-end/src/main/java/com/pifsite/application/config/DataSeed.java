package com.pifsite.application.config;

import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.StudentRepository;
import com.pifsite.application.repository.SessionRepository;
import com.pifsite.application.repository.CourseRepository;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.entities.Professor;
import com.pifsite.application.entities.Session;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Course;
import com.pifsite.application.entities.User;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class DataSeed implements CommandLineRunner {

    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final SessionRepository sessionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DataSeed(UserRepository userRepository, SessionRepository sessionRepository,
            CourseRepository courseRepository, StudentRepository studentRepository,
            ProfessorRepository professorRepository) {

        this.professorRepository = professorRepository;
        this.studentRepository = studentRepository;
        this.sessionRepository = sessionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        User ds = userRepository.findByEmail("ds@email.com").orElseGet(() -> userRepository.save(new User(
                null,
                "default_student",
                "ds@email.com",
                "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
                UserRoles.USER,
                true,
                null)));

        User dp = userRepository.findByEmail("dp@email.com").orElseGet(() -> userRepository.save(new User(
                null,
                "default_professor",
                "dp@email.com",
                "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
                UserRoles.PROFESSOR,
                true,
                null)));

        User da = userRepository.findByEmail("da@email.com").orElseGet(() -> userRepository.save(new User(
                null,
                "default_admin",
                "da@email.com",
                "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
                UserRoles.ADMIN,
                true,
                null)));

        sessionRepository.findByToken("33333-33333-33333-33333")
                .map(session -> {
                    session.setExpiresAt(OffsetDateTime.now().plusHours(3));
                    return sessionRepository.save(session);
                })
                .orElseGet(() -> sessionRepository.save(new Session(
                        null,
                        "33333-33333-33333-33333",
                        ds,
                        OffsetDateTime.now().plusHours(3),
                        null,
                        null)));

        sessionRepository.findByToken("22222-22222-22222-22222")
                .map(session -> {
                    session.setExpiresAt(OffsetDateTime.now().plusHours(3));
                    return sessionRepository.save(session);
                })
                .orElseGet(() -> sessionRepository.save(new Session(
                        null,
                        "22222-22222-22222-22222",
                        dp,
                        OffsetDateTime.now().plusHours(3),
                        null,
                        null)));

        sessionRepository.findByToken("11111-11111-11111-11111")
                .map(session -> {
                    session.setExpiresAt(OffsetDateTime.now().plusHours(3));
                    return sessionRepository.save(session);
                })
                .orElseGet(() -> sessionRepository.save(new Session(
                        null,
                        "11111-11111-11111-11111",
                        da,
                        OffsetDateTime.now().plusHours(3),
                        null,
                        null)));

        System.out.println("Usuários e sessões criadas");

        Course courseA = courseRepository.findByCourseName("Eng. Compuação")
                .orElseGet(() -> courseRepository.save(new Course(null, "Eng. Compuação", null)));

        courseRepository.findByCourseName("Eng. Elétrica")
                .orElseGet(() -> courseRepository.save(new Course(null, "Eng. Elétrica", null)));

        courseRepository.findByCourseName("Eng. Produção")
                .orElseGet(() -> courseRepository.save(new Course(null, "Eng. Produção", null)));

        studentRepository.findById(ds.getId())
                .orElseGet(() -> studentRepository.save(new Student(null, ds, courseA)));

        professorRepository.findById(dp.getId())
                .orElseGet(() -> professorRepository.save(new Professor(null, dp, null)));

        System.out.println("Cursos, estudantes, professores criados");
    }
}