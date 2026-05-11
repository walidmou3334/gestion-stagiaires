package com.backend.backend.repository;

import com.backend.backend.entity.Candidature;
import com.backend.backend.entity.StageAffectation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StageAffectationRepository extends JpaRepository<StageAffectation, Long> {

    Optional<StageAffectation> findByCandidature(Candidature candidature);

    List<StageAffectation> findByCandidature_Candidat_Id(Long candidatId);
}