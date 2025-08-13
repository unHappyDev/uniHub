package com.pifsite.application.service;

import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.InvalidTokenException;
import com.pifsite.application.exceptions.ExpiredTokenException;
import com.pifsite.application.repository.SessionRepository;
import com.pifsite.application.entities.Session;

import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session validateSession(String token){

        if(token == null || token.isBlank()){
            throw new InvalidTokenException("Invalid or not informed token");
        }

        return sessionRepository.findByToken(token)
            .filter(s -> s.getExpiresAt() != null)
            .filter(s -> s.getExpiresAt().isAfter(OffsetDateTime.now()))
            .orElseThrow(() -> new ExpiredTokenException(" Token invalid or expired"));

    }
}
