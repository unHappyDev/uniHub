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

import com.pifsite.application.service.ProfessorService;
import com.pifsite.application.dto.CreateProfessorDTO;
import com.pifsite.application.dto.ProfessorDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/professor")
@Tag(name = "ProfessorController", description = "Endpoints to get, create, delete and update professors")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(com.pifsite.application.service.ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    @Operation(summary = "Get Professor", description = "Get all professors from database")
    public ResponseEntity<?> getAllProfessors() {

        List<ProfessorDTO> professors = professorService.getAllProfessors();
        return ResponseEntity.ok(professors);
    }

    @PostMapping
    @Operation(summary = "Create Professor", description = "Create a professor and save on the database")
    public ResponseEntity<?> createProfessor(@RequestBody CreateProfessorDTO registerProfessorDTO) {

        professorService.createProfessor(registerProfessorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Professor created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update User", description = "Update a User on database by its ID")
    public ResponseEntity<?> updateProfessor(@RequestBody CreateProfessorDTO registerProfessorDTO,
            @PathVariable UUID id) {

        professorService.updateProfessor(registerProfessorDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Professor Atualizado");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Professor", description = "Delete a professor on database by its ID")
    public ResponseEntity<String> deleteProfessor(@PathVariable UUID id) {

        professorService.deleteOneProfessor(id);
        return ResponseEntity.ok("Professor successfully deleted.");
    }
}
