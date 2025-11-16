package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ConflictException;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.dto.CreateUserDTO;
import com.pifsite.application.enums.UserRoles;
import com.pifsite.application.entities.User;
import com.pifsite.application.dto.UserDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${pepper}")
    private String pepper;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public List<UserDTO> getAllUsers() {

        List<UserDTO> users = this.userRepository.getAllUsers();

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("there is no users in the database");
        }

        return users;
    }

    public User createUser(CreateUserDTO registerUserDTO) {

        if (this.userRepository.findByEmail(registerUserDTO.email()).isPresent()) {
            System.out.println(this.userRepository.findByEmail(registerUserDTO.email()));
            throw new ConflictException("User already exists");
        }

        User newUser = new User();

        newUser.setEmail(registerUserDTO.email());
        newUser.setUsername(registerUserDTO.name());
        newUser.setRole(UserRoles.fromString(registerUserDTO.role()));
        newUser.setPassword(passwordEncoder.encode(registerUserDTO.password() + pepper));
        newUser.setIsActive(true);

        return this.userRepository.save(newUser);
    }

    public void updateUser(CreateUserDTO registerUserDTO, UUID id) {

        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found"));

        if (registerUserDTO.email() != null && !registerUserDTO.email().isBlank()) {

            user.setEmail(registerUserDTO.email());
        }
        if (registerUserDTO.name() != null && !registerUserDTO.name().isBlank()) {

            user.setUsername(registerUserDTO.name());
        }
        if (registerUserDTO.role() != null && !registerUserDTO.role().isBlank()) {

            user.setRole(UserRoles.fromString(registerUserDTO.role()));
        }
        if (registerUserDTO.password() != null && !registerUserDTO.password().isBlank()) {

            user.setPassword(passwordEncoder.encode(registerUserDTO.password() + pepper));
        }

        this.userRepository.save(user);

    }

    public void deleteOneUser(UUID userId) {

        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User reqUser = (User) userData.getPrincipal();

        if (reqUser.getRole() != UserRoles.ADMIN) {
            throw new UnauthorizedActionException("you can't delete this user");
        }

        if (user.equals(reqUser)) {
            throw new ConflictException("you can't delete this user while loged with it");
        }

        try {
            this.userRepository.deleteById(userId);

        } catch (DataIntegrityViolationException err) {

            throw new EntityInUseException(
                    "This user is still linked to other entities in the application, like student or professor");

        } catch (Exception err) {

            System.out.println(err.getClass());
        }
    }
}
