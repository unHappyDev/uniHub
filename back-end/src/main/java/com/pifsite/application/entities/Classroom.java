package com.pifsite.application.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.UUID;

import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "classrooms")
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID classroomId;

    @ManyToOne
    @JoinColumn(name = "professor")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "subject")
    private Subject subject;

    private String semester;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClassroomSchedule> schedules = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "classrooms_students", 
        joinColumns = @JoinColumn(name = "fk_classroom_id"), 
        inverseJoinColumns = @JoinColumn(name = "fk_student_id"))
    private Set<Student> students = new HashSet<>();

}
