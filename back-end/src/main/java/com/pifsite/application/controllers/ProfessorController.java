package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.ProfessorService;
import com.pifsite.application.entities.Professor;
import com.pifsite.application.dto.CreateUserDTO;
// import com.pifsite.application.dto.ProfessorDTO;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/professor")
public class ProfessorController {

    private final ProfessorService ProfessorService;

    public ProfessorController(com.pifsite.application.service.ProfessorService professorService) {
        ProfessorService = professorService;
    }

    @GetMapping
    public ResponseEntity<?> getAllProfessors(){

        List<Professor> professors = ProfessorService.getAllProfessors();
        return ResponseEntity.ok(professors); // não está muito bom ainda tem que arrumar dps
    }

    @PostMapping
    public ResponseEntity<?> createProfessor(@RequestBody CreateUserDTO registerProfessorDTO){

        ProfessorService.createProfessor(registerProfessorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Professor created");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfessor(@PathVariable UUID id) {

        ProfessorService.deleteOneProfessor(id);
        return ResponseEntity.ok("Professor successfully deleted.");

    }
}
