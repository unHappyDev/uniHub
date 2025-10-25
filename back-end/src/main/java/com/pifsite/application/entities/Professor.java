package com.pifsite.application.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.MapsId;
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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "professors")
public class Professor {

    @Id
    private UUID professorId;

    @MapsId
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "professor_id")
    private User user;

    @OneToMany(mappedBy = "professor")
    private Set<Classroom> classrooms = new HashSet<>();

}
