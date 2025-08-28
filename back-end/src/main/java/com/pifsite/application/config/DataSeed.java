package com.pifsite.application.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.SessionRepository;
import com.pifsite.application.repository.UserRepository;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.entities.Session;
import com.pifsite.application.entities.User;

import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DataSeed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;


    public DataSeed(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public void run(String... args) throws Exception {
            
        User ds = new User(null, "default_student", "ds@email.com", "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy", UserRoles.USER, true);
        
        User dp = new User(null, "default_professor", "dp@email.com", "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy", UserRoles.PROFESSOR, true);
        
        User da = new User(null, "default_admin", "da@email.com", "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy", UserRoles.ADMIN, true);

        userRepository.saveAll(List.of(da, dp, ds));

        User db_ds = userRepository.findByEmail("ds@email.com").orElseThrow(() -> new ResourceNotFoundException("error updating data_seed"));
        User db_dp = userRepository.findByEmail("dp@email.com").orElseThrow(() -> new ResourceNotFoundException("error updating data_seed"));
        User db_da = userRepository.findByEmail("da@email.com").orElseThrow(() -> new ResourceNotFoundException("error updating data_seed"));

        Session s_ds = new Session();
        s_ds.setToken("33333-33333-33333-33333");
        s_ds.setUser(db_ds);
        s_ds.setExpiresAt(OffsetDateTime.now().plusHours(3));
        
        Session s_dp = new Session();
        s_dp.setToken("22222-22222-22222-22222");
        s_dp.setUser(db_dp);
        s_dp.setExpiresAt(OffsetDateTime.now().plusHours(3));
        
        Session s_da = new Session();
        s_da.setToken("11111-11111-11111-11111");
        s_da.setUser(db_da);
        s_da.setExpiresAt(OffsetDateTime.now().plusHours(3));
        
        sessionRepository.saveAll(List.of(s_ds, s_dp, s_da));

        System.out.println("Usuários e sessões criadas, é pra funcionar!, teoricamente...");

    }
}