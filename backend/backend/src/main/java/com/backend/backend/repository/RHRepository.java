package com.backend.backend.repository;

import com.backend.backend.entity.Compte;
import com.backend.backend.entity.RH;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RHRepository extends JpaRepository<RH, Long> {
    Optional<RH> findByCompte(Compte compte);
}