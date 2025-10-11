package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.UserService;
import com.pifsite.application.dto.CreateUserDTO;
import com.pifsite.application.dto.UserDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/user")
@Tag(name = "UserController", description = "Endpoints to get, create, delete and update professors")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get User", description = "Get all Users from database")
    public ResponseEntity<?> getAllUsers(){

        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @Operation(summary = "Create User", description = "Create a User and save on the database")
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO registerUserDTO){

        userService.createUser(registerUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update User", description = "Update a User on database by its ID")
    public ResponseEntity<?> updateUser(@RequestBody CreateUserDTO registerUserDTO, @PathVariable UUID id){
        
        userService.updateUser(registerUserDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Usuário Atualizado");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete User", description = "Delete a User on database by its ID")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        userService.deleteOneUser(id);
        return ResponseEntity.ok("User successfully deleted.");
    }
}
