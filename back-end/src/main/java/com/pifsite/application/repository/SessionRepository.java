package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pifsite.application.entities.Session;

import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByToken(String token);

}
