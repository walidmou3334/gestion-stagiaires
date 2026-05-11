package com.backend.backend.repository;

import com.backend.backend.entity.Candidat;
import com.backend.backend.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidatRepository extends JpaRepository<Candidat, Long> {
    Optional<Candidat> findByCompte(Compte compte);
}