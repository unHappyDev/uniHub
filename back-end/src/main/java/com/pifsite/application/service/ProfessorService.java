package com.pifsite.application.service;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.exceptions.EntityInUseException;
import com.pifsite.application.repository.ProfessorRepository;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.dto.CreateProfessorDTO;
import com.pifsite.application.dto.SmallClassroomDTO;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.entities.Professor;
import com.pifsite.application.dto.CreateUserDTO;
import com.pifsite.application.dto.ProfessorDTO;
import com.pifsite.application.entities.User;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.UUID;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public List<ProfessorDTO> getAllProfessors(){ // trocar para retornar um DTO depois

        List<Professor> Professors = this.professorRepository.findAll();

        if(Professors.isEmpty()){
            throw new ResourceNotFoundException("there is no Professors in the database"); // melhorar depois
        }

        return professorRepository.findAll().stream()
                .map(professor -> {
                    var classroomsDTO = professor.getClassrooms().stream()
                            .map(c -> new SmallClassroomDTO(
                                    c.getSubject().getSubjectName(),
                                    c.getSemester()
                            ))
                            .collect(Collectors.toSet());

                    return new ProfessorDTO(
                            professor.getUser().getUsername(),
                            professor.getUser().getEmail(),
                            professor.getUser().getRole(),
                            classroomsDTO
                    );
                })
                .collect(Collectors.toList());
    
    }

    @Transactional
    public void createProfessor(CreateProfessorDTO registerProfessorDTO){

        User user = new User();

        if(registerProfessorDTO.userId() == null){

            CreateUserDTO registerUser = registerProfessorDTO.registerUser();

            user.setUsername(registerUser.name());
            user.setEmail(registerUser.email());
            user.setPassword(passwordEncoder.encode(registerUser.password()));
            user.setRole(UserRoles.PROFESSOR);
            user.setIsActive(true);

        }else{
            user = userRepository.findById(registerProfessorDTO.userId()).orElseThrow(() -> new ResourceNotFoundException("User with ID " + registerProfessorDTO.userId() + " not found"));
        }


        Professor professor = new Professor();

        professor.setUser(user);
        
        professorRepository.save(professor);
    }

    public void deleteOneProfessor(UUID professorId){

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User reqUser = (User)userData.getPrincipal();

        if(reqUser.getRole() != UserRoles.ADMIN){
            throw new RuntimeException("you can't delete this user");
        }

        this.professorRepository.findById(professorId).orElseThrow(() -> new ResourceNotFoundException("Professor with ID " + professorId + " not found"));;

        try{
            this.professorRepository.deleteById(professorId);

        }catch(DataIntegrityViolationException err){

            throw new EntityInUseException("This professor is still linked to other entities in the application, like classrooms, subjects, attendances or grades");

        }catch(Exception err){

            System.out.println("This error was not treated yet: " + err.getClass());
        }


        this.userRepository.deleteById(professorId);
    }
}
