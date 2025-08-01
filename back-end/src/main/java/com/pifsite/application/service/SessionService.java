package com.pifsite.application.service;

import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.InvalidTokenException;
import com.pifsite.application.exceptions.ExpiredTokenException;
import com.pifsite.application.repository.SessionRepository;
import com.pifsite.application.entities.Session;

import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session validateSession(String sessionId){

        if(sessionId == null || sessionId.isBlank()){
            throw new InvalidTokenException("Invalid or not informed token");
        }

        return sessionRepository.findById(UUID.fromString(sessionId))
            .filter(s -> s.getExpiresAt() != null)
            .filter(s -> s.getExpiresAt().isAfter(OffsetDateTime.now()))
            .orElseThrow(() -> new ExpiredTokenException("Invalid or expired token"));
    }
}
