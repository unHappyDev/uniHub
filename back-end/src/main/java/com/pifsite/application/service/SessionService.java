package com.pifsite.application.service;

import com.pifsite.application.exceptions.InvalidTokenException;
import com.pifsite.application.exceptions.ExpiredTokenException;
import com.pifsite.application.repository.SessionRepository;
import com.pifsite.application.entities.Session;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session validateSession(String token) {

        if (token == null || token.isBlank()) {
            throw new InvalidTokenException("Token not informed");
        }

        Session session = sessionRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Token invalid"));

        if (!session.getExpiresAt().isAfter(OffsetDateTime.now())) {

            // System.out.println(session.getExpiresAt() + " " + OffsetDateTime.now());

            throw new ExpiredTokenException("Token expired");
        }

        return session;
    }
}
