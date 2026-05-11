package com.backend.backend.repository;

import com.backend.backend.entity.Evaluation;
import com.backend.backend.entity.StageAffectation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    Optional<Evaluation> findByStage(StageAffectation stage);

    List<Evaluation> findByStage_Candidature_Candidat_Id(Long candidatId);

    List<Evaluation> findByStage_Encadrant_Id(Long encadrantId);
}