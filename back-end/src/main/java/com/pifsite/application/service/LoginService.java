package com.pifsite.application.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.InvalidCredentialsException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.entities.User;
import com.pifsite.application.dto.LoginDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public String doLogin(LoginDTO loginDTO){
        
        User user = this.userRepository.findByEmail(loginDTO.email()).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        if(!passwordEncoder.matches(loginDTO.password(), user.getPassword())){

            throw new InvalidCredentialsException("login failed");
        }
        
        String token = this.tokenService.generateToken(user);

        return token;
    }

}
