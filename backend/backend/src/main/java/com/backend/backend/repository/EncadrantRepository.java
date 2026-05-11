package com.backend.backend.repository;

import com.backend.backend.entity.Compte;
import com.backend.backend.entity.Encadrant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EncadrantRepository extends JpaRepository<Encadrant, Long> {
    Optional<Encadrant> findByCompte(Compte compte);
}
