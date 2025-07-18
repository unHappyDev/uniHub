package com.pifsite.application.entities;

import com.pifsite.application.enums.UserRoles;

import jakarta.persistence.InheritanceType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "User")
public class User{
    
    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    private String name;
    private String email;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private UserRoles role;

    @Override
    public String toString() {
        return "User [userId=" + userId + ", name=" + name + ", email=" + email + ", password=" + password + ", role="
                + role + "]";
    }
}
