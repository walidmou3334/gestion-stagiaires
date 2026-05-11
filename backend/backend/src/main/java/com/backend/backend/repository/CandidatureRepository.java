package com.backend.backend.repository;

import com.backend.backend.entity.Candidature;
import com.backend.backend.entity.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByCandidat(Candidat candidat);

    Optional<Candidature> findByIdAndCandidat(Long id, Candidat candidat);
}