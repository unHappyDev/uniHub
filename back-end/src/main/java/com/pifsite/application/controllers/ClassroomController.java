package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import com.pifsite.application.service.ClassroomService;
import com.pifsite.application.dto.CreateClassroomDTO;
import com.pifsite.application.entities.Classroom;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/classroom")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping
    public ResponseEntity<?> getAllClassrooms(){

        List<Classroom> Classrooms = classroomService.getAllClassrooms();
        return ResponseEntity.ok(Classrooms); // não está muito bom ainda tem que arrumar dps

    }

    @PostMapping
    public ResponseEntity<?> createClassroom(@RequestBody CreateClassroomDTO ClassroomDTO){

        classroomService.createClassroom(ClassroomDTO);
        return ResponseEntity.ok("Classroom created");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        classroomService.deleteOneClassroom(id);
        return ResponseEntity.ok("Classroom successfully deleted.");
    }
}
