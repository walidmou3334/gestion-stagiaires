package com.backend.backend.repository;

import com.backend.backend.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByUsername(String username);
    Optional<Compte> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
