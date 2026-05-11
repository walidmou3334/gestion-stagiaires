package com.backend.backend.config;

import com.backend.backend.entity.Compte;
import com.backend.backend.entity.Role;
import com.backend.backend.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CompteRepository compteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!compteRepository.existsByUsername("superadmin")) {

            Compte admin = Compte.builder()
                    .username("superadmin")
                    .email("admin@app.com")
                    .motDePasse(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();

            compteRepository.save(admin);

            System.out.println("SUPER ADMIN CREATED");
        }
    }
}