package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.User;
import com.pifsite.application.dto.UserDTO;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @Query("SELECT new com.pifsite.application.dto.UserDTO(u.id, u.username, u.email, u.role) FROM User u")
    List<UserDTO> getAllUsers();
}
