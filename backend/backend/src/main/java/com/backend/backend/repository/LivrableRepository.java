package com.backend.backend.repository;

import com.backend.backend.entity.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LivrableRepository extends JpaRepository<Livrable, Long> {

    List<Livrable> findByStage_Id(Long stageId);

    List<Livrable> findByStage_Candidature_Candidat_Id(Long candidatId);

    List<Livrable> findByStage_Encadrant_Id(Long encadrantId);
}