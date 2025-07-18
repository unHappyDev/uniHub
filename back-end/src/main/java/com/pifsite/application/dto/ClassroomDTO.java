package com.pifsite.application.dto;

import com.pifsite.application.entities.Professor;
import com.pifsite.application.entities.Student;
import com.pifsite.application.entities.Subject;

import java.util.UUID;
import java.util.Set;
import java.sql.Time;

public record ClassroomDTO(UUID classroomId, Professor professorId, Subject subjectId, String semester, Time startAt, Time endAt, Set<Student> students) {

}
