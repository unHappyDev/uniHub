package com.pifsite.application.entities;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "professors")
public class Professor{

    @Id
    private UUID professorId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "professor_id")
    private User user;

}
