package com.backend.backend.service;

import com.backend.backend.dto.StageAffectationRequest;
import com.backend.backend.dto.StageAffectationResponse;
import com.backend.backend.entity.*;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StageAffectationService {

    private final StageAffectationRepository stageRepository;
    private final CandidatureRepository candidatureRepository;
    private final EncadrantRepository encadrantRepository;
    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;

    public StageAffectationResponse affecterStage(StageAffectationRequest request) {
        Candidature candidature = candidatureRepository.findById(request.getCandidatureId())
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        if (candidature.getStatut() != StatutCandidature.ACCEPTEE) {
            throw new RuntimeException("La candidature doit être acceptée avant l'affectation");
        }

        if (stageRepository.findByCandidature(candidature).isPresent()) {
            throw new RuntimeException("Cette candidature est déjà affectée à un stage");
        }

        Encadrant encadrant = encadrantRepository.findById(request.getEncadrantId())
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        StageAffectation stage = StageAffectation.builder()
                .candidature(candidature)
                .encadrant(encadrant)
                .sujetFinal(request.getSujetFinal())
                .service(request.getService())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .statut(StatutStage.EN_COURS)
                .build();

        return mapToResponse(stageRepository.save(stage));
    }

    public List<StageAffectationResponse> getAllStages() {
        return stageRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<StageAffectationResponse> getMesStages(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        return stageRepository.findByCandidature_Candidat_Id(candidat.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StageAffectationResponse terminerStage(Long id) {
        StageAffectation stage = stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));

        stage.setStatut(StatutStage.TERMINE);
        return mapToResponse(stageRepository.save(stage));
    }

    public StageAffectationResponse annulerStage(Long id) {
        StageAffectation stage = stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));

        stage.setStatut(StatutStage.ANNULE);
        return mapToResponse(stageRepository.save(stage));
    }

    private StageAffectationResponse mapToResponse(StageAffectation s) {
        Candidature c = s.getCandidature();
        Candidat candidat = c.getCandidat();
        Encadrant e = s.getEncadrant();

        return StageAffectationResponse.builder()
                .id(s.getId())
                .sujetFinal(s.getSujetFinal())
                .service(s.getService())
                .dateDebut(s.getDateDebut())
                .dateFin(s.getDateFin())
                .statut(s.getStatut())
                .candidatureId(c.getId())
                .domaineStage(c.getDomaineStage())
                .sujetPropose(c.getSujetPropose())
                .nomCandidat(candidat != null ? candidat.getNom() : null)
                .prenomCandidat(candidat != null ? candidat.getPrenom() : null)
                .encadrantId(e.getId())
                .nomEncadrant(e.getNom())
                .prenomEncadrant(e.getPrenom())
                .emailEncadrant(e.getCompte()!=null?
                        e.getCompte().getEmail():null)
                .serviceEncadrant(e.getService())
                .specialiteEncadrant(e.getSpecialite())
                .build();
    }
    public List<StageAffectationResponse> getStagesEncadrant(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Encadrant encadrant = encadrantRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        return stageRepository.findAll()
                .stream()
                .filter(s -> s.getEncadrant().getId().equals(encadrant.getId()))
                .map(this::mapToResponse)
                .toList();
    }
}