package com.pifsite.application.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
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

import com.pifsite.application.service.ClassroomService;
import com.pifsite.application.dto.CreateClassroomDTO;
import com.pifsite.application.dto.ClassroomDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/classroom")
@Tag(name = "ClassroomController", description = "Endpoints to get, create, delete and update professors")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping
    @Operation(summary = "Get Classroom", description = "Get all Classrooms from database")
    public ResponseEntity<?> getAllClassrooms() {

        Set<ClassroomDTO> Classrooms = classroomService.getAll();
        return ResponseEntity.ok(Classrooms);
    }

    @PostMapping
    @PreAuthorize("hasRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString())")
    @Operation(summary = "Create Classroom", description = "Create a Classroom save on the database")
    public ResponseEntity<?> createClassroom(@RequestBody CreateClassroomDTO ClassroomDTO) {

        classroomService.createClassroom(ClassroomDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Classroom created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Classroom", description = "Update a Classroom on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> updateClassroom(@RequestBody CreateClassroomDTO classroomDTO, @PathVariable UUID id) {

        classroomService.updateClassroom(classroomDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Classroom Atualizada");
    }

    @PutMapping("addStudents/{id}")
    @Operation(summary = "Update Classroom", description = "Update a Classroom on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString(), T(com.pifsite.application.enums.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> addStudent(@RequestBody List<UUID> studentsId, @PathVariable UUID id) {

        classroomService.addStudent(id, studentsId);
        return ResponseEntity.status(HttpStatus.OK).body("Classroom Atualizada");
    }

    @DeleteMapping("removeStudents/{id}")
    @PreAuthorize("hasRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString())")
    @Operation(summary = "Delete Classroom", description = "Delete a Classroom on database by its ID")
    public ResponseEntity<String> deleteUser(@RequestBody List<UUID> studentsId, @PathVariable UUID id) {

        classroomService.removeStudent(id, studentsId);
        return ResponseEntity.ok("Students successfully removed from classroom.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole(T(com.pifsite.application.enums.UserRoles).ADMIN.toString())")
    @Operation(summary = "Delete Classroom", description = "Delete a Classroom on database by its ID")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        classroomService.deleteOneClassroom(id);
        return ResponseEntity.ok("Classroom successfully deleted.");
    }
}
