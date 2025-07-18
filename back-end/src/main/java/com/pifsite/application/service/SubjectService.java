package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.SubjectRepository;
import com.pifsite.application.dto.CreateSubjectDTO;
import com.pifsite.application.entities.Subject;
import com.pifsite.application.enums.UserRoles;
import com.pifsite.application.dto.SubjectDTO;
import com.pifsite.application.entities.User;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<SubjectDTO> getAllSubjects(){ // trocar para retornar um DTO depois

        List<SubjectDTO> subjects = this.subjectRepository.getAllSubjects();

        if(subjects.isEmpty()){
            throw new ResourceNotFoundException("there is no posts in the database"); // melhorar depois
        }

        return subjects;
    }

    public void crateSubject(CreateSubjectDTO subjectDTO){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)userData.getPrincipal();
        
        if(user.getRole() != UserRoles.ADMIN){
            throw new UnauthorizedActionException("You can't create new subjects");
        }

        Subject newSubject = new Subject();
        newSubject.setSubjectName(subjectDTO.subjectName());
        newSubject.setWorkloadHours(subjectDTO.workloadHours());

        this.subjectRepository.save(newSubject);
    }

    public void deleteOneSubject(UUID subjectId){

        this.subjectRepository.findById(subjectId).orElseThrow(() -> new ResourceNotFoundException("Subject with ID " + subjectId + " not found"));

        try{
            this.subjectRepository.deleteById(subjectId);
            
        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("This subjects has other entities linked to it in the application, like students, professors or classrooms");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }
    }
}
