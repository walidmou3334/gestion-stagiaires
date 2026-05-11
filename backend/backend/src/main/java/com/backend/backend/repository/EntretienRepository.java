package com.backend.backend.repository;

import com.backend.backend.entity.Candidature;
import com.backend.backend.entity.Entretien;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EntretienRepository extends JpaRepository<Entretien, Long> {

    Optional<Entretien> findByCandidature(Candidature candidature);

    List<Entretien> findByCandidature_Candidat_Id(Long candidatId);
}