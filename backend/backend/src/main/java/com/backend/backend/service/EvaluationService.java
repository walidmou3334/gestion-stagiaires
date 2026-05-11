package com.backend.backend.service;

import com.backend.backend.dto.EvaluationRequest;
import com.backend.backend.dto.EvaluationResponse;
import com.backend.backend.entity.*;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final StageAffectationRepository stageRepository;
    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;
    private final EncadrantRepository encadrantRepository;

    public EvaluationResponse creerEvaluation(String username, EvaluationRequest request) {

        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Encadrant encadrant = encadrantRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        StageAffectation stage = stageRepository.findById(request.getStageId())
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));

        if (!stage.getEncadrant().getId().equals(encadrant.getId())) {
            throw new AccessDeniedException("Ce stage n'appartient pas à cet encadrant");
        }

        if (evaluationRepository.findByStage(stage).isPresent()) {
            throw new RuntimeException("Ce stage possède déjà une évaluation");
        }

        if (request.getNote() == null || request.getNote() < 0 || request.getNote() > 20) {
            throw new RuntimeException("La note doit être entre 0 et 20");
        }

        Evaluation evaluation = Evaluation.builder()
                .stage(stage)
                .note(request.getNote())
                .appreciation(request.getAppreciation())
                .statut(request.getStatut())
                .dateEvaluation(LocalDateTime.now())
                .build();

        if (request.getStatut() == null) {
            evaluation.setStatut(request.getNote() >= 10 ? StatutEvaluation.VALIDE : StatutEvaluation.NON_VALIDE);
        }

        stage.setStatut(StatutStage.TERMINE);
        stageRepository.save(stage);

        return mapToResponse(evaluationRepository.save(evaluation));
    }

    public List<EvaluationResponse> getEvaluationsEncadrant(String username) {

        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Encadrant encadrant = encadrantRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        return evaluationRepository.findByStage_Encadrant_Id(encadrant.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<EvaluationResponse> getMesEvaluations(String username) {

        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        return evaluationRepository.findByStage_Candidature_Candidat_Id(candidat.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<EvaluationResponse> getAllEvaluations() {
        return evaluationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EvaluationResponse mapToResponse(Evaluation e) {

        StageAffectation stage = e.getStage();
        Candidature candidature = stage.getCandidature();
        Candidat candidat = candidature.getCandidat();
        Encadrant encadrant = stage.getEncadrant();

        return EvaluationResponse.builder()
                .id(e.getId())
                .note(e.getNote())
                .appreciation(e.getAppreciation())
                .dateEvaluation(e.getDateEvaluation())
                .statut(e.getStatut())
                .stageId(stage.getId())
                .sujetFinal(stage.getSujetFinal())
                .service(stage.getService())
                .nomCandidat(candidat != null ? candidat.getNom() : null)
                .prenomCandidat(candidat != null ? candidat.getPrenom() : null)
                .nomEncadrant(encadrant != null ? encadrant.getNom() : null)
                .prenomEncadrant(encadrant != null ? encadrant.getPrenom() : null)
                .build();
    }
}