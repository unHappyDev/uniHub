package com.pifsite.application.service;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.JWT;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pifsite.application.entities.User;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.Instant;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user){
        try {

            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                            .withIssuer("user")
                            .withSubject(user.getId().toString())
                            .withClaim("email", user.getEmail())
                            .withExpiresAt(this.generateExpirationDate())
                            .sign(algorithm);

            return token;

        }catch(JWTCreationException err){
            throw new RuntimeException("there was an error generating the token");
        }
    }

    public String validateToken(String token){
        try {

            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.require(algorithm)
                        .withIssuer("user")
                        .build()
                        .verify(token)
                        .getClaim("email").asString();

        }catch(JWTVerificationException err){
            return null;
        }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
