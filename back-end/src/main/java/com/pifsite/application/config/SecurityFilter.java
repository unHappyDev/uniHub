package com.pifsite.application.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import com.pifsite.application.exceptions.InvalidTokenException;
import com.pifsite.application.exceptions.ExpiredTokenException;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.service.SessionService;
import com.pifsite.application.entities.Session;
import com.pifsite.application.entities.User;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.ServletException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;

import java.util.Collections;
import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SessionService sessionService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        try{

            String sessionToken = this.recoverToken(request);
            Session session = sessionService.validateToken(sessionToken);

            User user = session.getUser();

            var authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()));

            var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);

        }catch(InvalidTokenException | ExpiredTokenException err){

            response.sendError(HttpServletResponse.SC_FORBIDDEN, err.getMessage());
            return;
        }
    }

    private String recoverToken(HttpServletRequest request){

        Cookie[] cookies = request.getCookies();
    
        if (cookies == null) {
            return null;
        }
        
        for (Cookie cookie : cookies) {
            if ("session_id".equals(cookie.getName())) {
                return cookie.getValue(); 
            }
        }
        
        return null; 
    }
}
